import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/Index'
import Report from '../pages/Report'
import Advise from '../pages/Advise'
import BodyData from '../pages/BodyData'
import Target from '../pages/Target'
import Height from '../pages/height'
import Weight from '../pages/weight'
import Birth from '../pages/birth'
import GoalWeight from '../pages/goalWeight'
import Personal from '../pages/personal'
import Share from '../pages/share'
import Agreement from '../pages/Agreement.vue'
import NotFound from '../pages/NotFound'

Vue.use(Router)
    //给VueRoute添加一个goBack方法，用于记录路由的前进后退状态 this.isBack = true
    // Router.prototype.goBack = function () {
    //     this.isBack = true
    //     window.history.go(-1)
    // }
export default new Router({
    // linkActiveClass: 'active',
    base: '/portal',
    routes: [{
            path: '/',
            component: Index,
        },
        {
            path: '/index/:userId?/:userName?',
            name: 'index',
            component: Index,
            meta: {index: 10},
        },
        {
            path: '/report',
            component: Report,
            meta: {index: 9},
        },
        {
            path: '/advise',
            component: Advise,
            meta: {index: 8},
        },
        {
            path: '/body-data',
            component: BodyData,
            meta: {index: 7},
        },
        {
            path: '/target',
            component: Target,
            meta: {index: 6},
        },
        {
            path: '/height',
            component: Height,
            meta: {index: 0},
        },
        {
            path: '/weight',
            component: Weight,
            meta: {index: 2},
        },
        {
            path: '/birth',
            component: Birth,
            meta: {index: 1},
        },
        {
            path: '/goalWeight',
            component: GoalWeight,
            meta: {index: 3},
        },
        {
            path: '/personal',
            component: Personal,
            meta: {index: 4},
        },
        {
            path: '*',
            name: 'notfound',
            component: NotFound,
            meta: {index: 5},
        },
        {
            path: '/share',
            component: Share,
            meta: {index: 6},
        },
        {
            path: '/agreement',
            component: Agreement,
            meta: {index: 11},
        }
    ],
    // mode: 'history',
    // scrollBehavior (to, from, savedPosition) {
    //     // 如果你的連結是帶 # 這種
    //     // to.hash 就會有值(值就是連結)
    //     // 例如 #3
    //
    //     if (to.hash) {
    //         return {
    //             // 這個是透過 to.hash 的值來找到對應的元素
    //             // 照你的 html 來看是不用多加處理這樣就可以了
    //             // 例如你按下 #3 的連結，就會變成 querySelector('#3')，自然會找到 id = 3 的元素
    //             selector: to.hash
    //         }
    //
    //     }
    // },

})
