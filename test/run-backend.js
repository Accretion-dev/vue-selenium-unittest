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
    let interval = 50
    let app = await driver.findElement({id: 'app'})
    t = Test.block({name, rootSelector})
    await t.initScroll()
    let root = await driver.findElement(By.css(rootSelector))
    let inputs = await root.findElements({tagName: 'input'})

    await t.changeComment('test simple input', 1000)
    input = inputs[0]
    await t.actions({actions: {click: input}})
    await t.actions({actions: "0123456789abcdefghABCDEFGH", interval})
    /*
    actions = [...Array(30).keys()].map(_ => Key.BACK_SPACE)
    await t.actions({actions, interval})

    await t.changeComment('test special keys', 1000)
    await t.actions({actions: [
      Key.CONTROL,
      Key.ALT,
      Key.COMMAND,
      Key.META,
      Key.SHIFT,
      Key.TAB,
      Key.TAB,
      Key.TAB,
      [Key.SHIFT, Key.TAB],
      [Key.SHIFT, Key.TAB],
      '01234567890',
      Key.BACK_SPACE,
      Key.BACK_SPACE,
      Key.BACK_SPACE,
      Key.ARROW_LEFT,
      Key.LEFT,
      Key.ARROW_LEFT,
      Key.LEFT,
      Key.ARROW_RIGHT,
      Key.RIGHT,
      Key.ARROW_DOWN,
      Key.DOWN,
      Key.ARROW_UP,
      Key.UP,
      Key.END,
      Key.HOME,
      Key.DELETE,
      Key.SPACE,

      Key.RETURN,
      Key.ENTER,
      Key.PAUSE,
      Key.INSERT,
      Key.ESCAPE,
      Key.PAGE_DOWN,
      Key.PAGE_UP,
    ], interval: 1000})
    await t.actions({actions: [
      Key.SEMICOLON,
      Key.EQUALS,
      Key.NUMPAD0,
      Key.NUMPAD1,
      Key.NUMPAD2,
      Key.NUMPAD3,
      Key.NUMPAD4,
      Key.NUMPAD5,
      Key.NUMPAD6,
      Key.NUMPAD7,
      Key.NUMPAD8,
      Key.NUMPAD9,
      Key.MULTIPLY,
      Key.ADD,
      Key.SEPARATOR,
      Key.SUBTRACT,
      Key.DECIMAL,
      Key.DIVIDE,
      [Key.CONTROL, 'a'],
      Key.BACK_SPACE,
      // these keys do not work
      //Key.F1,
      //Key.F2,
      //Key.F3,
      //Key.F4,
      //Key.F5,
      //Key.F6,
      //Key.F7,
      //Key.F8,
      //Key.F9,
      //Key.F10,
      //Key.F11,
      //Key.F12,
    ], interval: 50})
    */
    await t.changeComment('clean input', 1000)
    await t.actions({actions: [
      [Key.CONTROL, 'a'],
      Key.BACK_SPACE,
    ], interval: 50})

    await t.changeComment('all done', 30000)
    await t.changeComment('')
    return


    await t.changeComment('test tab and shift+tab to go next and previous', 500)
    input = inputs[0]
    await input.click()
    await t.actions({actions: [Key.TAB, Key.TAB], interval: 300, delay: 200})
    await t.actions({actions: [{keyDown: Key.SHIFT}, Key.TAB, Key.TAB, {keyUp: Key.SHIFT}], interval: 300, delay: 200})

    await t.changeComment('click input with text will select all', 500)
    input = inputs[1]
    await t.actions({actions: {click: input}})
    await t.actions({actions: [Key.BACK_SPACE], interval: 300, delay: 200})

    input = inputs[2]
    //await t.actions({actions: {contextClick: input}})
    await t.actions({actions: {click: input}})
    await t.actions({actions: [Key.BACK_SPACE], interval: 300, delay: 200})

    input = inputs[0]
    await t.actions({actions: {click: input}})

    await t.changeComment('all done', 3000)
    await t.changeComment('')
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
