/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 08:04:12
 * @LastEditTime: 2019-08-29 20:38:37
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import Router from 'vue-router'
import store from './store/index.js';
import './assets/css/reset.css';
import './assets/css/common.css';
import './assets/fonts/iconfont.css';
import 'lib-flexible';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import VueLazyLoad from 'vue-lazyload'
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.config.productionTip = false;
Vue.use(VueAwesomeSwiper);

Vue.use(VueLazyLoad, {
  loading: 'load.gif',
  error: 'user-bg.png'
});
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
