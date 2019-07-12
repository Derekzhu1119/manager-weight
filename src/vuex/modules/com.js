import * as types from '../types'

/**
 * App通用配置
 */
const state = {
    loading: false,
    leftNavStatus: false,
    showSuccess: true,
    showFail: false,
    toastMsg: '操作成功',
    showTimePicker: false,
    alertMsg: '退出登录',
    system: 'ios',
    userId: '',
    token: '',
    sex: '1',
    weight: '',
    birthday: '',
    height: '',
}

const actions = {
    setLoadingState({ commit }, status) {
        commit(types.COM_LOADING_STATUS, status)
    },
    showSuccess({ commit }, status) {
        commit(types.COM_SHOW_SUCCESS, status)
    },
    showFail({ commit }, status) {
        commit(types.COM_SHOW_FAIL, status)
    },
    toastMsg({ commit }, str) {
        commit(types.COM_TOAST_MSG, str)
    },

    alertMsg({ commit }, str) {
        commit(types.COM_ALERT_MSG, str)
    },
    getSystemType({ commit }, status) {
        var jUserAgent = navigator.userAgent.toLowerCase();
        var jIsIphoneOs = jUserAgent.match(/iphone os/i) == "iphone os",
            jIsIpad = jUserAgent.match(/ipad/i) == "ipad",
            jIsAndroid = jUserAgent.match(/android/i) == "android";
        if (jIsAndroid) {
            commit(types.SYSTEM_TYPE, 'android');
        } else if (jIsIphoneOs) {
            commit(types.SYSTEM_TYPE, 'ios');
        }
    },
    setToken({ commit }, status) {
        window.localStorage.setItem('token', status);
        commit(types.COM_TOKEN, status);
    },
    setLang({ commit }, status) {
        window.localStorage.setItem('lang', status);
        commit(types.COM_LANG, status);
    },
    setUserId({ commit }, status) {
        window.localStorage.setItem('userId', status);
        commit(types.COM_UID, status);
    },
    setCurrentNav({ commit }, status) {

        commit(types.COM_CURNAV, status);
        window.localStorage.setItem('curNav', status);
    },

    //设置身高，体重,性别，生日
    setHeight({ commit }, status) {
        window.localStorage.setItem('height', status);
        commit(types.COM_HEIGHT, status);
    },
    setWeight({ commit }, status) {
        window.localStorage.setItem('weight', status);
        commit(types.COM_WEIGHT, status);
    },
    setSex({ commit }, status) {
        window.localStorage.setItem('sex', status);
        commit(types.COM_SEX, status);
    },
    setBirthday({ commit }, status) {
        window.localStorage.setItem('birthday', status);
        commit(types.COM_BIRTHDAY, status);
    },


}

const getters = {
    loading: state => state.loading,
    system: state => state.system,
    token: state => state.token,
    height: state => state.height,
    weight: state => state.weight,
    sex: state => state.sex,
    birthday: state => state.birthday,
}


const mutations = {
    [types.COM_LOADING_STATUS](state, status) {
        state.loading = status
    },



    [types.COM_SHOW_SUCCESS](state, status) {
        state.showSuccess = status
    },

    [types.COM_SHOW_FAIL](state, status) {
        state.showFail = status
    },

    [types.COM_TOAST_MSG](state, str) {
        state.toastMsg = str
    },

    [types.COM_ALERT_MSG](state, str) {
        state.alertMsg = str
    },
    [types.SYSTEM_TYPE](state, str) {
        state.system = str;
    },

    [types.COM_TOKEN](state, str) {
        state.token = str;
    },
    [types.COM_LANG](state, str) {
        state.lang = str;
    },
    [types.COM_UID](state, str) {
        state.userId = str;
    },
    [types.COM_CURNAV](state, str) {
        state.curNav = str;
    },

    [types.COM_HEIGHT](state, str) {
        state.height = str;
    },
    [types.COM_WEIGHT](state, str) {
        state.weight = str;
    },
    [types.COM_SEX](state, str) {
        state.sex = str;
    },
    [types.COM_BIRTHDAY](state, str) {
        state.birthday = str;
    },

}


export default {
    state,
    actions,
    getters,
    mutations
}
