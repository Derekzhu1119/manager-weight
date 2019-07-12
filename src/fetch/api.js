import axios from 'axios'
import qs from 'qs'
import store from '../vuex/store'
import * as _ from '../util/tool'

// axios 配置
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '/baseUrl' : process.env.API_ROOT + '';
//POST传参序列化
axios.interceptors.request.use((config) => {
    if (config.method === 'post') {
        //config.data = qs.stringify(config.data);
    }
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (store.state.com.token) {
        config.headers.token = store.state.com.token;
    } else if (localStorage.token != '' && typeof localStorage.token != "undefined") {
        config.headers.token = localStorage.token;
    } else {
        config.headers.token = '';
    }
    // 判断是否存在lang，如果存在的话，则每个http header都加上lang

    if (localStorage.lang != '' && typeof localStorage.lang != "undefined") {
        config.headers.lang = localStorage.lang;
    } else if (store.state.com.lang) {
        config.headers.lang = store.state.com.lang;
    }

    return config;
}, (error) => {
    _.alert("错误的传参");
    return Promise.reject(error);
});


//返回状态判断
axios.interceptors.response.use((res) => {
    if (!res.data) {
        // _.toast(res.data.msg);
        return Promise.reject(res);
    }
    return res;
}, (error) => {
    //_.alert("网络异常");
    return Promise.reject(error);
});
export function fetch(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params })
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export function pfetch(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export default {
    //设置基础信息
    baseInfoSetting(params) {
        return pfetch(`/manager-weight/api/web/user/base-info-setting`, params);
    },
    //设置目标体重
    targetSetting(params) {
        return pfetch(`/manager-weight/api/web/user/target-setting`, params);
    },
    //获取首页打卡详情
    getIndexDetail(date) {
        return pfetch(`/manager-weight/api/web/punch/detail?date=${date}`);
    },
    //获取用户信息
    getUserInfo() {
        return pfetch(`/manager-weight/api/web/user/info`)
    },
    //获取首页曲线图(体重打卡记录)
    getWeightRecord(startDate, endDate) {
        return pfetch(`/manager-weight/api/web/punch/weight/record?startDate=${startDate}&endDate=${endDate}`)
    },
    //膳食建议
    getFoodSuggest() {
        return pfetch(`/manager-weight/api/web/suggest/food`)
    },
    //膳食建议 刷新
    refreshFoodSuggest(excludeSuggestId, type) {
        return pfetch(`/manager-weight/api/web/suggest/food-refresh?excludeSuggestId=${excludeSuggestId}&type=${type}`)
    },
    //运动建议
    getSuportSuggest() {
        return pfetch(`/manager-weight/api/web/suggest/sport`)
    },
    //减肥禁忌
    getWeightabbot() {
        return pfetch(`/manager-weight/api/web/suggest/weight-tabbot`)
    },
    //report1
    getReport0(startDate, endDate) {
        return pfetch(`/manager-weight/api/web/report/weight?startDate=${startDate}&endDate=${endDate}`)
    },
    //report1
    getReport1(startDate, endDate) {
        return pfetch(`/manager-weight/api/web/report/food?startDate=${startDate}&endDate=${endDate}`)
    },
    //report1
    getReport2(startDate, endDate) {
        return pfetch(`/manager-weight/api/web/report/sport?startDate=${startDate}&endDate=${endDate}`)
    },
    //report1
    getReport3(startDate, endDate) {
        return pfetch(`/manager-weight/api/web/report/sport-food-compare?startDate=${startDate}&endDate=${endDate}`)
    },
    //获取身体数据
    getBodyData() {
        return pfetch(`/manager-weight/api/web/user/health-data`)
    },
    //获取食物类别
    getCategoryFood() {
        return pfetch(`/manager-weight/api/web/food/category`)
    },
    //获取已经打卡食物
    getRecordFood(date, type) {
        return pfetch(`/manager-weight/api/web/punch/food/record?date=${date}&type=${type}`)

    },
    //获取运动类别
    getCategorySport() {
        return pfetch(`/manager-weight/api/web/sport/category`)
    },
    //获取已打卡运动
    getRecordSport(date) {
        return pfetch(`/manager-weight/api/web/punch/sport/record?date=${date}`)
    },
    //根据类别查询食物列表
    getFoodListById(id) {
        return pfetch(`/manager-weight/api/web/food/info-list?categoryId=${id}`)

    },
    //更具类别查询运动列表
    getPlayListById(id) {
        return pfetch(`/manager-weight/api/web/sport/info-list?categoryId=${id}`)
    },
    //运动搜索
    searchSport(key) {
        return pfetch(`/manager-weight/api/web/sport/info-list-match?searchContent=${key}`)

    },
    //食物搜索
    searchFood(key) {
        return pfetch(`/manager-weight/api/web/food/info-list-match?searchContent=${key}`)

    },
    //食物打卡
    foodMark(date, foodId, num, type, unitId) {
        return pfetch(`/manager-weight/api/web/punch/food?date=${date}&foodId=${foodId}&num=${num}&type=${type}&unitId=${unitId}`)
    },
    //运动打卡
    sportMark(date, num, sportId) {
        return pfetch(`/manager-weight/api/web/punch/sport?date=${date}&sportId=${sportId}&num=${num}`)
    },
    //体重打卡
    weightMark(date, weight) {
        return pfetch(`/manager-weight/api/web/punch/weight?date=${date}&weight=${weight}`)
    },
    //食物打卡删除
    deleteFood(id) {
        return pfetch(`/manager-weight/api/web/punch/food/record/delete?foodPunchId=${id}`)

    },
    //运动打卡删除
    deletePlay(id) {
        return pfetch(`/manager-weight/api/web/punch/sport/record/delete?sportPunchId=${id}`)
    },
    //BMI
    getBMIMsg(weight) {
        return pfetch(`/manager-weight/api/web/user/health-data/bmi?weight=${weight}`)
    },
    //获取分享数据
    getDetailShare(date, loginName) {
        return pfetch(`/manager-weight/api/web/punch/detail-share?date=${date}&loginName=${loginName}`)
    },
    //获取本月打卡的日期
    getRecordayMonth(d){
        return pfetch(`/manager-weight/api/web/punch/weight/record-day-of-month?month=${d}`)

    }


}