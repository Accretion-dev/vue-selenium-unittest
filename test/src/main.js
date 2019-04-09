import Vue from 'vue'
import App from './App.vue'
// import VueSeleniumUnittest from 'vue-selenium-unittest'
import VueSeleniumUnittest from '../../index.js'
import testConfig from '../test-config.json'

Vue.config.productionTip = false
Vue.use(VueSeleniumUnittest, testConfig)

new Vue({
  render: h => h(App),
}).$mount('#app')
