import http from 'http'
import chromedriver from 'chromedriver'
import webdriver from 'selenium-webdriver'
import tcpPortUsed from 'tcp-port-used'
import path from 'path'
import fs from 'fs'
import os from 'os'
const {Builder, By, Key, until, WebDriver} = require('selenium-webdriver')
const Http = require('selenium-webdriver/http')
let driver, t
let executor, sessionID

const modifierKeys = [
  Key.CTRL,
  Key.ALT,
  Key.SHIFT,
  Key.META,
]
let keyPrintMap = new Map()
for (let each of Array.from('~!@#$%^&*()_+|}{POIUYTREWQASDFGHJKL:"?><MNBVCXZ"}'+"`1234567890-=\\][poiuytrewqasdfghjkl;'/.,mnbvcxz'")) {
  keyPrintMap.set(each, each)
}
let specialKeys = {

}

class Tester {
  constructor ({name, driver, rootSelector, commentSelector, keySelector, parent}) {
    if (typeof(rootSelector)!=='string') throw Error('root selector must be a string')
    this.parent = parent
    this.parent.tasks[name] = this
    this.name = name
    this.driver = driver
    this.d = this.driver
    this.rootSelector = rootSelector
    let root = driver.findElement(By.css(rootSelector))
    this.root = root
    this.r = root
    this.commentSelector = commentSelector || 'span.selenium-comment'
    this.keySelector = keySelector || 'span.selenium-key'
    this.running = true
    let template=`
      if (!window.seleniumRoot) {
        window.seleniumRoot = new Map()
        window.seleniumComment = new Map()
        window.seleniumKey = new Map()
      }
      let root = document.querySelector("${this.rootSelector}")
      if (!root) { throw Error(\`no root element found with css(${this.rootSelector})\`) }
      window.seleniumRoot.set("${this.name}", root)
      let comment = root.querySelector("${this.commentSelector}")
      if (!comment) { throw Error(\`no comment element found with css(${this.commentSelector})\`) }
      window.seleniumComment.set("${this.name}", comment)
      let key = root.querySelector("${this.keySelector}")
      if (!key) { throw Error(\`no key element found with css(${this.commentSelector})\`) }
      window.seleniumKey.set("${this.name}", key)
    `
    let result = this.driver.executeScript(template)
  }
  setRunning (bool) {
    this.running = bool
  }
  async sendKeys({keys, interval, delay}) {
    if (!Array.isArray(keys)) {
      keys = Array.from(keys)
    }
    if (delay){
      await this.driver.sleep(delay)
    }
    for (let each of keys) {
      if (!this.running) {
        this.changeComment('', null, each)
        throw Error('Stop in sendKeys at sending:', each)
      }
      let actions = this.driver.actions()
      if (Array.isArray(each)) {
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
      } else {
        await actions.sendKeys(each).perform()
      }
      if (interval) {
        await this.driver.sleep(interval)
      }
    }
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
    }
    let template=`
      window.seleniumComment.get("${this.name}").textContent = \`${comment}\`
    `
    let result = this.driver.executeScript(template)
    if (stop) {
      throw Error('Stop in comment with comment:', raw_comment)
    }
    if (delay) {
      await this.driver.sleep(delay)
    }
  }
  async changeKey (key) {
    let template=`
      window.seleniumKey.get("${this.name}").textContent = \`${key}\`
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
    if (sessionID) {
      this.driver = await new WebDriver( sessionID, executor )
    } else {
      this.driver = await new Builder()
        .forBrowser(browser)
        .build()
      sessionID = await this.driver.getSession()
      sessionID = sessionID.id_
      executor = await this.driver.getExecutor()
    }
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
        console.log('do test:', name)
        if (!this.tests[name]) {
          console.log(this.tests)
          throw Error('no test named', name)
        }
        if (!(this.tasks[name] && this.tasks[name].running)) {
          this.tests[name]({
            name,
            Key,
            By,
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
