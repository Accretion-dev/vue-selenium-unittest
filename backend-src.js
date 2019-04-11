import http from 'http'
import chromedriver from 'chromedriver'
import webdriver from 'selenium-webdriver'
import tcpPortUsed from 'tcp-port-used'
import path from 'path'
import fs from 'fs'
import os from 'os'
const {Builder, By, Key, until, WebDriver, Button, WebElement} = require('selenium-webdriver')
const {Origin} = require('selenium-webdriver/lib/input')
const {Options} = require('selenium-webdriver/chrome')
const Http = require('selenium-webdriver/http')
let driver, t
let executor, sessionID

let normalKeys = Array.from('~!@#$%^&*()_+|}{POIUYTREWQASDFGHJKL:"?><MNBVCXZ"}'+"`1234567890-=\\][poiuytrewqasdfghjkl;'/.,mnbvcxz'")
const modifierKeys = [
  Key.CONTROL,
  Key.ALT,
  Key.SHIFT,
  Key.META,
]
let keyPrintMap = new Map()
for (let each of normalKeys) {
  keyPrintMap.set(each, each)
}
let specialKeys = [
  [Key.CONTROL, 'CONTROL'],
  [Key.ALT, 'ALT'],
  [Key.COMMAND, 'COMMAND'],
  [Key.META, 'META'],
  [Key.BACK_SPACE, '⌫'],
  [Key.TAB, "TAB"],
  [Key.RETURN, "⏎"],
  [Key.ENTER, "⏎"],
  [Key.SHIFT, "SHIFT"],
  [Key.PAUSE, "PAUSE"],
  [Key.ESCAPE, 'ESC'],
  [Key.SPACE, '⌴'],
  [Key.PAGE_UP, 'PgDown'],
  [Key.PAGE_DOWN, 'PgUP'],
  [Key.END, 'END'],
  [Key.HOME, 'HOME'],
  [Key.ARROW_LEFT, "←"],
  [Key.LEFT, "←"],
  [Key.ARROW_UP, "↑"],
  [Key.UP, "↑"],
  [Key.ARROW_RIGHT, "→"],
  [Key.RIGHT, "→"],
  [Key.ARROW_DOWN, "↓"],
  [Key.DOWN, "↓"],
  [Key.INSERT, "INS"],
  [Key.DELETE, "DEL"],
  [Key.SEMICOLON, ','],
  [Key.EQUALS, '='],
  [Key.NUMPAD0, 'NUMPAD0'],
  [Key.NUMPAD1, 'NUMPAD1'],
  [Key.NUMPAD2, 'NUMPAD2'],
  [Key.NUMPAD3, 'NUMPAD3'],
  [Key.NUMPAD4, 'NUMPAD4'],
  [Key.NUMPAD5, 'NUMPAD5'],
  [Key.NUMPAD6, 'NUMPAD6'],
  [Key.NUMPAD7, 'NUMPAD7'],
  [Key.NUMPAD8, 'NUMPAD8'],
  [Key.NUMPAD9, 'NUMPAD9'],
  [Key.MULTIPLY, 'MULTIPLY'],
  [Key.ADD, 'ADD'],
  [Key.SEPARATOR, 'SEPARATOR'],
  [Key.SUBTRACT, 'SUBTRACT'],
  [Key.DECIMAL, 'DECIMAL'],
  [Key.DIVIDE, 'DIVIDE'],
  [Key.F1, 'F1'],
  [Key.F2, 'F2'],
  [Key.F3, 'F3'],
  [Key.F4, 'F4'],
  [Key.F5, 'F5'],
  [Key.F6, 'F6'],
  [Key.F7, 'F7'],
  [Key.F8, 'F8'],
  [Key.F9, 'F9'],
  [Key.F10, 'F10'],
  [Key.F11, 'F11'],
  [Key.F12, 'F12'],
]
for (let each of specialKeys) {
  keyPrintMap.set(each[0], each[1])
}
keyPrintMap.set('`', '\\`')
keyPrintMap.set('\\', '\\\\')
const buttonMap = {
  'left': Button.LEFT,
  'right': Button.RIGHT,
  'middle': Button.MIDDLE,
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
  action.release(Button)
*/
function sumToTotal (x, N) {
  let X = Math.abs(x)
  let flag = x > 0 ? 1 : -1
  let result = []
  let step = Math.ceil(X/N)
  let sum = 0
  for (let index of Array(N)) {
    if (X > sum) {
      if (X - sum > step) {
        sum += step
        result.push(flag * step)
      } else {
        result.push(flag * (X - sum))
        sum = X
      }
    } else {
      result.push(0)
    }
  }
  return result
}
function smoothMove ({x, y, step}) {
  let nx, ny, xs, ys, N
  let result = []
  if (x && y) {
    nx = Math.ceil((Math.abs(x)/step).toFixed(0))
    ny = Math.ceil((Math.abs(y)/step).toFixed(0))
    N = nx > ny ? nx : ny
    xs = sumToTotal(x, N)
    ys = sumToTotal(y, N)
    xs.forEach((_, index) => {
      if (xs[index] || ys[index]) {
        result.push({x: xs[index], y: ys[index]})
      }
    })
  } else if (x && !y) {
    N = Math.ceil((Math.abs(x)/step).toFixed(0))
    xs = sumToTotal(x, N)
    xs.forEach((_, index) => {
      if (xs[index]) {
        result.push({x: xs[index], y: 0})
      }
    })
  } else if (!x && y) {
    N = Math.ceil((Math.abs(y)/step).toFixed(0))
    ys = sumToTotal(y, N)
    ys.forEach((_, index) => {
      if (ys[index]) {
        result.push({y: ys[index], x: 0})
      }
    })
  }
  return result
}
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
  }
  setRunning (bool) {
    this.running = bool
  }
  async init () {
    let template=`
      let root = document.querySelector("${this.rootSelector}")
      if (!root) { throw Error(\`no root element found with css(${this.rootSelector})\`) }
      window.seleniumData.roots.set("${this.name}", root)

      let testEnv = document.querySelector("#test-env")
      window.seleniumData.testInfo = testEnv.querySelector(".test-info")
      window.seleniumData.comment = ''
      window.seleniumData.action = ''
      window.seleniumData.working = "${this.name}"
    `
    await this.driver.executeScript(template)
  }
  async initScroll () {
    await this.changeComment(`Starting test: ${this.name}`)
    await this.scrollIntoView(this.root)
  }
  async scrollIntoView (el, top) {
    if (!top) top = 0
    await this.driver.executeScript(`
      let el = arguments[0];
      let elementRect = el.getBoundingClientRect();
      let change = elementRect.top - window.seleniumData.testInfo.offsetHeight - ${top};
      window.scrollBy(0, change)
    `, el)
  }
  async eachAction (each) {
    let actions = this.driver.actions({bridge: true})
    if (Array.isArray(each)) { // key with modifier
      let reversed = []
      for (let eacheach of each) {
        if (typeof(eacheach) === 'object') {
          await this.eachAction(eacheach)
        } else {
          actions = this.driver.actions({bridge: true})
          if (modifierKeys.includes(eacheach)) {
            actions = actions.keyDown(eacheach)
            reversed.push(eacheach)
            this.changeAction(`keyDown ${keyPrintMap.get(eacheach)}`)
          } else {
            actions = actions.sendKeys(eacheach)
            this.changeAction(`key ${keyPrintMap.get(eacheach)}`)
          }
          await actions.perform()
        }
      }
      for (let eacheach of reversed.reverse()) {
        actions = this.driver.actions({bridge: true})
        actions = actions.keyUp(eacheach)
        this.changeAction(`keyUp ${keyPrintMap.get(eacheach)}`)
        await actions.perform()
      }
    } else if (typeof(each) === 'object') {
      let keys = Object.keys(each)
      for (let eachkey of keys) {
        if (eachkey === 'move') {
          let value = each[eachkey]
          if (value instanceof WebElement) { // move to an element
            actions = actions[eachkey]({x:0, y:0, origin: value})
            let pos = await value.getRect()
            pos.type = 'element'
            pos.dx = 0
            pos.dy = 0
            pos.duration = 0
            this.changeAction(`${eachkey} ${JSON.stringify(pos)}`)
          } else { // should have some parameters
            let pos = {}
            let todo = {}
            let steps, delta
            if ('el' in value) {
              pos = await value.el.getRect()
              todo.origin = value.el
              todo.duration = value.duration || 0
              todo.x = 0
              todo.y = 0
              pos.type = 'element'
              if (value.x !== undefined) {
                pos.dx = value.x || 0
                pos.dx -= pos.width/2
                pos.dx = Number(pos.dx.toFixed(0))
              }
              if (value.y !== undefined) {
                pos.dy = value.y || 0
                pos.dy -= pos.height/2
                pos.dy = Number(pos.dy.toFixed(0))
              }
              pos.duration = value.duration || 0
              // if not Integer
              actions = actions[eachkey](todo)
              actions = actions[eachkey]({origin: Origin.POINTER, x: pos.dx, y: pos.dy})
            } else {
              todo.origin = Origin.POINTER
              pos.type = 'pointer'
              todo.x = value.x || 0
              todo.y = value.y || 0
              todo.duration = value.duration || 0
              pos.dx = value.x || 0
              pos.dy = value.y || 0
              pos.duration = value.duration || 0
              if (value.step) {
                steps = smoothMove({x: pos.dx, y: pos.dy, step: value.step})
                if (value.time) {
                  delta = Math.ceil(value.time/steps.length)
                }
                steps.forEach(_ => {
                  _.origin = todo.origin
                })
                for (let e of steps) {
                  actions = actions[eachkey](e)
                  if (delta) {
                    actions = actions.pause(delta)
                  }
                }
              } else {
                actions = actions[eachkey](todo)
              }
            }
            this.changeAction(`${eachkey} ${JSON.stringify(pos)}`)
          }
        } else if (eachkey === 'press' || eachkey === 'release') {
          let value = each[eachkey]
          actions = actions[eachkey](buttonMap[value])
          if (value instanceof WebElement) {
            let pos = await value.getRect()
            this.changeAction(`${eachkey} ${value}`)
          } else {
            this.changeAction(`${eachkey} ${value}`)
          }
        } else if (eachkey === 'sleep') {
          let value = each[eachkey]
          await this.driver.sleep(value)
        } else { // clicks
          let value = each[eachkey]
          actions = actions[eachkey](value)
          if (value instanceof WebElement) {
            let pos = await value.getRect()
            this.changeAction(`${eachkey} ${JSON.stringify(pos)}`)
          } else {
            this.changeAction(`${eachkey} ${keyPrintMap.get(value)}`)
          }
        }
      }
      await actions.perform()
    } else if (typeof(each) === 'string') {
      await actions.sendKeys(each).perform()
      if (keyPrintMap.has(each)) {
        this.changeAction(`key ${keyPrintMap.get(each)}`)
      } else {
        this.changeAction(`key String`)
      }
    }
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
      await this.eachAction(each, actions)
      if (interval) {
        await this.driver.sleep(interval)
      }
    }
  }
  async changeWorking (name) {
    let template=`
      window.seleniumData.working = \`${name}\`
    `
    let result = await this.driver.executeScript(template)
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
      window.seleniumData.comment = \`${comment}\`
    `
    let result = await this.driver.executeScript(template)
    if (stop) {
      throw Error('Stop in comment with comment:', raw_comment)
    }
    if (delay) {
      await this.driver.sleep(delay)
    }
  }
  async changeAction (action) {
    let template=`
      window.seleniumData.action = \`${action}\`
    `
    await this.driver.executeScript(template)
    template=`
      window.seleniumData.action = ''
    `
    await this.driver.executeScript(template)
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
      this.window_size = {height: 900, width: 1080}
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
  block ({name, rootSelector}) {
    return new Tester({
      name, rootSelector,
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
