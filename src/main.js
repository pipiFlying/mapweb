import Vue from 'vue'
import App from './App.vue'
import BaiduMap from 'vue-baidu-map';

Vue.use(BaiduMap, {
  ak: 'HLZysC0OF7Mr7UB6di78LOYrDcyUWFjh'
});


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
