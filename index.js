import testEnv from './components/test-env.vue'
import testBlock from './components/test-block.vue'
import testButton from './components/test-button.vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import feather from 'vue-icon'
const plugin = {
  install (Vue, options) {
    if (!options.seleniumPort) throw Error('Error in vue plugin vue-selenium-unittest, need seleniumPort option')
    window.seleniumData = {
      action: '',
      working: '',
      comment: '',
      testInfo: null,
      roots: new Map(),
    }
    Vue.use(iView)
    Vue.mixin({
      data: function() {
        return {
          get seleniumData() {
            return window.seleniumData
          }
        }
      }
    })
    Vue.use(feather, {
      name: 'v-icon',
      props: {
        baseClass: {
          type: String,
          default: 'v-icon'
        },
        classPrefix: {
          type: String,
          default: 'v-icon-'
        }
      }
    })
    Vue.component('test-env', testEnv)
    Vue.component('test-block', testBlock)
    Vue.component('test-button', testButton)
    Vue.prototype.$seleniumPort = options.seleniumPort
  }
}

export default plugin
