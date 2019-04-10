const testConfig = require('./test-config.json')
// import backend from 'vue-selenium-unittest/backend.js'
import backend from '../backend-src.js'
let normalKeys = '~!@#$%^&*()_+|}{POIUYTREWQASDFGHJKL:"?><MNBVCXZ"}'+"`1234567890-=\\][poiuytrewqasdfghjkl;'/.,mnbvcxz'"
let tests = {
  async all () {
    console.log('all')
  },
  'keyboard': async ({name, driver, Test, Key, By, until, Button, Origin}) => {
    let data, actions, input
    let rootSelector = "#keyboard-id"
    let interval = 0
    let app = await driver.findElement({id: 'app'})
    t = Test.block({name, rootSelector})
    await t.initScroll()
    let root = await driver.findElement(By.css(rootSelector))
    let inputs = await root.findElements({tagName: 'input'})

    t.changeComment('test stretch (input and delete)', 500)
    input = inputs[0]
    await t.actions({actions: {click: input}})
    await t.actions({actions: normalKeys, interval})
    actions = [...Array(100).keys()].map(_ => Key.BACK_SPACE)
    await t.actions({actions, interval})

    input = inputs[1]
    await t.actions({actions: {click: input}})
    await t.actions({actions: normalKeys, interval})
    actions = [...Array(70).keys()].map(_ => Key.BACK_SPACE)
    await t.actions({actions, interval})

    input = inputs[2]
    await t.actions({actions: {click: input}})
    await t.actions({actions: normalKeys, interval})
    actions = [...Array(50).keys()].map(_ => Key.BACK_SPACE)
    await t.actions({actions, interval})

    t.changeComment('test tab and shift+tab to go next and previous', 500)
    input = inputs[0]
    await input.click()
    await t.actions({actions: [Key.TAB, Key.TAB], interval: 300, delay: 200})
    await t.actions({actions: [{keyDown: Key.SHIFT}, Key.TAB, Key.TAB, {keyUp: Key.SHIFT}], interval: 300, delay: 200})

    t.changeComment('click input with text will select all', 500)
    input = inputs[1]
    await t.actions({actions: {click: input}})
    await t.actions({actions: [Key.BACK_SPACE], interval: 300, delay: 200})

    input = inputs[2]
    //await t.actions({actions: {contextClick: input}})
    await t.actions({actions: {click: input}})
    await t.actions({actions: [Key.BACK_SPACE], interval: 300, delay: 200})

    input = inputs[0]
    await t.actions({actions: {click: input}})

    t.changeComment('all done',500)
    t.changeComment('')
  },
  'keyboard+mouse': async ({name, driver, Test, Key, By, until, Button, Origin}) => {
    let data, actions, input
    let rootSelector = "#keyboard-mouse-id"
    let interval = 0
    let app = await driver.findElement({id: 'app'})
    t = Test.block({name, rootSelector})
    await t.initScroll()
    let root = await driver.findElement(By.css(rootSelector))
    let inputs = await root.findElements({tagName: 'input'})

    t.changeComment('test stretch (input and delete)', 500)
    input = inputs[0]
    await t.actions({actions: {click: input}})
    await t.actions({actions: normalKeys, interval})
    actions = [...Array(100).keys()].map(_ => Key.BACK_SPACE)
    await t.actions({actions, interval})

    input = inputs[1]
    await t.actions({actions: {click: input}})
    await t.actions({actions: normalKeys, interval})
    actions = [...Array(70).keys()].map(_ => Key.BACK_SPACE)
    await t.actions({actions, interval})

    input = inputs[2]
    await t.actions({actions: {click: input}})
    await t.actions({actions: normalKeys, interval})
    actions = [...Array(50).keys()].map(_ => Key.BACK_SPACE)
    await t.actions({actions, interval})

    t.changeComment('test tab and shift+tab to go next and previous', 500)
    input = inputs[0]
    await input.click()
    await t.actions({actions: [Key.TAB, Key.TAB], interval: 300, delay: 200})
    await t.actions({actions: [{keyDown: Key.SHIFT}, Key.TAB, Key.TAB, {keyUp: Key.SHIFT}], interval: 300, delay: 200})

    t.changeComment('click input with text will select all', 500)
    input = inputs[1]
    await t.actions({actions: {click: input}})
    await t.actions({actions: [Key.BACK_SPACE], interval: 300, delay: 200})

    input = inputs[2]
    //await t.actions({actions: {contextClick: input}})
    await t.actions({actions: {click: input}})
    await t.actions({actions: [Key.BACK_SPACE], interval: 300, delay: 200})

    input = inputs[0]
    await t.actions({actions: {click: input}})

    t.changeComment('all done',500)
    t.changeComment('')
  }
}
let t = new backend({options: testConfig, tests})
t.init()
