import http from 'http'
import chromedriver from 'chromedriver'
import webdriver from 'selenium-webdriver'
import tcpPortUsed from 'tcp-port-used'
import path from 'path'
import fs from 'fs'
import os from 'os'
const {Builder, By, Key, until, WebDriver, Button, Origin, WebElement} = require('selenium-webdriver')
const {Options} = require('selenium-webdriver/chrome')
const Http = require('selenium-webdriver/http')
let driver, t
let executor, sessionID

let normalKeys = Array.from('~!@#$%^&*()_+|}{POIUYTREWQASDFGHJKL:"?><MNBVCXZ"}'+"`1234567890-=\\][poiuytrewqasdfghjkl;'/.,mnbvcxz'")
const modifierKeys = [
  Key.CTRL,
  Key.ALT,
  Key.SHIFT,
  Key.META,
]
let keyPrintMap = new Map()
for (let each of normalKeys) {
  keyPrintMap.set(each, each)
}
let specialKeys = {

}
/* selenium actions
  actions.click(element)
  actions.contextClick(element)
  actions.doubleClick(element)
  actions.dragAndDrop(from, to)
  actions.keyDown(key)
  actions.keyUp(key)
  actions.move({
    duration: 100, origin: (Origin, WebElement), x, y
  })
  action.press(Button)
  action.press(Button)
*/
class Tester {
  constructor ({name, driver, rootSelector, parent}) {
    if (typeof(rootSelector)!=='string') throw Error('root selector must be a string')
    this.parent = parent
    this.parent.tasks[name] = this
    this.name = name
    this.driver = driver
    this.d = this.driver
    this.rootSelector = rootSelector
    let root = driver.findElement(By.css(rootSelector))
    let testEnv = driver.findElement(By.css('#test-env'))
    this.testEnv = testEnv
    this.root = root
    this.r = root
    this.running = true
    let template=`
      if (!window.seleniumRoot) {
        window.seleniumRoot = new Map()
      }
      let root = document.querySelector("${this.rootSelector}")
      if (!root) { throw Error(\`no root element found with css(${this.rootSelector})\`) }
      window.seleniumRoot.set("${this.name}", root)

      window.testEnv = document.querySelector("#test-env")
      window.seleniumTestInfo = window.testEnv.querySelector(".test-info")
      window.seleniumComment = window.testEnv.querySelector("span.selenium-comment")
      window.seleniumAction = window.testEnv.querySelector("span.selenium-action")
      window.seleniumWorking = window.testEnv.querySelector("span.selenium-working")
      window.seleniumWorking.textContent = "${this.name}"
    `
    this.driver.executeScript(template)
  }
  setRunning (bool) {
    this.running = bool
  }
  async initScroll () {
    await this.changeComment(`Starting test: ${this.name}`)
    await this.scrollIntoView(this.root)
  }
  async scrollIntoView (el, top) {
    if (!top) top = 0
    this.driver.executeScript(`
      let el = arguments[0];
      let elementRect = el.getBoundingClientRect();
      let absoluteElementTop = elementRect.top - window.seleniumTestInfo.offsetHeight - ${top};
      console.log(elementRect.top, window.seleniumTestInfo.offsetHeight, top)
      if (absoluteElementTop>0) {
        window.scrollTo(0, absoluteElementTop)
      }
    `, el)
  }
  async actions({actions, interval, delay}) {
    //let window_size = await this.parent.window.getSize()
    //if (!Array.isArray(actions)) {
    //  actions = Array.from(actions)
    //}
    let this_actions
    if (!Array.isArray(actions) && typeof(actions) === 'object') {
       this_actions = [actions]
    } else {
      this_actions = actions
    }
    if (delay){
      await this.driver.sleep(delay)
    }
    for (let each of this_actions) {
      if (!this.running) {
        this.changeComment('', null, each)
        throw Error('Stop in sendKeys at sending:', each)
      }
      let actions = this.driver.actions({bridge: true})
      if (Array.isArray(each)) { // key with modifier
        let reversed = []
        for (let eacheach of each) {
          if (modifierKeys.includes(eacheach)) {
            actions = actions.keyDown(eacheach)
            reversed.push(eacheach)
          } else {
            actions = actions.sendKeys(eacheach)
          }
        }
        for (let eacheach of reversed.reverse()) {
          actions = actions.keyUp(eacheach)
        }
        await actions.perform()
      } else if (typeof(each) === 'object') {
        let keys = Object.keys(each)
        for (let eachkey of keys) {
          let value = each[eachkey]
          //if (value instanceof WebElement) {
          //  let pos = await value.getRect()
          //  console.log('pos:',pos, 'action:', eachkey)
          //}
          actions = actions[eachkey](value)
        }
        await actions.perform()
      } else {
        await actions.sendKeys(each).perform()
      }
      if (interval) {
        await this.driver.sleep(interval)
      }
    }
  }
  async changeWorking (name) {
    let template=`
      window.seleniumWorking.textContent = \`${name}\`
    `
    let result = this.driver.executeScript(template)
  }
  async changeComment (comment, delay, stopMessage) {
    let stop
    let raw_comment = comment
    if (!stopMessage && !this.running) {
      comment = ''
      stop = true
    }
    if (!comment) {
      this.running = false
      await this.changeWorking('')
    }
    let template=`
      window.seleniumComment.textContent = \`${comment}\`
    `
    let result = this.driver.executeScript(template)
    if (stop) {
      throw Error('Stop in comment with comment:', raw_comment)
    }
    if (delay) {
      await this.driver.sleep(delay)
    }
  }
  async changeAction (key) {
    let template=`
      window.seleniumAction.textContent = \`${key}\`
    `
    let result = this.driver.executeScript(template)
  }
}
class SeleniumTest {
  constructor ({options, tests}) {
    this.tests = tests
    let defaultOptions = {
    }
    this.options = Object.assign(defaultOptions, options)
    this.tasks = {}
  }
  apply (compiler) {
    let options = this.options
    compiler.plugin("compilation", compilation => {
      //console.log("Pre build...");
    })
    compiler.plugin("emit", function (compilation, callback) {
      callback()
      setTimeout(function() {
        this.init()
      }, 2000)
    })
  }
  async init () {
    console.log('init backend of vue-selenium-unittest')
    let options = this.options
    await this.openChrome(`http://localhost:${options.appPort}`)
    await this.createHttpServer(options.seleniumPort)
  }
  async openChrome(url) {
    let browser = 'chrome'
    if (this.options.window_size) {
      this.window_size = this.options.window_size
    } else {
      this.window_size = {height: 720, width: 720}
    }
    if (sessionID) {
      this.driver = await new WebDriver( sessionID, executor )
    } else {
      let options = new Options()
      options.addArguments(`--window-size=${this.window_size.width},${this.window_size.height}`)
      this.driver = await new Builder()
        .forBrowser(browser)
        .setChromeOptions(options)
        .build()
      sessionID = await this.driver.getSession()
      sessionID = sessionID.id_
      executor = await this.driver.getExecutor()
    }
    this.window = await this.driver.manage().window()
    //await this.window.setPosition(10, 10)
    //await this.window.setSize(400, 400)
    //console.log(await this.window.getSize())
    await this.driver.get(url)
    return this.driver
  }
  block ({name, rootSelector, commentSelector, keySelector}) {
    return new Tester({
      name, rootSelector, commentSelector, keySelector,
      driver: this.driver,
      parent: this
    })
  }
  async response ({req, res}) {
    res.writeHead(200, {
      'Content-Type': 'text/json',
      'Access-Control-Allow-Origin':'*',
      "Access-Control-Allow-Headers":"Authorization,Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods":"GET,POST"
    })
    if (req.method === 'POST') {
      let body = ''
      req.on('data', function (data) {
        body += data
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
        request.connection.destroy()
      })
      req.on('end', () => {
        let data = JSON.parse(body)
        if (!data.name) throw Error('shoud give name')
        let name = data.name
        res.write(JSON.stringify({ok: true, data: name}))
        res.end()
        console.log('start test:', name)
        if (!this.tests[name]) {
          console.log('exists tests:', Object.keys(this.tests))
          console.error('no test named', name)
          return
        }
        if (!(this.tasks[name] && this.tasks[name].running)) {
          this.tests[name]({
            name,
            Key,
            By,
            Button,
            Origin,
            until,
            driver: this.driver,
            Test: this
          }).then(() => {
            console.log('finish test:', name)
          }).catch(error => {
            if (!error.message.startsWith('Stop')) throw error
          })
        } else {
          console.log('stop test:', name)
          this.tasks[name].setRunning(false)
        }
      })
    } else {
      res.write(JSON.stringify({ok: false}))
      res.end()
    }
  }
  async createHttpServer(port) {
    let portUsed = await tcpPortUsed.check(port, 'localhost')
    if (!portUsed) {
      let server = http.createServer((req, res) => {
        this.response({req, res})
      }).listen(port)
      return server
      console.log('\tcreate new debug http server at', `http://localhost:${port}`)
    } else {
      console.log('\treuse old debug http server:', `http://localhost:${port}`)
    }
  }
}
export default SeleniumTest
