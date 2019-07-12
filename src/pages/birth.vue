<template>
  <div class="birth" :type="sex">
    <img src="../assets/images/i4.png" alt="" @click="back()" class="back">
    <div class="questions">
      <p class="question">你的出生日期</p>
      <p class="answer">{{year + '年' + month + '月' + day + '日'}}</p>
    </div>
    <div class="container">
      <div class="selector yearSelector"  :type="sex" @touchstart="scale1Start" @touchmove="scale1Move" @touchend="scale1End">
        <div class="leftOverLay"></div>
        <div class="rightOverLay"></div>
        <div class="scaleDiv" style="transform: rotate(0deg)">
          <div class="clock yearClock"  style="transform: rotate(0deg)" v-html="yearHtml"></div>
          <div class="clock1"  style="transform: rotate(180deg)" v-html="yearHtml1"></div>
        </div>
      </div>
      <div class="selector selector1 monthSelector"  :type="sex" @touchstart="scale2Start" @touchmove="scale2Move" @touchend="scale2End">
        <div class="leftOverLay"></div>
        <div class="rightOverLay"></div>
        <div class="clock monthClock"  style="transform: rotate(0deg)" v-html="monthHtml"></div>
      </div>
      <div class="selector selector2 daySelector"  :type="sex" @touchstart="scale3Start" @touchmove="scale3Move" @touchend="scale3End">
        <div class="leftOverLay"></div>
        <div class="rightOverLay"></div>
        <div class="btn" @click="routeTo('/weight')" @touchmove="routeTouch" @touchend="routeTouchEnd">
          <i class="iconfont icon-queding" style="font-size: 24px;"></i>
          <!--<img src="../assets/img/btn-img.png" v-show="sex === '1' || sex === 1"/>-->
          <!--<img src="../assets/img/btn-img-red.png" v-show="sex === '0' || sex === 0"/>-->
        </div>
        <div class="clock dayClock"  style="transform: rotate(0deg)" v-html="dayHtml"></div>
      </div>
    </div>
  </div>
</template>

