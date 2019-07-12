/**
 * 格式化时间
 *
 * @param {String} str
 * @returns 格式化后的时间
 */
export const formatDate = (str) => {
    if (!str) return ''
    var date = new Date(str)
    var time = new Date().getTime() - date.getTime() //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    if (time < 0) {
        return ''
    } else if ((time / 1000 < 30)) {
        return '刚刚'
    } else if (time / 1000 < 60) {
        return parseInt((time / 1000)) + '秒前'
    } else if ((time / 60000) < 60) {
        return parseInt((time / 60000)) + '分钟前'
    } else if ((time / 3600000) < 24) {
        return parseInt(time / 3600000) + '小时前'
    } else if ((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前'
    } else if ((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前'
    } else {
        return parseInt(time / 31536000000) + '年前'
    }
}


// 日期格式化
export function getDateDiff(dateStr) {
    var publishTime = getDateTimeStamp(dateStr) / 1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime() / 1000),
        d,
        d_date,

        date = new Date(publishTime * 1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
        M = '0' + M;
    }
    if (D < 10) {
        D = '0' + D;
    }
    if (H < 10) {
        H = '0' + H;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }

    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    d_seconds = parseInt(d);
    d_date=new Date(dateStr.replace(/-/g, "/")).getDay();

    if (d_days > 0 && d_days < 7) {
        //return d_days + '天前  '+M + '-' + D + ' ' + H + ':' + m;

        return '星期'+'日一二三四五六'.charAt(d_date)+' ' + formatTime(dateStr)
    }
    // 当天
    else if (d_days <= 0 && new Date(dateStr.replace(/-/g, "/")).getDate()==new Date().getDate()) {
        //return d_hours + '小时前  '+ H + ':' + m;
        return formatTime(dateStr)
    }else if(d_days <= 0 && new Date(dateStr.replace(/-/g, "/")).getDate()!=new Date().getDate()){
        return '昨天'+formatTime(dateStr)
    }
    // else if (d_hours <= 0 && d_minutes > 0) {
    //     return d_minutes + '分钟前  '+M + '-' + D + ' ' + H + ':' + m;
    // } else if (d_seconds < 60) {
    //     if (d_seconds <= 0) {
    //         return '刚刚';
    //     } else {
    //         return d_seconds + '秒前';
    //     }
    // }

    else if (d_days >= 7 && d_days < 30) {
        //return M + '-' + D + ' ' + H + ':' + m;
        return M + '-' + D + ' ' + formatTime(dateStr);
    } else if (d_days >= 30) {
        //return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
        return Y + '-' + M + '-' + D + ' ' + formatTime(dateStr);
    }
}
export function formatTime(dateStr){
    let time=dateStr.replace(/-/g, "/").split(" ")[1];
    let houver=time.split(":")[0];
    let min=time.split(":")[1];
    if(houver>0 && houver<12){
        return "上午 "+houver+":"+min
    }else if(houver=="00"){
        return '凌晨 '+"00"+":"+min
    }else if(houver>12){
        return '下午 '+(houver-12)+":"+min
    }else if(houver==12){
        return '中午 12'+":"+min
    }
}

export function getDateTimeStamp(dateStr) {
    return Date.parse(dateStr.replace(/-/gi, "/"));
}
export function pp(s) {
    return s < 10 ? '0' + s: s;
}
