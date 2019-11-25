import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Global from './components/Global'
import axios from 'axios'
// 引用echarts 
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 引用封装好的echarts 
import VCharts from 'v-charts'
Vue.use(VCharts)

import './icons' // icon

import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.config.productionTip = false

Vue.use(ElementUI);
axios.defaults.baseURL = "http://juapi.qiangssvip.com"
Vue.prototype.$http = axios
Vue.prototype.$global = Global

router.beforeEach((to, from, next) => {
  const token = store.state.token;
  
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (token) { // 通过vuex state获取当前的token是否存在
      next();
    } else {
      console.log('该页面需要登陆');
      next('/login');
    }
  } else {
    next();
  }

  

 })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
