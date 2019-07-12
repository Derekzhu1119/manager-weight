// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/vuex/store'
import * as filters from '@/util/filter'
import Echarts from 'echarts'
import VueTouch from 'vue-touch'
import 'lib-flexible'
import $ from 'jquery';
import './assets/css/iconfont.css';
import './assets/fonts/iconfont.css';
import '../static/css/reset.css';
import {Cell,Tag, CellGroup,SwipeCell, Button,Popup,Stepper,Field,Icon,Dialog,Toast,ImagePreview,Slider,NoticeBar,DatetimePicker,Search,NavBar,Row, Col,Circle,NumberKeyboard,Tab,Tabs} from 'vant';


// zark
import global_ from './assets/js/global.js'
Vue.prototype.GLOBAL = global_
// import '@/assets/css/init.css' // 初始化浏览器样式


Vue.prototype.echarts = Echarts
Vue.use(Button).use(Tag).use(Cell).use(SwipeCell).use(CellGroup).use(Tab).use(Tabs).use(Circle).use(NumberKeyboard).use(Stepper).use(Popup).use(Field).use(Icon).use(Dialog).use(Toast).use(Slider).use(NoticeBar).use(DatetimePicker).use(Search).use(NavBar).use(Row).use(Col)
    .use(Echarts)
Vue.use(VueTouch, {name: 'v-touch'})
VueTouch.config.swipe = {
    threshold: 100 //手指左右滑动距离
}
Object.keys(filters).forEach(k => Vue.filter(k, filters[k])) //注册过滤器
new Vue({
  el: '#app',
  router,
  store,
  ...App
})
