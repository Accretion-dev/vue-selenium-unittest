import testEnv from './components/test-env.vue'
import testBlock from './components/test-block.vue'
import testButton from './components/test-button.vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
const plugin = {
  install (Vue, options) {
    if (!options.seleniumPort) throw Error('Error in vue plugin vue-selenium-unittest, need seleniumPort option')
    Vue.use(iView)
    Vue.component('test-env', testEnv)
    Vue.component('test-block', testBlock)
    Vue.component('test-button', testButton)
    Vue.prototype.$seleniumPort = options.seleniumPort
  }
}

export default plugin
