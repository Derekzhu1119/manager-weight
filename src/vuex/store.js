import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import index from './modules/index'
import com from './modules/com'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        index,
        user,
        com
    }
})
