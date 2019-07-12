import api from "../../fetch/api"
import * as types from '../types'
const state={
  indexList:[],
}
const actions={
  //获取首页下拉列表
  getIndexList({ commit }, palyload) {

  },
}
const getters={
    getIndexList:state=>state.indexList,
}
const mutations={
  [types.INDEX_LIST](state,res){
    state.indexList = res
  },
}
export default {
  state,
  actions,
  getters,
  mutations
}
