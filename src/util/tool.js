import store from '../vuex/store'
import api from '../fetch/api'
/**
 *   Toast公共方法
 */
export function toast(str, icon) {
    if (icon == 'success') {
        store.dispatch('showSuccess', true)
        store.dispatch('showFail', false)
    } else {
        store.dispatch('showSuccess', false)
        store.dispatch('showFail', true)
    }
    store.dispatch('toastMsg', str);
    setTimeout(() => {}, 1500);
}

/* 获取当前星期所在日期范围 */
export const obj = {
    getWeekDay(day) {
        var today = new Date();　　
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;　　
        today.setTime(targetday_milliseconds);　　
        var tYear = today.getFullYear();　　
        var tMonth = today.getMonth();　　
        var tDate = today.getDate();　　
        tMonth = this.doHandleMonth(tMonth + 1);　　
        tDate = this.doHandleMonth(tDate);　　
        return tYear + "-" + tMonth + "-" + tDate;
    },
    doHandleMonth(month) {
        var m = month;　　
        if (month.toString().length == 1) { m = "0" + month; }　　
        return m;
    }
}

/**
 * dialog公共方法
 */

export function alert(str) {
    setTimeout(() => {}, 1500);
}


export function formateNum(i) {
    return i < 10 ? "0" + i.toString() : i;
}
export function f0(i) {
    return i < 10 ? "0" + i.toString() : i;
}
export function scrollBottom() {
    var h = window.innerHeight;
    window.scrollTo(0, h);
}

export function formatterNewsLan(cn, en) {
    if (localStorage.lang == "en") {
        return en
    } else {
        return cn
    }
}
export function fDate(date) {
    return date.replace(new RegExp(/-/gm), "/")
}
// 记录操作日志
export function submitLog(operations, modleNames) {

    let userId, operation, physicalAddress, modleName, system, browser, address;
    //判断操作系统
    userId = store.state.user.userInfo.id;
    operation = operations;
    modleName = modleNames;
    browser = myBrowser();
    system = mySystem();
    // if(browser=='IE' || browser=='Safari'){
    //     physicalAddress='';
    //     address = '';
    //     api.submitLog(userId, operation, physicalAddress, modleName, system, browser, address).then((res) => {
    //         console.log(res)
    //     })
    //
    // }else{
    //     getIPs(function(ip){
    //         physicalAddress=ip;
    //         address = '';
    //         api.submitLog(userId, operation, physicalAddress, modleName, system, browser, address).then((res) =>{
    //             console.log(res)
    //         })
    //     });
    // }
    if (typeof localStorage.returnCitySN != "undefined") {
        physicalAddress = JSON.parse(localStorage.returnCitySN)["cip"];
        address = JSON.parse(localStorage.returnCitySN)["cname"];
    } else {
        localStorage.setItem('returnCitySN', JSON.stringify(returnCitySN));
        physicalAddress = JSON.parse(localStorage.returnCitySN)["cip"];
        address = JSON.parse(localStorage.returnCitySN)["cname"];
    }

    api.submitLog(userId, operation, physicalAddress, modleName, system, browser, address).then((res) => {
        console.log(res)
    })

}
// 判断操作系统
export function mySystem() {
    if (/android/i.test(navigator.userAgent)) {
        return 'Android';
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return 'IOS';
    }
    if (/(MAC)/i.test(navigator.userAgent)) {
        return 'MAC';
    }
    if (/Linux/i.test(navigator.userAgent)) {
        return 'Linux';
    }
    if (/Linux/i.test(navigator.platform)) {
        return 'Linux';
    }
    if (/MicroMessenger/i.test(navigator.userAgent)) {
        return 'wechat';
    } else {
        return 'windows'
    }
}
// 判断浏览器
export function myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("Trident") > -1 || userAgent.indexOf("Edge") > -1) {
        return "IE";
    }
}
//获取ip
export function getIPs(callback) {
    var ip_dups = {};

    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking
    if (!RTCPeerConnection) {
        var iframe = document.createElement('iframe');
        //invalidate content script
        iframe.sandbox = 'allow-same-origin';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        var win = iframe.contentWindow;
        window.RTCPeerConnection = win.RTCPeerConnection;
        window.mozRTCPeerConnection = win.mozRTCPeerConnection;
        window.webkitRTCPeerConnection = win.webkitRTCPeerConnection;
        RTCPeerConnection = window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{ RtpDataChannels: true }]
    };

    //firefox already has a default stun server in about:config
    //    media.peerconnection.default_iceservers =
    //    [{"url": "stun:stun.services.mozilla.com"}]
    var servers = undefined;

    //add same stun server for chrome
    if (window.webkitRTCPeerConnection)
        servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    //listen for candidate events
    pc.onicecandidate = function(ice) {

        //skip non-candidate events
        if (ice.candidate) {

            //match just the IP address
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
            var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];

            //remove duplicates
            if (ip_dups[ip_addr] === undefined)
                callback(ip_addr);

            ip_dups[ip_addr] = true;
        }
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result) {

        //trigger the stun server request
        pc.setLocalDescription(result, function() {}, function() {});

    }, function() {});
}
export function isNotEmpty(s) {
    if (typeof s != 'undefined' && s != null && s != '' && s != 'null' && s != 'undefined') {
        return true
    } else {
        return false
    }
}
//通过年月获取当月天数
export function getDaysInMonth(year, month) {
    month = parseInt(month, 10); //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
    var temp = new Date(year, month, 0);
    return temp.getDate();
}
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
Array.prototype.exists = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            return true;
        }
    }
    return false;
}
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};