const testConfig = require('./test-config.json')
// import backend from 'vue-selenium-unittest/backend.js'
import backend from '../backend.js'
let tests = {
  async all () {
    console.log('all')
  },
  'keyboard print': async ({name, driver, Test, Key, By, until}) => {
    let data, keys, input
    let rootSelector = "#keyboard-print-id"
    let interval = 0
    let app = await driver.findElement({id: 'app'})
    t = Test.block({name, rootSelector: "#keyboard-print-id"})
    let root = await driver.findElement(By.css(rootSelector))
    let inputs = await root.findElements({tagName: 'input'})

    t.changeComment('test stretch (input and delete)', 500)
    input = inputs[0]
    await input.click()
    await t.sendKeys({keys: '!@#$%^&*()_+<>1234567890-=qwertyuiop[]\'\"', interval})
    keys = [...Array(50).keys()].map(_ => Key.BACK_SPACE)
    await t.sendKeys({keys, interval})
    input = inputs[1]
    await input.click()
    await t.sendKeys({keys: '!@#$%^&*()_+<>1234567890-=qwertyuiop[]\'\"', interval})
    keys = [...Array(30).keys()].map(_ => Key.BACK_SPACE)
    await t.sendKeys({keys, interval})
    input = inputs[2]
    await input.click()
    await t.sendKeys({keys: '!@#$%^&*()_+<>1234567890-=qwertyuiop[]\'\"', interval})
    keys = [...Array(30).keys()].map(_ => Key.BACK_SPACE)
    await t.sendKeys({keys, interval})

    t.changeComment('test tab and shift+tab to go next and previous', 500)
    input = inputs[0]
    await input.click()
    await t.sendKeys({keys: [Key.TAB, Key.TAB], interval: 300, delay: 200})
    await t.sendKeys({keys: [[Key.SHIFT, Key.TAB], [Key.SHIFT, Key.TAB]], interval: 300, delay: 200})

    t.changeComment('click input with text will select all', 500)
    input = inputs[1]
    await input.click()
    await t.sendKeys({keys: [Key.BACK_SPACE], interval: 300, delay: 200})

    input = inputs[2]
    await input.click()
    await t.sendKeys({keys: [Key.BACK_SPACE], interval: 300, delay: 200})

    input = inputs[0]
    await input.click()

    t.changeComment('all done',500)
    t.changeComment('')
  }
}
let t = new backend({options: testConfig, tests})
t.init()