<script>
    import api from '../fetch/api'
    export default {
        name: "height",
        data() {
            return {
                yearHtml: '',
                yearHtml1: '',
                monthHtml: '',
                dayHtml: '',
                year: 1997,
                month: 1,
                monthList: ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二'],
                day: 1,
                min: 1987,
                mid: 1997,
                max: 2007,
                weekMin: 1,
                weekMid: 1,
                weekMax: 12,
                dayMid: 1,
                dayMax: 30,
                sex: localStorage.selectSex ? localStorage.selectSex : '1',
                _timer: 0,
                degreeStart1: 0,
                startX1: 0,
                startY1: 0,
                endX1: 0,
                endY1: 0,
                scaleX1: 0,
                scaleY1: 0,
                startTransform1: 0,
                nowTransform1: 0,
                lastPlayDegree1: 0,
                degreeStart2: 0,
                startX2: 0,
                startY2: 0,
                endX2: 0,
                endY2: 0,
                scaleX2: 0,
                scaleY2: 0,
                startTransform2: 0,
                nowTransform2: 0,
                lastPlayDegree2: 0,
                degreeStart3: 0,
                startX3: 0,
                startY3: 0,
                endX3: 0,
                endY3: 0,
                scaleX3: 0,
                scaleY3: 0,
                startTransform3: 0,
                nowTransform3: 0,
                lastPlayDegree3: 0
            }
        },
        created() {
            $('body').addClass('nosafePadding')
            this.init()
        },
        mounted () {
            this.initMonthSelector()
            this.initDaySelecor()
            this.initYearSelector()
            window.xy.getLoginUserInfo(
                function (res) {
                    // alert(res);
                    //that.$toast(JSON.stringify(res));
                    //that.$toast(res.token)
                    localStorage.setItem('token',res.token);

                },function (error) {
                    this.$toast.fail('error');
                }
            )
        },
        methods: {
            init() {
                // 初始化之前有选择的高度数据
                if(localStorage.myYear) {
                    this.year = parseInt(localStorage.myYear)
                    this.mid = this.year
                    this.min = this.mid - 10
                    this.max = this.mid + 10
                }
                if(localStorage.myMonth) {
                    this.weekMid = parseInt(localStorage.myMonth)
                    this.month = this.weekMid
                }
                if(localStorage.myDay) {
                    this.day = parseInt(localStorage.myDay)
                    this.dayMid = this.day
                }
            },
            scale1Start(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                let touch = event.targetTouches[0];
                //滑动起点的坐标
                this.startX1 = touch.pageX;
                this.startY1 = touch.pageY;
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let scaleObj = document.getElementsByClassName('yearSelector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let dy = scaleY - this.startY1
                let dx = this.startX1 - scaleX
                //与x正轴的夹角
                this.degreeStart1 = Math.atan2(dy,dx) * 180 / Math.PI;

                this.startTransform1 = document.getElementsByClassName('scaleDiv')[0].style.transform
                this.startTransform1 = this.startTransform1.substr(7, this.startTransform1.length - 4)
                this.startTransform1 = parseFloat(this.startTransform1)
            },
            scale1Move(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                let touch = event.targetTouches[0];
                _this.endX1 = touch.pageX;
                _this.endY1 = touch.pageY;
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let scaleObj = document.getElementsByClassName('yearSelector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let dy1 = scaleY - _this.endY1
                let dx1 = _this.endX1 - scaleX
                //与x正轴的夹角
                let angle = Math.atan2(dy1,dx1) * 180 / Math.PI;
                if(angle < 0) {
                    angle = 360 + angle
                    angle = Math.ceil(angle)
                } else {
                    angle = Math.floor(angle)
                }
                let degreeMinus = (_this.degreeStart1 - angle)
                degreeMinus = degreeMinus * 2
                _this.nowTransform1 = _this.startTransform1 + degreeMinus
                //100数值为旋转900度，当旋转900度后，不能再旋转
                if(_this.nowTransform1 >= (_this.mid - 1900) * 9) {
                    _this.nowTransform1 = (_this.mid - 1900) * 9
                }
                //230数值为旋转562.5度，当旋转562.5度后，不能再旋转
                if(_this.nowTransform1 <= -(2030 - _this.mid) * 9) {
                    _this.nowTransform1 = -(2030 - _this.mid) * 9
                }
                let playSound_number = ((_this.nowTransform1 - _this.lastPlayDegree1) / 9)
                if(playSound_number < 0) {
                    playSound_number = -playSound_number
                }
                if(playSound_number > 0.5 && playSound_number < 1) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                    //window.xy.vibrate('30');
                    window.xy.playSound()
                    if(_this.nowTransform1 - _this.lastPlayDegree1 < 0) {
                        _this.lastPlayDegree1 = _this.lastPlayDegree1 - 1 * 9
                    } else {
                        _this.lastPlayDegree1 = _this.lastPlayDegree1 + 1 * 9
                    }
                }
                for(let i = 1; i <= playSound_number; i++) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                   // window.xy.vibrate('30');
                    window.xy.playSound()
                    if(i + 1 > playSound_number) {
                        if(_this.nowTransform1 - _this.lastPlayDegree1 < 0) {
                            _this.lastPlayDegree1 = _this.lastPlayDegree1 - i * 9
                        } else {
                            _this.lastPlayDegree1 = _this.lastPlayDegree1 + i * 9
                        }
                    }
                }
                document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + _this.nowTransform1 + 'deg)'
                for(let j = 0;j < 7; j++) {
                    if(_this.nowTransform1 < -180 * j + 20 && _this.nowTransform1 > -180 * j) {
                        let min1 = _this.min + (20 * (j - 1))
                        let max1 = _this.max + (20 * (j - 1))
                        let mid1 = _this.mid + (20 * (j - 1))
                        if(min1 < 1900) {
                            min1 = 1900 - 1
                        }
                        if(max1 > 2030) {
                            max1 = 2030
                        }
                        if(j % 2 === 1) {
                            _this.yearHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.yearHtml += html
                            }
                        } else {
                            _this.yearHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.yearHtml1 += html
                            }
                        }
                    }
                    if(_this.nowTransform1 < -180 * j && _this.nowTransform1 > (-180 * j - 20)) {
                        let min1 = _this.min + (20 * (j + 1))
                        let max1 = _this.max + (20 * (j + 1))
                        let mid1 = _this.mid + (20 * (j + 1))
                        if(min1 < 1900) {
                            min1 = 1900 - 1
                        }
                        if(max1 > 2030) {
                            max1 = 2030
                        }
                        if(j % 2 === 1) {
                            _this.yearHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.yearHtml += html
                            }
                        } else {
                            _this.yearHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.yearHtml1 += html
                            }
                        }
                    }
                    if(_this.nowTransform1 > 180 * j - 20 && _this.nowTransform1 < 180 * j) {
                        let min1 = _this.min - (20 * (j - 1))
                        let max1 = _this.max - (20 * (j - 1))
                        let mid1 = _this.mid - (20 * (j - 1))
                        if(min1 < 1900) {
                            min1 = 1900 - 1
                        }
                        if(max1 > 2030) {
                            max1 = 2030
                        }
                        if(j % 2 === 1) {
                            _this.yearHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.yearHtml += html
                            }
                        } else {
                            _this.yearHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.yearHtml1 += html
                            }
                        }
                    } else if(_this.nowTransform1 > 180 * j && _this.nowTransform1 < 180 * j + 20) {
                        let min1 = _this.min - (20 * (j + 1))
                        let max1 = _this.max - (20 * (j + 1))
                        let mid1 = _this.mid - (20 * (j + 1))
                        if(min1 < 1900) {
                            min1 = 1900 -1
                        }
                        if(max1 > 2030) {
                            max1 = 2030
                        }
                        if(j % 2 === 1) {
                            _this.yearHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.yearHtml += html
                            }
                        } else {
                            _this.yearHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.yearHtml1 += html
                            }
                        }
                    }
                }
            },
            scale1End(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                //判断旋转角度是否是9的倍数，如果不是，则回弹到最近的9的倍数
                if(_this.nowTransform1 % 9 !== 0) {
                    let yushu = _this.nowTransform1 % 9
                    if(yushu > 0) {
                        //如果超过9的一半，则补全另一半，否则，回弹超出的部分
                        if(yushu > 9 / 2) {
                            let degreeMinus = 9 - yushu
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(degreeMinus < step) {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform1 + step * (time - 1) + degreeMinus) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform1 + step * time) + 'deg)'
                                    degreeMinus = degreeMinus - 0.2
                                    time++
                                }
                            }, 10)
                        } else {
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(yushu < step) {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform1 - step * (time - 1) - yushu) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform1 - step * time) + 'deg)'
                                    yushu = yushu - 0.2
                                    time++
                                }
                            }, 10)
                        }
                    } else {
                        yushu = -yushu
                        if(yushu > 9 / 2) {
                            let degreeMinus = 9 - yushu
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(degreeMinus < step) {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform1 - step * (time - 1) + degreeMinus) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform1 - step * time) + 'deg)'
                                    degreeMinus = degreeMinus - 0.2
                                    time++
                                }
                            }, 10)
                        } else {
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(yushu < step) {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform1 + step * (time - 1) - yushu) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform1 + step * time) + 'deg)'
                                    yushu = yushu - 0.2
                                    time++
                                }
                            }, 10)
                        }
                    }
                }
                let scaleDegree = document.getElementsByClassName('scaleDiv')[0].style.transform
                scaleDegree = scaleDegree.substr(7, scaleDegree.length - 4)
                scaleDegree = parseFloat(scaleDegree)
                let numberMinus = scaleDegree / 9
                numberMinus = Math.round(numberMinus)
                _this.year = _this.mid - numberMinus
            },
            scale2Start(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                let touch = event.targetTouches[0];
                //滑动起点的坐标
                this.startX2 = touch.pageX;
                this.startY2 = touch.pageY;
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let scaleObj = document.getElementsByClassName('monthSelector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let dy = scaleY - this.startY2
                let dx = this.startX2 - scaleX
                //与x正轴的夹角
                this.degreeStart2 = Math.atan2(dy,dx) * 180 / Math.PI;

                this.startTransform2 = document.getElementsByClassName('monthClock')[0].style.transform
                this.startTransform2 = this.startTransform2.substr(7, this.startTransform2.length - 4)
                this.startTransform2 = parseFloat(this.startTransform2)
            },
            scale2Move(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                let touch = event.targetTouches[0];
                _this.endX2 = touch.pageX;
                _this.endY2 = touch.pageY;
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let scaleObj = document.getElementsByClassName('monthSelector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let dy1 = scaleY - _this.endY2
                let dx1 = _this.endX2 - scaleX
                //与x正轴的夹角
                let angle = Math.atan2(dy1,dx1) * 180 / Math.PI;
                if(angle < 0) {
                    angle = 360 + angle
                    angle = Math.ceil(angle)
                } else {
                    angle = Math.floor(angle)
                }
                let degreeMinus = (_this.degreeStart2 - angle)
                degreeMinus = degreeMinus * 2
                _this.nowTransform2 = _this.startTransform2 + degreeMinus
                if(_this.nowTransform2 < -(12 - _this.weekMid) * 10) {
                    _this.nowTransform2 = -(12 - _this.weekMid) * 10
                }
                if(_this.nowTransform2 > (_this.weekMid - 1) * 10) {
                    _this.nowTransform2 = (_this.weekMid - 1) * 10
                }
                let playSound_number = ((_this.nowTransform2 - _this.lastPlayDegree2) / 10)
                if(playSound_number < 0) {
                    playSound_number = -playSound_number
                }
                if(playSound_number > 0.5 && playSound_number < 1) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                   // window.xy.vibrate('30');
                    window.xy.playSound()
                    if(_this.nowTransform2 - _this.lastPlayDegree2 < 0) {
                        _this.lastPlayDegree2 = _this.lastPlayDegree2 - 1 * 10
                    } else {
                        _this.lastPlayDegree2 = _this.lastPlayDegree2 + 1 * 10
                    }
                }
                for(let i = 1; i <= playSound_number; i++) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                   // window.xy.vibrate('30');
                    window.xy.playSound()
                    if(i + 1 > playSound_number) {
                        if(_this.nowTransform2 - _this.lastPlayDegree2 < 0) {
                            _this.lastPlayDegree2 = _this.lastPlayDegree2 - i * 10
                        } else {
                            _this.lastPlayDegree2 = _this.lastPlayDegree2 + i * 10
                        }
                    }
                }
                document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + _this.nowTransform2 + 'deg)'
            },
            scale2End(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                //判断旋转角度是否是11.36的倍数，如果不是，则回弹到最近的10的倍数
                if(_this.nowTransform2 % 10 !== 0) {
                    let yushu = _this.nowTransform2 % 10
                    if(yushu > 0) {
                        //如果超过10的一半，则补全另一半，否则，回弹超出的部分
                        if(yushu > 10 / 2) {
                            let degreeMinus = 10 - yushu
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(degreeMinus < step) {
                                    document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (_this.nowTransform2 + step * (time - 1) + degreeMinus) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (_this.nowTransform2 + step * time) + 'deg)'
                                    degreeMinus = degreeMinus - 0.2
                                    time++
                                }
                            }, 10)
                        } else {
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(yushu < step) {
                                    document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (_this.nowTransform2 - step * (time - 1) - yushu) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (_this.nowTransform2 - step * time) + 'deg)'
                                    yushu = yushu - 0.2
                                    time++
                                }
                            }, 10)
                        }
                    } else {
                        yushu = -yushu
                        if(yushu > 10 / 2) {
                            let degreeMinus = 10 - yushu
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(degreeMinus < step) {
                                    document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (_this.nowTransform2 - step * (time - 1) + degreeMinus) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (_this.nowTransform2 - step * time) + 'deg)'
                                    degreeMinus = degreeMinus - 0.2
                                    time++
                                }
                            }, 10)
                        } else {
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(yushu < step) {
                                    document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (_this.nowTransform2 + step * (time - 1) - yushu) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (_this.nowTransform2 + step * time) + 'deg)'
                                    yushu = yushu - 0.2
                                    time++
                                }
                            }, 10)
                        }
                    }
                }
                let scaleDegree = document.getElementsByClassName('monthClock')[0].style.transform
                scaleDegree = scaleDegree.substr(7, scaleDegree.length - 4)
                scaleDegree = parseFloat(scaleDegree)
                let numberMinus = scaleDegree / 10
                numberMinus = Math.round(numberMinus)
                _this.month = _this.weekMid - numberMinus
            },
            scale3Start(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                let touch = event.targetTouches[0];
                //滑动起点的坐标
                this.startX3 = touch.pageX;
                this.startY3 = touch.pageY;
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let scaleObj = document.getElementsByClassName('daySelector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let dy = scaleY - this.startY3
                let dx = this.startX3 - scaleX
                //与x正轴的夹角
                this.degreeStart3 = Math.atan2(dy,dx) * 180 / Math.PI;

                this.startTransform3 = document.getElementsByClassName('dayClock')[0].style.transform
                this.startTransform3 = this.startTransform3.substr(7, this.startTransform3.length - 4)
                this.startTransform3 = parseFloat(this.startTransform3)
            },
            scale3Move(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                let touch = event.targetTouches[0];
                _this.endX3 = touch.pageX;
                _this.endY3 = touch.pageY;
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let scaleObj = document.getElementsByClassName('daySelector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let dy1 = scaleY - _this.endY3
                let dx1 = _this.endX3 - scaleX
                //与x正轴的夹角
                let angle = Math.atan2(dy1,dx1) * 180 / Math.PI;
                if(angle < 0) {
                    angle = 360 + angle
                    angle = Math.ceil(angle)
                } else {
                    angle = Math.floor(angle)
                }
                let degreeMinus = (_this.degreeStart3 - angle)
                degreeMinus = degreeMinus * 2
                _this.nowTransform3 = _this.startTransform3 + degreeMinus
                if(_this.nowTransform3 >= (_this.dayMid - 1) * 11.25) {
                    _this.nowTransform3 = (_this.dayMid - 1) * 11.25
                }
                //230数值为旋转562.5度，当旋转562.5度后，不能再旋转
                if(_this.nowTransform3 <= -(_this.dayMax - _this.dayMid) * 11.25) {
                    _this.nowTransform3 = -(_this.dayMax - _this.dayMid) * 11.25
                }
                let playSound_number = ((_this.nowTransform3 - _this.lastPlayDegree3) / 10)
                if(playSound_number < 0) {
                    playSound_number = -playSound_number
                }
                if(playSound_number > 0.5 && playSound_number < 1) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                    //window.xy.vibrate('30');
                    window.xy.playSound()
                    if(_this.nowTransform3 - _this.lastPlayDegree3 < 0) {
                        _this.lastPlayDegree3 = _this.lastPlayDegree3 - 1 * 10
                    } else {
                        _this.lastPlayDegree3 = _this.lastPlayDegree3 + 1 * 10
                    }
                }
                for(let i = 1; i <= playSound_number; i++) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                    //window.xy.vibrate('30');
                    window.xy.playSound()
                    if(i + 1 > playSound_number) {
                        if(_this.nowTransform3 - _this.lastPlayDegree3 < 0) {
                            _this.lastPlayDegree3 = _this.lastPlayDegree3 - i * 10
                        } else {
                            _this.lastPlayDegree3 = _this.lastPlayDegree3 + i * 10
                        }
                    }
                }
                document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + _this.nowTransform3 + 'deg)'
            },
            scale3End(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                //判断旋转角度是否是11.25的倍数，如果不是，则回弹到最近的11.25的倍数
                if(_this.nowTransform3 % 11.25 !== 0) {
                    let yushu = _this.nowTransform3 % 11.25
                    if(yushu > 0) {
                        //如果超过11.25的一半，则补全另一半，否则，回弹超出的部分
                        if(yushu > 11.25 / 2) {
                            let degreeMinus = 11.25 - yushu
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(degreeMinus < step) {
                                    document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (_this.nowTransform3 + step * (time - 1) + degreeMinus) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (_this.nowTransform3 + step * time) + 'deg)'
                                    degreeMinus = degreeMinus - 0.2
                                    time++
                                }
                            }, 10)
                        } else {
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(yushu < step) {
                                    document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (_this.nowTransform3 - step * (time - 1) - yushu) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (_this.nowTransform3 - step * time) + 'deg)'
                                    yushu = yushu - 0.2
                                    time++
                                }
                            }, 10)
                        }
                    } else {
                        yushu = -yushu
                        if(yushu > 11.25 / 2) {
                            let degreeMinus = 11.25 - yushu
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(degreeMinus < step) {
                                    document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (_this.nowTransform3 - step * (time - 1) + degreeMinus) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (_this.nowTransform3 - step * time) + 'deg)'
                                    degreeMinus = degreeMinus - 0.2
                                    time++
                                }
                            }, 10)
                        } else {
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(yushu < step) {
                                    document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (_this.nowTransform3 + step * (time - 1) - yushu) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (_this.nowTransform3 + step * time) + 'deg)'
                                    yushu = yushu - 0.2
                                    time++
                                }
                            }, 10)
                        }
                    }
                }
                let scaleDegree = document.getElementsByClassName('dayClock')[0].style.transform
                scaleDegree = scaleDegree.substr(7, scaleDegree.length - 4)
                scaleDegree = parseFloat(scaleDegree)
                let numberMinus = scaleDegree / 11.25
                numberMinus = Math.round(numberMinus)
                _this.day = _this.dayMid - numberMinus
            },
            addYearScaleEventListen() {
                // //移动端设备的屏幕宽度
                // let clientWidth = document.documentElement.clientWidth;
                // let clientHeight = document.documentElement.clientHeight;
                // let startX = 0
                // let startY = 0
                // let endX = 0
                // let endY = 0
                // let scaleObj = document.getElementsByClassName('yearSelector')[0]
                // let scaleHeight = scaleObj.offsetHeight
                // let degreeStart = 0
                // //获取旋转基点
                // let scaleX = clientWidth / 2
                // let scaleY = clientHeight + scaleHeight * 0.7
                // let startTransform
                // let nowTransform
                // let _this = this
                // let lastPlayDegree = 0
                // //旋转方向
                // let direction
                // scaleObj.addEventListener('touchstart', function(event) {
                //     if(_this._timer > 0) {
                //         event.preventDefault()
                //         return
                //     }
                //     let touch = event.targetTouches[0];
                //     //滑动起点的坐标
                //     startX = touch.pageX;
                //     startY = touch.pageY;
                //     let dy = scaleY - startY
                //     let dx = startX - scaleX
                //     //与x正轴的夹角
                //     degreeStart = Math.atan2(dy,dx) * 180 / Math.PI;
                //
                //     startTransform = document.getElementsByClassName('scaleDiv')[0].style.transform
                //     startTransform = startTransform.substr(7, startTransform.length - 4)
                //     startTransform = parseFloat(startTransform)
                // })
                // scaleObj.addEventListener('touchmove', function(event) {
                //     if(_this._timer > 0) {
                //         event.preventDefault()
                //         return
                //     }
                //     let touch = event.targetTouches[0];
                //     endX = touch.pageX;
                //     endY = touch.pageY;
                //     let dy1 = scaleY - endY
                //     let dx1 = endX - scaleX
                //     //与x正轴的夹角
                //     let angle = Math.atan2(dy1,dx1) * 180 / Math.PI;
                //     if(angle < 0) {
                //         angle = 360 + angle
                //         angle = Math.ceil(angle)
                //     } else {
                //         angle = Math.floor(angle)
                //     }
                //     let degreeMinus = (degreeStart - angle)
                //     if(degreeMinus > 0) {
                //         direction = 'shunshizhen'
                //     } else {
                //         direction = 'nishizhen'
                //     }
                //     degreeMinus = degreeMinus * 3
                //     // console.log('转动了：' + degreeMinus)
                //     nowTransform = startTransform + degreeMinus
                //     let playSound_number = ((nowTransform - lastPlayDegree) / 9)
                //     if(playSound_number < 0) {
                //         playSound_number = -playSound_number
                //     }
                //     if(playSound_number > 0.5 && playSound_number < 1) {
                //         console.log('播放')
                //         //window.plugins.NativeAudio.stop('rotateMusic');
                //         window.plugins.NativeAudio.play('rotateMusic');
                //         if(nowTransform - lastPlayDegree < 0) {
                //             lastPlayDegree = lastPlayDegree - 1 * 9
                //         } else {
                //             lastPlayDegree = lastPlayDegree + 1 * 9
                //         }
                //     }
                //     for(let i = 1; i <= playSound_number; i++) {
                //         console.log('播放')
                //         //window.plugins.NativeAudio.stop('rotateMusic');
                //         window.plugins.NativeAudio.play('rotateMusic');
                //         if(i + 1 > playSound_number) {
                //             if(nowTransform - lastPlayDegree < 0) {
                //                 lastPlayDegree = lastPlayDegree - i * 9
                //             } else {
                //                 lastPlayDegree = lastPlayDegree + i * 9
                //             }
                //         }
                //     }
                //     //100数值为旋转900度，当旋转900度后，不能再旋转
                //     if(nowTransform >= (_this.mid - 1900) * 9) {
                //         nowTransform = (_this.mid - 1900) * 9
                //     }
                //     //230数值为旋转562.5度，当旋转562.5度后，不能再旋转
                //     if(nowTransform <= -(2030 - _this.mid) * 9) {
                //         nowTransform = -(2030 - _this.mid) * 9
                //     }
                //     document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + nowTransform + 'deg)'
                //     for(let j = 0;j < 7; j++) {
                //         if(nowTransform < -180 * j + 20 && nowTransform > -180 * j) {
                //             let min1 = _this.min + (20 * (j - 1))
                //             let max1 = _this.max + (20 * (j - 1))
                //             let mid1 = _this.mid + (20 * (j - 1))
                //             if(min1 < 1900) {
                //                 min1 = 1900 - 1
                //             }
                //             if(max1 > 2030) {
                //                 max1 = 2030
                //             }
                //             if(j % 2 === 1) {
                //                 _this.yearHtml = ''
                //                 for(let i = min1 + 1; i <= max1; i++) {
                //                     let degree = (i - mid1) * 9
                //                     let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                //                     html = html + '>' + i + '</div>'
                //                     _this.yearHtml += html
                //                 }
                //             } else {
                //                 _this.yearHtml1 = ''
                //                 for(let i = min1 + 1; i <= max1; i++) {
                //                     let degree = (i - mid1) * 9
                //                     let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                //                     html = html + '>' + i + '</div>'
                //                     _this.yearHtml1 += html
                //                 }
                //             }
                //         }
                //         if(nowTransform < -180 * j && nowTransform > (-180 * j - 20)) {
                //             let min1 = _this.min + (20 * (j + 1))
                //             let max1 = _this.max + (20 * (j + 1))
                //             let mid1 = _this.mid + (20 * (j + 1))
                //             if(min1 < 1900) {
                //                 min1 = 1900 - 1
                //             }
                //             if(max1 > 2030) {
                //                 max1 = 2030
                //             }
                //             if(j % 2 === 1) {
                //                 _this.yearHtml = ''
                //                 for(let i = min1 + 1; i <= max1; i++) {
                //                     let degree = (i - mid1) * 9
                //                     let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                //                     html = html + '>' + i + '</div>'
                //                     _this.yearHtml += html
                //                 }
                //             } else {
                //                 _this.yearHtml1 = ''
                //                 for(let i = min1 + 1; i <= max1; i++) {
                //                     let degree = (i - mid1) * 9
                //                     let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                //                     html = html + '>' + i + '</div>'
                //                     _this.yearHtml1 += html
                //                 }
                //             }
                //         }
                //         if(nowTransform > 180 * j - 20 && nowTransform < 180 * j) {
                //             let min1 = _this.min - (20 * (j - 1))
                //             let max1 = _this.max - (20 * (j - 1))
                //             let mid1 = _this.mid - (20 * (j - 1))
                //             if(min1 < 1900) {
                //                 min1 = 1900 - 1
                //             }
                //             if(max1 > 2030) {
                //                 max1 = 2030
                //             }
                //             if(j % 2 === 1) {
                //                 _this.yearHtml = ''
                //                 for(let i = min1 + 1; i <= max1; i++) {
                //                     let degree = (i - mid1) * 9
                //                     let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                //                     html = html + '>' + i + '</div>'
                //                     _this.yearHtml += html
                //                 }
                //             } else {
                //                 _this.yearHtml1 = ''
                //                 for(let i = min1 + 1; i <= max1; i++) {
                //                     let degree = (i - mid1) * 9
                //                     let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                //                     html = html + '>' + i + '</div>'
                //                     _this.yearHtml1 += html
                //                 }
                //             }
                //         } else if(nowTransform > 180 * j && nowTransform < 180 * j + 20) {
                //             let min1 = _this.min - (20 * (j + 1))
                //             let max1 = _this.max - (20 * (j + 1))
                //             let mid1 = _this.mid - (20 * (j + 1))
                //             if(min1 < 1900) {
                //                 min1 = 1900 -1
                //             }
                //             if(max1 > 2030) {
                //                 max1 = 2030
                //             }
                //             if(j % 2 === 1) {
                //                 _this.yearHtml = ''
                //                 for(let i = min1 + 1; i <= max1; i++) {
                //                     let degree = (i - mid1) * 9
                //                     let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                //                     html = html + '>' + i + '</div>'
                //                     _this.yearHtml += html
                //                 }
                //             } else {
                //                 _this.yearHtml1 = ''
                //                 for(let i = min1 + 1; i <= max1; i++) {
                //                     let degree = (i - mid1) * 9
                //                     let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                //                     html = html + '>' + i + '</div>'
                //                     _this.yearHtml1 += html
                //                 }
                //             }
                //         }
                //     }
                // })
                // scaleObj.addEventListener('touchend', function(event) {
                //     if(_this._timer > 0) {
                //         event.preventDefault()
                //         return
                //     }
                //     //判断旋转角度是否是9的倍数，如果不是，则回弹到最近的9的倍数
                //     if(nowTransform % 9 !== 0) {
                //         let yushu = nowTransform % 9
                //         if(yushu > 0) {
                //             //如果超过9的一半，则补全另一半，否则，回弹超出的部分
                //             if(yushu > 9 / 2) {
                //                 let degreeMinus = 9 - yushu
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(degreeMinus < step) {
                //                         document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) + degreeMinus) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                //                         degreeMinus = degreeMinus - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             } else {
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(yushu < step) {
                //                         document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) - yushu) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
                //                         yushu = yushu - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             }
                //         } else {
                //             yushu = -yushu
                //             if(yushu > 9 / 2) {
                //                 let degreeMinus = 9 - yushu
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(degreeMinus < step) {
                //                         document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) + degreeMinus) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
                //                         degreeMinus = degreeMinus - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             } else {
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(yushu < step) {
                //                         document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) - yushu) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                //                         yushu = yushu - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             }
                //         }
                //     }
                //     let scaleDegree = document.getElementsByClassName('scaleDiv')[0].style.transform
                //     scaleDegree = scaleDegree.substr(7, scaleDegree.length - 4)
                //     scaleDegree = parseFloat(scaleDegree)
                //     let numberMinus = scaleDegree / 9
                //     numberMinus = Math.round(numberMinus)
                //     _this.year = _this.mid - numberMinus
                //     // let scaleMinus = scaleDegree - startTransform
                //     // let numberMinus = scaleMinus / 9
                //     // numberMinus = Math.round(numberMinus)
                //     // _this.year = _this.year - numberMinus
                // })
            },
            addDayScaleEventListen() {
                //移动端设备的屏幕宽度
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let startX = 0
                let startY = 0
                let endX = 0
                let endY = 0
                let scaleObj = document.getElementsByClassName('daySelector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let degreeStart = 0
                //获取旋转基点
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let startTransform
                let nowTransform
                let _this = this
                let lastPlayDegree = 0
                scaleObj.addEventListener('touchstart', function(event) {
                    if(_this._timer > 0) {
                        event.preventDefault()
                        return
                    }
                    let touch = event.targetTouches[0];
                    //滑动起点的坐标
                    startX = touch.pageX;
                    startY = touch.pageY;
                    let dy = scaleY - startY
                    let dx = startX - scaleX
                    //与x正轴的夹角
                    degreeStart = Math.atan2(dy,dx) * 180 / Math.PI;

                    startTransform = document.getElementsByClassName('dayClock')[0].style.transform
                    startTransform = startTransform.substr(7, startTransform.length - 4)
                    startTransform = parseFloat(startTransform)
                })
                scaleObj.addEventListener('touchmove', function(event) {
                    if(_this._timer > 0) {
                        event.preventDefault()
                        return
                    }
                    let touch = event.targetTouches[0];
                    endX = touch.pageX;
                    endY = touch.pageY;
                    let dy1 = scaleY - endY
                    let dx1 = endX - scaleX
                    //与x正轴的夹角
                    let angle = Math.atan2(dy1,dx1) * 180 / Math.PI;
                    if(angle < 0) {
                        angle = 360 + angle
                        angle = Math.ceil(angle)
                    } else {
                        angle = Math.floor(angle)
                    }
                    let degreeMinus = (degreeStart - angle)
                    degreeMinus = degreeMinus * 3
                    //console.log('转动了：' + degreeMinus)
                    nowTransform = startTransform + degreeMinus
                    let playSound_number = ((nowTransform - lastPlayDegree) / 11.25)
                    if(playSound_number < 0) {
                        playSound_number = -playSound_number
                    }
                    if(playSound_number > 0.5 && playSound_number < 1) {
                        console.log('播放')
                        //window.plugins.NativeAudio.stop('rotateMusic');
                       // window.xy.vibrate('30');
                        window.xy.playSound()

                        if(nowTransform - lastPlayDegree < 0) {
                            lastPlayDegree = lastPlayDegree - 1 * 11.25
                        } else {
                            lastPlayDegree = lastPlayDegree + 1 * 11.25
                        }
                    }
                    for(let i = 1; i <= playSound_number; i++) {
                        console.log('播放')
                        //window.plugins.NativeAudio.stop('rotateMusic');
                        //window.xy.vibrate('30');
                        window.xy.playSound()
                        if(i + 1 > playSound_number) {
                            if(nowTransform - lastPlayDegree < 0) {
                                lastPlayDegree = lastPlayDegree - i * 11.25
                            } else {
                                lastPlayDegree = lastPlayDegree + i * 11.25
                            }
                        }
                    }
                    if(nowTransform >= (_this.dayMid - 1) * 11.25) {
                        nowTransform = (_this.dayMid - 1) * 11.25
                    }
                    //230数值为旋转562.5度，当旋转562.5度后，不能再旋转
                    if(nowTransform <= -(_this.dayMax - _this.dayMid) * 11.25) {
                        nowTransform = -(_this.dayMax - _this.dayMid) * 11.25
                    }
                    document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + nowTransform + 'deg)'
                })
                scaleObj.addEventListener('touchend', function(event) {
                    if(_this._timer > 0) {
                        event.preventDefault()
                        return
                    }
                    //判断旋转角度是否是11.25的倍数，如果不是，则回弹到最近的11.25的倍数
                    if(nowTransform % 11.25 !== 0) {
                        let yushu = nowTransform % 11.25
                        if(yushu > 0) {
                            //如果超过11.25的一半，则补全另一半，否则，回弹超出的部分
                            if(yushu > 11.25 / 2) {
                                let degreeMinus = 11.25 - yushu
                                let time = 1
                                _this._timer = setInterval(function() {
                                    let step = 0.2
                                    if(degreeMinus < step) {
                                        document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) + degreeMinus) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                                        degreeMinus = degreeMinus - 0.2
                                        time++
                                    }
                                }, 10)
                            } else {
                                let time = 1
                                _this._timer = setInterval(function() {
                                    let step = 0.2
                                    if(yushu < step) {
                                        document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) - yushu) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
                                        yushu = yushu - 0.2
                                        time++
                                    }
                                }, 10)
                            }
                        } else {
                            yushu = -yushu
                            if(yushu > 11.25 / 2) {
                                let degreeMinus = 11.25 - yushu
                                let time = 1
                                _this._timer = setInterval(function() {
                                    let step = 0.2
                                    if(degreeMinus < step) {
                                        document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) + degreeMinus) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
                                        degreeMinus = degreeMinus - 0.2
                                        time++
                                    }
                                }, 10)
                            } else {
                                let time = 1
                                _this._timer = setInterval(function() {
                                    let step = 0.2
                                    if(yushu < step) {
                                        document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) - yushu) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                                        yushu = yushu - 0.2
                                        time++
                                    }
                                }, 10)
                            }
                        }
                    }
                    let scaleDegree = document.getElementsByClassName('dayClock')[0].style.transform
                    scaleDegree = scaleDegree.substr(7, scaleDegree.length - 4)
                    scaleDegree = parseFloat(scaleDegree)
                    let numberMinus = scaleDegree / 11.25
                    numberMinus = Math.round(numberMinus)
                    _this.day = _this.dayMid - numberMinus
                    // let scaleMinus = scaleDegree - startTransform
                    // let numberMinus = scaleMinus / 11.25
                    // numberMinus = Math.round(numberMinus)
                    // _this.day = _this.day - numberMinus
                })
            },
            addMonthEventListen() {
                // //移动端设备的屏幕宽度
                // let clientWidth = document.documentElement.clientWidth;
                // let clientHeight = document.documentElement.clientHeight;
                // let startX = 0
                // let startY = 0
                // let endX = 0
                // let endY = 0
                // let scaleObj = document.getElementsByClassName('monthSelector')[0]
                // let scaleHeight = scaleObj.offsetHeight
                // let degreeStart = 0
                // //获取旋转基点
                // let scaleX = clientWidth / 2
                // let scaleY = clientHeight + scaleHeight * 0.7
                // let startTransform
                // let nowTransform
                // let _this = this
                // let lastPlayDegree = 0
                // scaleObj.addEventListener('touchstart', function(event) {
                //     if(_this._timer > 0) {
                //         event.preventDefault()
                //         return
                //     }
                //     let touch = event.targetTouches[0];
                //     //滑动起点的坐标
                //     startX = touch.pageX;
                //     startY = touch.pageY;
                //     let dy = scaleY - startY
                //     let dx = startX - scaleX
                //     //与x正轴的夹角
                //     degreeStart = Math.atan2(dy,dx) * 180 / Math.PI;
                //
                //     startTransform = document.getElementsByClassName('monthClock')[0].style.transform
                //     startTransform = startTransform.substr(7, startTransform.length - 4)
                //     startTransform = parseFloat(startTransform)
                // })
                // scaleObj.addEventListener('touchmove', function(event) {
                //     if(_this._timer > 0) {
                //         event.preventDefault()
                //         return
                //     }
                //     let touch = event.targetTouches[0];
                //     endX = touch.pageX;
                //     endY = touch.pageY;
                //     let dy1 = scaleY - endY
                //     let dx1 = endX - scaleX
                //     //与x正轴的夹角
                //     let angle = Math.atan2(dy1,dx1) * 180 / Math.PI;
                //     if(angle < 0) {
                //         angle = 360 + angle
                //         angle = Math.ceil(angle)
                //     } else {
                //         angle = Math.floor(angle)
                //     }
                //     let degreeMinus = (degreeStart - angle)
                //     //console.log('转动了：' + degreeMinus)
                //     nowTransform = startTransform + degreeMinus
                //     let playSound_number = ((nowTransform - lastPlayDegree) / 10)
                //     if(playSound_number < 0) {
                //         playSound_number = -playSound_number
                //     }
                //     if(playSound_number > 0.5 && playSound_number < 1) {
                //         console.log('播放')
                //         //window.plugins.NativeAudio.stop('rotateMusic');
                //         window.plugins.NativeAudio.play('rotateMusic');
                //         if(nowTransform - lastPlayDegree < 0) {
                //             lastPlayDegree = lastPlayDegree - 1 * 10
                //         } else {
                //             lastPlayDegree = lastPlayDegree + 1 * 10
                //         }
                //     }
                //     for(let i = 1; i <= playSound_number; i++) {
                //         console.log('播放')
                //         //window.plugins.NativeAudio.stop('rotateMusic');
                //         window.plugins.NativeAudio.play('rotateMusic');
                //         if(i + 1 > playSound_number) {
                //             if(nowTransform - lastPlayDegree < 0) {
                //                 lastPlayDegree = lastPlayDegree - i * 10
                //             } else {
                //                 lastPlayDegree = lastPlayDegree + i * 10
                //             }
                //         }
                //     }
                //     if(nowTransform < -(12 - _this.weekMid) * 10) {
                //         nowTransform = -(12 - _this.weekMid) * 10
                //     }
                //     if(nowTransform > (_this.weekMid - 1) * 10) {
                //         nowTransform = (_this.weekMid - 1) * 10
                //     }
                //     document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + nowTransform + 'deg)'
                // })
                // scaleObj.addEventListener('touchend', function(event) {
                //     if(_this._timer > 0) {
                //         event.preventDefault()
                //         return
                //     }
                //     //判断旋转角度是否是11.36的倍数，如果不是，则回弹到最近的10的倍数
                //     if(nowTransform % 10 !== 0) {
                //         let yushu = nowTransform % 10
                //         if(yushu > 0) {
                //             //如果超过10的一半，则补全另一半，否则，回弹超出的部分
                //             if(yushu > 10 / 2) {
                //                 let degreeMinus = 10 - yushu
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(degreeMinus < step) {
                //                         document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) + degreeMinus) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                //                         degreeMinus = degreeMinus - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             } else {
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(yushu < step) {
                //                         document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) - yushu) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
                //                         yushu = yushu - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             }
                //         } else {
                //             yushu = -yushu
                //             if(yushu > 10 / 2) {
                //                 let degreeMinus = 10 - yushu
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(degreeMinus < step) {
                //                         document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) + degreeMinus) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
                //                         degreeMinus = degreeMinus - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             } else {
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(yushu < step) {
                //                         document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) - yushu) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('monthClock')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                //                         yushu = yushu - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             }
                //         }
                //     }
                //     let scaleDegree = document.getElementsByClassName('monthClock')[0].style.transform
                //     scaleDegree = scaleDegree.substr(7, scaleDegree.length - 4)
                //     scaleDegree = parseFloat(scaleDegree)
                //     let numberMinus = scaleDegree / 10
                //     numberMinus = Math.round(numberMinus)
                //     _this.month = _this.weekMid - numberMinus
                //     // let scaleMinus = scaleDegree - startTransform
                //     // let numberMinus = scaleMinus / 10
                //     // numberMinus = Math.round(numberMinus)
                //     // _this.month = _this.month - numberMinus
                // })
            },
            initYearSelector() {
                let max = this.max
                let min = this.min
                let mid = this.mid
                if(max > 2030) {
                    max = 2030
                }
                if(min < 1900) {
                    min = 1900 - 1
                }
                //每个旋转11.36度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.36度，小于的话就相反
                for(let i = min + 1; i <= max; i++) {
                    let degree = (i - mid) * 9
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '</div>'
                    this.yearHtml += html
                }
                let _this = this
                this.$nextTick(function() {
                    //_this.addYearScaleEventListen()
                })
            },
            //初始化月份表盘
            initMonthSelector() {
                let min = this.weekMin
                let max = this.weekMax
                let mid = this.weekMid
                //每个旋转11.36度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.36度，小于的话就相反
                for(let i = min; i <= max; i++) {
                    let degree = (i - mid) * 10
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + this.monthList[i] + '</div>'
                    this.monthHtml += html
                }
                let _this = this
                this.$nextTick(function() {
                    //_this.addMonthEventListen()
                })
            },
            //初始化天数表盘
            initDaySelecor() {
                let min = 1
                let max = 30
                let mid = this.dayMid
                if(this.month === 1|| this.month === 3 || this.month === 5|| this.month === 7 || this.month === 8 || this.month === 10 || this.month === 12) {
                    max = 31
                }
                if(this.month === 2) {
                    max = 28
                }
                //闰年
                if(this.year % 4 === 0 && this.year % 100 !==0 || this.year % 400 === 0){
                    if(this.month === 2) {
                        max = 29
                    }
                }
                this.dayMax = max
                //每个旋转11.36度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.36度，小于的话就相反
                for(let i = min; i <= max; i++) {
                    let degree = (i - mid) * 11.25
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '日</div>'
                    this.dayHtml += html
                }
                let _this = this
                this.$nextTick(function() {
                    //_this.addDayScaleEventListen()
                })
            },
            routeTo(path) {

                localStorage.setItem('myYear', this.year)
                localStorage.setItem('myMonth', this.month)
                localStorage.setItem('myDay', this.day)

                let obj={};
                obj.birth=localStorage.myYear+"-"+localStorage.myMonth+"-"+localStorage.myDay;
                // 1:男，2：女
                obj.sex=localStorage.selectSex =='1' ? '1' :'2';
                obj.height=localStorage.myHeight;

                api.baseInfoSetting(obj).then(res=>{
                    console.log(res);
                    if(res.code=='2000'){
                        clearInterval(this._timer);
                        for(let i=0;i<20000;i++){
                            clearInterval(i);
                        }
                        //this.$toast.success('设置成功');
                        this.$router.push({path: path})
                    }else{
                        this.$toast.fail(res.msg);
                    }

                }).catch(err=>{
                    //this.$toast.fail('设置失败');
                })

                //this.$router.push({path: path})

            },
            routeTouch(event) {
                event.stopPropagation()
            },
            routeTouchEnd(event) {
                event.stopPropagation()
            },
            saveUserBaseInfo(){

            },
            back() {
                this.$router.push({path: '/height'})
            }
        },
        watch: {
            year(value) {
                let min = 1
                let max = 30
                let mid = this.dayMid
                if(this.month === 1|| this.month === 3 || this.month === 5|| this.month === 7 || this.month === 8 || this.month === 10 || this.month === 12) {
                    max = 31
                }
                if(this.month === 2) {
                    max = 28
                }
                //闰年
                if(this.year % 4 === 0 && this.year % 100 !==0 || this.year % 400 === 0){
                    if(this.month === 2) {
                        max = 29
                    }
                }
                if(mid > max) {
                    mid = this.dayMid = 1
                }
                this.dayMax = max
                this.dayHtml = ''
                //每个旋转11.36度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.36度，小于的话就相反
                for(let i = min; i <= max; i++) {
                    let degree = (i - mid) * 11.25
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '日</div>'
                    this.dayHtml += html
                }
                document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(0deg)'
            },
            month(value) {
                let min = 1
                let max = 30
                let mid = this.dayMid
                if(this.month === 1|| this.month === 3 || this.month === 5|| this.month === 7 || this.month === 8 || this.month === 10 || this.month === 12) {
                    max = 31
                }
                if(this.month === 2) {
                    max = 28
                }
                //闰年
                if(this.year % 4 === 0 && this.year % 100 !==0 || this.year % 400 === 0){
                    if(this.month === 2) {
                        max = 29
                    }
                }
                if(mid > max) {
                    mid = this.dayMid = 1
                }
                this.day = mid
                this.dayMax = max
                this.dayHtml = ''
                //每个旋转11.36度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.36度，小于的话就相反
                for(let i = min; i <= max; i++) {
                    let degree = (i - mid) * 11.25
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '日</div>'
                    this.dayHtml += html
                }
                document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(0deg)'
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .birth[type="1"] {
    background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
  }
  .birth[type="0"] {
    background-image: linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
  }
  .birth{
    overflow: hidden;
    height: 100%;width: 100%;
    .back{
      position: absolute;
      left: 0.8rem;
      top: 1.2rem;
      transform: rotate(90deg);
      width: 0.35rem;
    }
    .questions{
      text-align: center;position: absolute;top: 28%;left: 50%;transform: translate(-50%, 0);width: 100%;
      .question{
        font-size: 0.64rem;color: #fff;font-family: 'PingFang Medium';
      }
      .answer{
        font-size: 0.45rem;color: #fff;margin-top: 0.3rem;
      }
    }
    .container{
      width: 100%;height: 8.28rem;overflow: hidden;position: absolute;bottom:0;
    }
    .selector{
      width: 13.3rem;height: 13.3rem;position: absolute;background-color: #035CC7;border-radius: 50%;overflow: hidden;
      left: 50%;margin-left: -6.65rem;box-shadow:0px 29px 0.85rem 5px rgba(0, 0, 0, 1);transform-origin: 50% 50%;
      .btn{
        width:2.3rem;position: absolute;top:2rem;left: 50%;margin-left: -1.15rem;height:0.9rem;
        background:rgba(0,4,63,1);box-shadow:0px 17px 67px 3px rgba(0, 0, 0, 0.26);
        border-radius:0.44rem;z-index: 12;text-align: center;
        img{
          width: 0.45rem;height: 0.45rem;vertical-align: top;margin-top: 0.24rem;
        }
      }
      .scaleDiv{
        width: 100%;height: 100%;border-radius: 50%;
      }
      .icon-queding{
        margin-top: 0.1rem;
        vertical-align: top;
        display: block;
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .birth{
    .selector[type="0"] {
      background-color: #F93ABD;
      .leftOverLay, .rightOverLay{
        background-color: #F93ABD;
      }
    }
    .selector[type="1"] {
      background-color: #035CC7;
      .leftOverLay, .rightOverLay{
        background-color: #035CC7;
      }
    }
    .selector[type="0"] {
      background-color: #F93ABD;
      .icon-queding{
        color: #F93ABD;
      }
    }
    .selector[type="1"] {
      background-color: #035CC7;
      .icon-queding{
        color: #035CC7;
      }
    }
    .selector{
      z-index: 9;
      .clock{
        width: 100%;height: 50%;border-top-left-radius: 50%;border-top-right-radius: 50%;position: absolute;
        top: 0;transform-origin: 50% 100%;
      }
      .clock1{
        width: 100%;height: 50%;border-bottom-left-radius: 50%;border-bottom-right-radius: 50%;position: absolute;
        top: 50%;
      }
      .number{
        transform-origin: 50% 50%;position: absolute;top: 0;left: 50%;width: 1rem;height: 12.8rem;
        color: #fff;margin-left: -0.35rem;font-size: 0.43rem;text-align: center;padding-top: 0.5rem;
        z-index: 10;
      }
      .leftOverLay{
        width: 5.5rem;height: 13.3rem;position: absolute;left: 0.5rem;top: 0.2rem;
        border-top-left-radius: 13.3rem;border-bottom-left-radius: 13.3rem;
        background: #035cc7;z-index: 11;opacity: 0.7;
      }
      .rightOverLay{
        width: 5.5rem;height: 13.3rem;position: absolute;right: 0.5rem;top: 0.2rem;
        border-top-right-radius: 13.3rem;border-bottom-right-radius: 13.3rem;
        background: #035cc7;z-index: 11;opacity: 0.7;
      }
    }
    .yearSelector{
      top: 0rem;z-index: 9;width: 21.3rem!important;height: 21.3rem!important;margin-left: -10.65rem!important;
      .number{
        width: 1rem;height: 20.5rem;padding-top: 0.8rem;margin-left: -0.5rem!important;
      }
      .leftOverLay{
        width: 9.5rem;height: 21.3rem;border-top-left-radius: 21.3rem;border-bottom-left-radius: 21.3rem;
      }
      .rightOverLay{
        width: 9.5rem;height: 21.3rem;border-top-right-radius: 21.3rem;border-bottom-right-radius: 21.3rem;
      }
    }
    .monthSelector{
      top: 2.26rem;z-index: 10;width: 17.3rem!important;height: 17.3rem!important;margin-left: -8.65rem!important;
      .number{
        width: 1rem;height: 16.5rem;padding-top: 0.8rem;margin-left: -0.5rem!important;
      }
      .leftOverLay{
        width: 7.5rem;height: 17.3rem;border-top-left-radius: 17.3rem;border-bottom-left-radius: 17.3rem;
      }
      .rightOverLay{
        width: 7.5rem;height: 17.3rem;border-top-right-radius: 17.3rem;border-bottom-right-radius: 17.3rem;
      }
    }
    .daySelector{
      top: 4.52rem;z-index: 11;
      .number{
        width: 1rem;height: 12.8rem;padding-top: 0.5rem;margin-left: -0.5rem!important;
      }
      .leftOverLay{
        width: 5.6rem;height: 13.3rem;border-top-left-radius: 13.3rem;border-bottom-left-radius: 13.3rem;
      }
      .rightOverLay{
        width: 5.6rem;height: 13.3rem;border-top-right-radius: 13.3rem;border-bottom-right-radius: 13.3rem;
      }
    }
  }
</style>
