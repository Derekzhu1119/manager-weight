<template>
  <div class="goalWeight" :type="sex">
    <img src="../assets/images/i4.png" alt="" @click="back()" class="back">
    <div class="questions" v-show="type !== 2">
      <p class="question">你的目标体重是</p>
      <p class="answer">{{goalHeight}}kg</p>
    </div>
    <div class="questions" v-show="type === 2">
      <p class="question">您目前的体重是{{nowWeight}}kg</p>
      <p class="answer">请点击确认查看健康报告</p>
    </div>
    <div class="questions questions2" v-show="type !== 2">
      <p class="question">要多长时间达到目标重量？</p>
      <p class="answer">{{week}}周</p>
      <p class="answer answer1">{{typeList[type]}}</p>
    </div>
    <div class="container">
      <div class="selector yearSelector" v-show="type !== 2" :type="sex" @touchstart="scale1Start" @touchmove="scale1Move" @touchend="scale1End">
        <div class="leftOverLay"></div>
        <div class="rightOverLay"></div>
        <div class="scaleDiv" style="transform: rotate(0deg)">
          <div class="clock yearClock"  style="transform: rotate(0deg)" v-html="selectorHtml"></div>
          <div class="clock1"  style="transform: rotate(180deg)" v-html="selectorHtml1"></div>
        </div>
      </div>
      <div class="selector selector1 monthSelector" v-show="type !== 2" :type="sex" @touchstart="scale2Start" @touchmove="scale2Move" @touchend="scale2End">
        <div class="leftOverLay"></div>
        <div class="rightOverLay"></div>
        <div class="scaleDiv1" style="transform: rotate(0deg)">
          <div class="clock monthClock"  style="transform: rotate(0deg)" v-html="weekHtml"></div>
          <div class="clock1"  style="transform: rotate(180deg)" v-html="weekHtml1"></div>
        </div>
      </div>
      <div class="selector selector2 daySelector" :type="sex" @touchstart="scale3Start" @touchmove="scale3Move" @touchend="scale3End">
        <div class="leftOverLay"></div>
        <div class="rightOverLay"></div>
        <div class="btn" @click="routeTo('/body-data?type=1')" @touchmove="routeTouch" @touchend="routeTouchEnd">
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
                selectorHtml: '',
                selectorHtml1: '',
                weekHtml: '',
                weekHtml1: '',
                dayHtml: '',
                goalHeight: parseInt(this.$route.query.nowWeight),
                week: 20,
                typeList: ['', '减轻重量', '塑形', '增重增肌'],
                type: 2,
                min: 30,
                mid: 40,
                max: 50,
                maxWeight: 200,
                minWeight: 30,
                weekMin: 0,
                weekMid: 10,
                weekMax: 20,
                maxWeek: 100,
                nowWeight: parseInt(this.$route.query.nowWeight),
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
            this.initWeekSelector()
            this.initTypeSelecor()
            this.initGoalHeightSelector()
            this.getBMIMsg()
        },
        methods: {
            init() {
              if(localStorage.myWeight) {
                  this.goalHeight = parseInt(localStorage.myWeight)
                  this.nowWeight = parseInt(localStorage.myWeight)
                  this.mid = this.goalHeight
                  this.max = this.mid + 10
                  this.min = this.mid - 10
              }
            },
            getBMIMsg() {
                let _this = this
                api.getBMIMsg(this.nowWeight).then(res=>{
                    if(res.code=='2000'){
                        if(res.result === '1') {
                            _this.$toast('您的身材非常标准，建议您选择目标为塑形')
                        } else if(res.result === '2' || res.result === '4') {
                            _this.$toast('建议您选择减轻重量')
                        } else if(res.result === '3') {
                            _this.$toast('建议您选择增重增肌')
                        }
                    }
                }).catch(err=>{
                    //this.$toast.fail('获取BMI信息失败')
                })
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
                if(_this.nowTransform1 >= (_this.mid - _this.minWeight) * 9) {
                    _this.nowTransform1 = (_this.mid - _this.minWeight) * 9
                }
                //200数值为旋转562.5度，当旋转562.5度后，不能再旋转
                if(_this.nowTransform1 <= -(_this.maxWeight - _this.mid) * 9) {
                    _this.nowTransform1 = -(_this.maxWeight - _this.mid) * 9
                }
                let playSound_number = ((_this.nowTransform1 - _this.lastPlayDegree1) / 9)
                if(playSound_number < 0) {
                    playSound_number = -playSound_number
                }
                if(playSound_number > 0.5 && playSound_number < 1) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                   // window.xy.vibrate('30');
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
                for(let j = 0;j < 9; j++) {
                    if(_this.nowTransform1 < -180 * j + 20 && _this.nowTransform1 > -180 * j) {
                        let min1 = _this.min + (20 * (j - 1))
                        let max1 = _this.max + (20 * (j - 1))
                        let mid1 = _this.mid + (20 * (j - 1))
                        if(min1 < _this.minWeight) {
                            min1 = _this.minWeight - 1
                        }
                        if(max1 > _this.maxWeight) {
                            max1 = _this.maxWeight
                        }
                        if(j % 2 === 1) {
                            _this.selectorHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml += html
                            }
                        } else {
                            _this.selectorHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml1 += html
                            }
                        }
                    }
                    if(_this.nowTransform1 < -180 * j && _this.nowTransform1 > (-180 * j - 20)) {
                        let min1 = _this.min + (20 * (j + 1))
                        let max1 = _this.max + (20 * (j + 1))
                        let mid1 = _this.mid + (20 * (j + 1))
                        if(min1 < _this.minWeight) {
                            min1 = _this.minWeight - 1
                        }
                        if(max1 > _this.maxWeight) {
                            max1 = _this.maxWeight
                        }
                        if(j % 2 === 1) {
                            _this.selectorHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml += html
                            }
                        } else {
                            _this.selectorHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml1 += html
                            }
                        }
                    }
                    if(_this.nowTransform1 > 180 * j - 20 && _this.nowTransform1 < 180 * j) {
                        let min1 = _this.min - (20 * (j - 1))
                        let max1 = _this.max - (20 * (j - 1))
                        let mid1 = _this.mid - (20 * (j - 1))
                        if(min1 < _this.minWeight) {
                            min1 = _this.minWeight - 1
                        }
                        if(max1 > _this.maxWeight) {
                            max1 = _this.maxWeight
                        }
                        if(j % 2 === 1) {
                            _this.selectorHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml += html
                            }
                        } else {
                            _this.selectorHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml1 += html
                            }
                        }
                    } else if(_this.nowTransform1 > 180 * j && _this.nowTransform1 < 180 * j + 20) {
                        let min1 = _this.min - (20 * (j + 1))
                        let max1 = _this.max - (20 * (j + 1))
                        let mid1 = _this.mid - (20 * (j + 1))
                        if(min1 < _this.minWeight) {
                            min1 = _this.minWeight -1
                        }
                        if(max1 > _this.maxWeight) {
                            max1 = _this.maxWeight
                        }
                        if(j % 2 === 1) {
                            _this.selectorHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml += html
                            }
                        } else {
                            _this.selectorHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 9
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml1 += html
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
                _this.goalHeight = _this.mid - numberMinus
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

                this.startTransform2 = document.getElementsByClassName('scaleDiv1')[0].style.transform
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
                //100数值为旋转900度，当旋转900度后，不能再旋转
                let minScale = (_this.weekMid - _this.weekMin) * 10
                if(_this.nowTransform2 >= minScale) {
                    _this.nowTransform2 = minScale
                }
                let maxScale = (_this.maxWeek - _this.weekMid) * 10
                //200数值为旋转562.5度，当旋转562.5度后，不能再旋转
                if(_this.nowTransform2 <= -maxScale) {
                    _this.nowTransform2 = -maxScale
                }
                let playSound_number = ((_this.nowTransform2 - _this.lastPlayDegree2) / 10)
                if(playSound_number < 0) {
                    playSound_number = -playSound_number
                }
                if(playSound_number > 0.5 && playSound_number < 1) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                   // winwindow.xy.vibrate('30');
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
                document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + _this.nowTransform2 + 'deg)'
                //通过判断比180整数倍多出或者少出一点，来判断旋转方向
                if(_this.nowTransform2 > 0 && _this.nowTransform2 < 20) {
                    _this.weekHtml1 = ''
                }
                if(_this.nowTransform2 < 0 && _this.nowTransform2 > -40) {
                    let min1 = _this.weekMin + (18 * 1)
                    let max1 = _this.weekMax + (18 * 1)
                    let mid1 = _this.weekMid + (18 * 1)
                    if(max1 > _this.maxWeek) {
                        max1 = _this.maxWeek
                    }
                    _this.weekHtml1 = ''
                    for(let i = min1 + 1; i <= max1; i++) {
                        let degree = (i - mid1) * 10
                        let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                        html = html + '>' + i + '</div>'
                        _this.weekHtml1 += html
                    }
                }
                for(let j = 1;j < 94; j++) {
                    if(_this.nowTransform2 < -180 * j + 20 && _this.nowTransform2 > -180 * j) {
                        let min1 = _this.weekMin + (18 * (j - 1))
                        let max1 = _this.weekMax + (18 * (j - 1))
                        let mid1 = _this.weekMid + (18 * (j - 1))
                        if(min1 > _this.maxWeek) {
                            min1 = _this.maxWeek
                            mid1 = _this.maxWeek
                        }
                        if(max1 > _this.maxWeek) {
                            max1 = _this.maxWeek
                        }
                        if(j % 2 === 1) {
                            _this.weekHtml = ''
                            if(j === 1) {
                                for(let i = min1; i <= max1; i++) {
                                    let degree = (i - mid1) * 10
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.weekHtml += html
                                }
                            } else {
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 10
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.weekHtml += html
                                }
                            }
                        } else {
                            _this.weekHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 10
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.weekHtml1 += html
                            }
                        }
                    }
                    if(_this.nowTransform2 < -180 * j && _this.nowTransform2 > (-180 * j - 20)) {
                        let min1 = _this.weekMin + (18 * (j + 1))
                        let max1 = _this.weekMax + (18 * (j + 1))
                        let mid1 = _this.weekMid + (18 * (j + 1))
                        if(max1 > _this.maxWeek) {
                            max1 = _this.maxWeek
                        }
                        if(j % 2 === 1) {
                            _this.weekHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 10
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.weekHtml += html
                            }
                        } else {
                            _this.weekHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 10
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.weekHtml1 += html
                            }
                        }
                    }
                }
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
                                    document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (_this.nowTransform2 + step * (time - 1) + degreeMinus) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (_this.nowTransform2 + step * time) + 'deg)'
                                    degreeMinus = degreeMinus - 0.2
                                    time++
                                }
                            }, 10)
                        } else {
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(yushu < step) {
                                    document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (_this.nowTransform2 - step * (time - 1) - yushu) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (_this.nowTransform2 - step * time) + 'deg)'
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
                                    document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (_this.nowTransform2 - step * (time - 1) + degreeMinus) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (_this.nowTransform2 - step * time) + 'deg)'
                                    degreeMinus = degreeMinus - 0.2
                                    time++
                                }
                            }, 10)
                        } else {
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(yushu < step) {
                                    document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (_this.nowTransform2 + step * (time - 1) - yushu) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (_this.nowTransform2 + step * time) + 'deg)'
                                    yushu = yushu - 0.2
                                    time++
                                }
                            }, 10)
                        }
                    }
                }
                let scaleDegree = document.getElementsByClassName('scaleDiv1')[0].style.transform
                scaleDegree = scaleDegree.substr(7, scaleDegree.length - 4)
                scaleDegree = parseFloat(scaleDegree)
                let numberMinus = scaleDegree / 10
                numberMinus = Math.round(numberMinus)
                _this.week = _this.weekMid - numberMinus
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
                if(_this.nowTransform3 > 22) {
                    _this.nowTransform3 = 22
                }
                if(_this.nowTransform3 < -22) {
                    _this.nowTransform3 = -22
                }
                let playSound_number = ((_this.nowTransform3 - _this.lastPlayDegree3) / 22)
                if(playSound_number < 0) {
                    playSound_number = -playSound_number
                }
                if(playSound_number > 0.5 && playSound_number < 1) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                   // window.xy.vibrate('30');
                    window.xy.playSound()
                    if(_this.nowTransform3 - _this.lastPlayDegree3 < 0) {
                        _this.lastPlayDegree3 = _this.lastPlayDegree3 - 1 * 22
                    } else {
                        _this.lastPlayDegree3 = _this.lastPlayDegree3 + 1 * 22
                    }
                }
                for(let i = 1; i <= playSound_number; i++) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                    //window.xy.vibrate('30');
                    window.xy.playSound()
                    if(i + 1 > playSound_number) {
                        if(_this.nowTransform3 - _this.lastPlayDegree3 < 0) {
                            _this.lastPlayDegree3 = _this.lastPlayDegree3 - i * 22
                        } else {
                            _this.lastPlayDegree3 = _this.lastPlayDegree3 + i * 22
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
                //判断旋转角度是否是22的倍数，如果不是，则回弹到最近的22的倍数
                if(_this.nowTransform3 % 22 !== 0) {
                    let yushu = _this.nowTransform3 % 22
                    if(yushu > 0) {
                        //如果超过22的一半，则补全另一半，否则，回弹超出的部分
                        if(yushu > 22 / 2) {
                            let degreeMinus = 22 - yushu
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
                        if(yushu > 22 / 2) {
                            let degreeMinus = 22 - yushu
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
                let scaleMinus = scaleDegree - _this.startTransform3
                let numberMinus = scaleMinus / 22
                numberMinus = Math.round(numberMinus)
                _this.type = _this.type - numberMinus
            },
            addWeightScaleEventListen() {
                //移动端设备的屏幕宽度
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let startX = 0
                let startY = 0
                let endX = 0
                let endY = 0
                let scaleObj = document.getElementsByClassName('yearSelector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let degreeStart = 0
                //获取旋转基点
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let startTransform
                let nowTransform
                let _this = this
                let lastPlayDegree = 0
                //旋转方向
                let direction
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

                    startTransform = document.getElementsByClassName('scaleDiv')[0].style.transform
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
                    if(degreeMinus > 0) {
                        direction = 'shunshizhen'
                    } else {
                        direction = 'nishizhen'
                    }
                    degreeMinus = degreeMinus * 3
                    // console.log('转动了：' + degreeMinus)
                    nowTransform = startTransform + degreeMinus
                    let playSound_number = ((nowTransform - lastPlayDegree) / 9)
                    if(playSound_number < 0) {
                        playSound_number = -playSound_number
                    }
                    if(playSound_number > 0.5 && playSound_number < 1) {
                        console.log('播放')
                        //window.plugins.NativeAudio.stop('rotateMusic');
                        //window.xy.vibrate('30');
                        window.xy.playSound()
                        if(nowTransform - lastPlayDegree < 0) {
                            lastPlayDegree = lastPlayDegree - 1 * 9
                        } else {
                            lastPlayDegree = lastPlayDegree + 1 * 9
                        }
                    }
                    for(let i = 1; i <= playSound_number; i++) {
                        console.log('播放')
                        //window.plugins.NativeAudio.stop('rotateMusic');


                       // window.xy.vibrate('30');
                        window.xy.playSound()
                        if(i + 1 > playSound_number) {
                            if(nowTransform - lastPlayDegree < 0) {
                                lastPlayDegree = lastPlayDegree - i * 9
                            } else {
                                lastPlayDegree = lastPlayDegree + i * 9
                            }
                        }
                    }
                    //100数值为旋转900度，当旋转900度后，不能再旋转
                    if(nowTransform >= (_this.mid - _this.minWeight) * 9) {
                        nowTransform = (_this.mid - _this.minWeight) * 9
                    }
                    //200数值为旋转562.5度，当旋转562.5度后，不能再旋转
                    if(nowTransform <= -(_this.maxWeight - _this.mid) * 9) {
                        nowTransform = -(_this.maxWeight - _this.mid) * 9
                    }
                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + nowTransform + 'deg)'
                    for(let j = 0;j < 9; j++) {
                        if(nowTransform < -180 * j + 20 && nowTransform > -180 * j) {
                            let min1 = _this.min + (20 * (j - 1))
                            let max1 = _this.max + (20 * (j - 1))
                            let mid1 = _this.mid + (20 * (j - 1))
                            if(min1 < _this.minWeight) {
                                min1 = _this.minWeight - 1
                            }
                            if(max1 > _this.maxWeight) {
                                max1 = _this.maxWeight
                            }
                            if(j % 2 === 1) {
                                _this.selectorHtml = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 9
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.selectorHtml += html
                                }
                            } else {
                                _this.selectorHtml1 = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 9
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.selectorHtml1 += html
                                }
                            }
                        }
                        if(nowTransform < -180 * j && nowTransform > (-180 * j - 20)) {
                            let min1 = _this.min + (20 * (j + 1))
                            let max1 = _this.max + (20 * (j + 1))
                            let mid1 = _this.mid + (20 * (j + 1))
                            if(min1 < _this.minWeight) {
                                min1 = _this.minWeight - 1
                            }
                            if(max1 > _this.maxWeight) {
                                max1 = _this.maxWeight
                            }
                            if(j % 2 === 1) {
                                _this.selectorHtml = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 9
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.selectorHtml += html
                                }
                            } else {
                                _this.selectorHtml1 = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 9
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.selectorHtml1 += html
                                }
                            }
                        }
                        if(nowTransform > 180 * j - 20 && nowTransform < 180 * j) {
                            let min1 = _this.min - (20 * (j - 1))
                            let max1 = _this.max - (20 * (j - 1))
                            let mid1 = _this.mid - (20 * (j - 1))
                            if(min1 < _this.minWeight) {
                                min1 = _this.minWeight - 1
                            }
                            if(max1 > _this.maxWeight) {
                                max1 = _this.maxWeight
                            }
                            if(j % 2 === 1) {
                                _this.selectorHtml = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 9
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.selectorHtml += html
                                }
                            } else {
                                _this.selectorHtml1 = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 9
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.selectorHtml1 += html
                                }
                            }
                        } else if(nowTransform > 180 * j && nowTransform < 180 * j + 20) {
                            let min1 = _this.min - (20 * (j + 1))
                            let max1 = _this.max - (20 * (j + 1))
                            let mid1 = _this.mid - (20 * (j + 1))
                            if(min1 < _this.minWeight) {
                                min1 = _this.minWeight -1
                            }
                            if(max1 > _this.maxWeight) {
                                max1 = _this.maxWeight
                            }
                            if(j % 2 === 1) {
                                _this.selectorHtml = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 9
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.selectorHtml += html
                                }
                            } else {
                                _this.selectorHtml1 = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 9
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.selectorHtml1 += html
                                }
                            }
                        }
                    }
                })
                scaleObj.addEventListener('touchend', function(event) {
                    if(_this._timer > 0) {
                        event.preventDefault()
                        return
                    }
                    //判断旋转角度是否是9的倍数，如果不是，则回弹到最近的9的倍数
                    if(nowTransform % 9 !== 0) {
                        let yushu = nowTransform % 9
                        if(yushu > 0) {
                            //如果超过9的一半，则补全另一半，否则，回弹超出的部分
                            if(yushu > 9 / 2) {
                                let degreeMinus = 9 - yushu
                                let time = 1
                                _this._timer = setInterval(function() {
                                    let step = 0.2
                                    if(degreeMinus < step) {
                                        document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) + degreeMinus) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                                        degreeMinus = degreeMinus - 0.2
                                        time++
                                    }
                                }, 10)
                            } else {
                                let time = 1
                                _this._timer = setInterval(function() {
                                    let step = 0.2
                                    if(yushu < step) {
                                        document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) - yushu) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
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
                                        document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) + degreeMinus) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
                                        degreeMinus = degreeMinus - 0.2
                                        time++
                                    }
                                }, 10)
                            } else {
                                let time = 1
                                _this._timer = setInterval(function() {
                                    let step = 0.2
                                    if(yushu < step) {
                                        document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) - yushu) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
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
                    _this.goalHeight = _this.mid - numberMinus
                    // let scaleMinus = scaleDegree - startTransform
                    // let numberMinus = scaleMinus / 9
                    // numberMinus = Math.round(numberMinus)
                    // _this.goalHeight = _this.goalHeight - numberMinus
                })
            },
            addWeekScaleEventListen() {
                //移动端设备的屏幕宽度
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let startX = 0
                let startY = 0
                let endX = 0
                let endY = 0
                let scaleObj = document.getElementsByClassName('monthSelector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let degreeStart = 0
                //获取旋转基点
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let startTransform
                let nowTransform
                let _this = this
                let lastPlayDegree = 0
                //旋转方向
                let direction
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

                    startTransform = document.getElementsByClassName('scaleDiv1')[0].style.transform
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
                    if(degreeMinus > 0) {
                        direction = 'shunshizhen'
                    } else {
                        direction = 'nishizhen'
                    }
                    degreeMinus = degreeMinus * 2
                    // console.log('转动了：' + degreeMinus)
                    nowTransform = startTransform + degreeMinus
                    let playSound_number = ((nowTransform - lastPlayDegree) / 10)
                    if(playSound_number < 0) {
                        playSound_number = -playSound_number
                    }
                    if(playSound_number > 0.5 && playSound_number < 1) {
                        console.log('播放')
                        //window.plugins.NativeAudio.stop('rotateMusic');
                        //window.xy.vibrate('30');
                        window.xy.playSound()
                        if(nowTransform - lastPlayDegree < 0) {
                            lastPlayDegree = lastPlayDegree - 1 * 10
                        } else {
                            lastPlayDegree = lastPlayDegree + 1 * 10
                        }
                    }
                    for(let i = 1; i <= playSound_number; i++) {
                        console.log('播放')
                        //window.plugins.NativeAudio.stop('rotateMusic');
                       // window.xy.vibrate('30');
                        window.xy.playSound()
                        if(i + 1 > playSound_number) {
                            if(nowTransform - lastPlayDegree < 0) {
                                lastPlayDegree = lastPlayDegree - i * 10
                            } else {
                                lastPlayDegree = lastPlayDegree + i * 10
                            }
                        }
                    }
                    //100数值为旋转900度，当旋转900度后，不能再旋转
                    let minScale = (_this.weekMid - _this.weekMin) * 10
                    if(nowTransform >= minScale) {
                        nowTransform = minScale
                    }
                    let maxScale = (_this.maxWeek - _this.weekMid) * 10
                    //200数值为旋转562.5度，当旋转562.5度后，不能再旋转
                    if(nowTransform <= -maxScale) {
                        nowTransform = -maxScale
                    }
                    document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + nowTransform + 'deg)'
                    //通过判断比180整数倍多出或者少出一点，来判断旋转方向
                    if(nowTransform > 0 && nowTransform < 20) {
                        _this.weekHtml1 = ''
                    }
                    if(nowTransform < 0 && nowTransform > -40) {
                        let min1 = _this.weekMin + (18 * 1)
                        let max1 = _this.weekMax + (18 * 1)
                        let mid1 = _this.weekMid + (18 * 1)
                        if(max1 > _this.maxWeek) {
                            max1 = _this.maxWeek
                        }
                        _this.weekHtml1 = ''
                        for(let i = min1 + 1; i <= max1; i++) {
                            let degree = (i - mid1) * 10
                            let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                            html = html + '>' + i + '</div>'
                            _this.weekHtml1 += html
                        }
                    }
                    for(let j = 1;j < 94; j++) {
                        if(nowTransform < -180 * j + 20 && nowTransform > -180 * j) {
                            let min1 = _this.weekMin + (18 * (j - 1))
                            let max1 = _this.weekMax + (18 * (j - 1))
                            let mid1 = _this.weekMid + (18 * (j - 1))
                            if(min1 > _this.maxWeek) {
                                min1 = _this.maxWeek
                                mid1 = _this.maxWeek
                            }
                            if(max1 > _this.maxWeek) {
                                max1 = _this.maxWeek
                            }
                            if(j % 2 === 1) {
                                _this.weekHtml = ''
                                if(j === 1) {
                                    for(let i = min1; i <= max1; i++) {
                                        let degree = (i - mid1) * 10
                                        let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                        html = html + '>' + i + '</div>'
                                        _this.weekHtml += html
                                    }
                                } else {
                                    for(let i = min1 + 1; i <= max1; i++) {
                                        let degree = (i - mid1) * 10
                                        let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                        html = html + '>' + i + '</div>'
                                        _this.weekHtml += html
                                    }
                                }
                            } else {
                                _this.weekHtml1 = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 10
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.weekHtml1 += html
                                }
                            }
                        }
                        if(nowTransform < -180 * j && nowTransform > (-180 * j - 20)) {
                            let min1 = _this.weekMin + (18 * (j + 1))
                            let max1 = _this.weekMax + (18 * (j + 1))
                            let mid1 = _this.weekMid + (18 * (j + 1))
                            if(max1 > _this.maxWeek) {
                                max1 = _this.maxWeek
                            }
                            if(j % 2 === 1) {
                                _this.weekHtml = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 10
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.weekHtml += html
                                }
                            } else {
                                _this.weekHtml1 = ''
                                for(let i = min1 + 1; i <= max1; i++) {
                                    let degree = (i - mid1) * 10
                                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                    html = html + '>' + i + '</div>'
                                    _this.weekHtml1 += html
                                }
                            }
                        }
                    }
                })
                scaleObj.addEventListener('touchend', function(event) {
                    if(_this._timer > 0) {
                        event.preventDefault()
                        return
                    }
                    //判断旋转角度是否是9的倍数，如果不是，则回弹到最近的9的倍数
                    if(nowTransform % 10 !== 0) {
                        let yushu = nowTransform % 10
                        if(yushu > 0) {
                            //如果超过10的一半，则补全另一半，否则，回弹超出的部分
                            if(yushu > 10 / 2) {
                                let degreeMinus = 10 - yushu
                                let time = 1
                                _this._timer = setInterval(function() {
                                    let step = 0.2
                                    if(degreeMinus < step) {
                                        document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) + degreeMinus) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                                        degreeMinus = degreeMinus - 0.2
                                        time++
                                    }
                                }, 10)
                            } else {
                                let time = 1
                                _this._timer = setInterval(function() {
                                    let step = 0.2
                                    if(yushu < step) {
                                        document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) - yushu) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
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
                                        document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) + degreeMinus) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
                                        degreeMinus = degreeMinus - 0.2
                                        time++
                                    }
                                }, 10)
                            } else {
                                let time = 1
                                _this._timer = setInterval(function() {
                                    let step = 0.2
                                    if(yushu < step) {
                                        document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) - yushu) + 'deg)'
                                        clearInterval(_this._timer)
                                        _this._timer = 0
                                    } else {
                                        document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                                        yushu = yushu - 0.2
                                        time++
                                    }
                                }, 10)
                            }
                        }
                    }
                    let scaleDegree = document.getElementsByClassName('scaleDiv1')[0].style.transform
                    scaleDegree = scaleDegree.substr(7, scaleDegree.length - 4)
                    scaleDegree = parseFloat(scaleDegree)
                    let numberMinus = scaleDegree / 10
                    numberMinus = Math.round(numberMinus)
                    _this.week = _this.weekMid - numberMinus
                    // let scaleMinus = scaleDegree - startTransform
                    // let numberMinus = scaleMinus / 10
                    // numberMinus = Math.round(numberMinus)
                    // _this.week = _this.week - numberMinus
                })
            },
            addTypeScaleEventListen() {
                // //移动端设备的屏幕宽度
                // let clientWidth = document.documentElement.clientWidth;
                // let clientHeight = document.documentElement.clientHeight;
                // let startX = 0
                // let startY = 0
                // let endX = 0
                // let endY = 0
                // let scaleObj = document.getElementsByClassName('daySelector')[0]
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
                //     startTransform = document.getElementsByClassName('dayClock')[0].style.transform
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
                //     degreeMinus = degreeMinus * 1.5
                //     //console.log('转动了：' + degreeMinus)
                //     nowTransform = startTransform + degreeMinus
                //     let playSound_number = ((nowTransform - lastPlayDegree) / 22.5)
                //     if(playSound_number < 0) {
                //         playSound_number = -playSound_number
                //     }
                //     if(playSound_number > 0.5 && playSound_number < 1) {
                //         console.log('播放')
                //         //window.plugins.NativeAudio.stop('rotateMusic');
                //         window.plugins.NativeAudio.play('rotateMusic');
                //         if(nowTransform - lastPlayDegree < 0) {
                //             lastPlayDegree = lastPlayDegree - 1 * 22.5
                //         } else {
                //             lastPlayDegree = lastPlayDegree + 1 * 22.5
                //         }
                //     }
                //     for(let i = 1; i <= playSound_number; i++) {
                //         console.log('播放')
                //         //window.plugins.NativeAudio.stop('rotateMusic');
                //         window.plugins.NativeAudio.play('rotateMusic');
                //         if(i + 1 > playSound_number) {
                //             if(nowTransform - lastPlayDegree < 0) {
                //                 lastPlayDegree = lastPlayDegree - i * 22.5
                //             } else {
                //                 lastPlayDegree = lastPlayDegree + i * 22.5
                //             }
                //         }
                //     }
                //     if(nowTransform > 22) {
                //         nowTransform = 22
                //     }
                //     if(nowTransform < -22) {
                //         nowTransform = -22
                //     }
                //     document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + nowTransform + 'deg)'
                // })
                // scaleObj.addEventListener('touchend', function(event) {
                //     if(_this._timer > 0) {
                //         event.preventDefault()
                //         return
                //     }
                //     //判断旋转角度是否是22的倍数，如果不是，则回弹到最近的22的倍数
                //     if(nowTransform % 22 !== 0) {
                //         let yushu = nowTransform % 22
                //         if(yushu > 0) {
                //             //如果超过22的一半，则补全另一半，否则，回弹超出的部分
                //             if(yushu > 22 / 2) {
                //                 let degreeMinus = 22 - yushu
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(degreeMinus < step) {
                //                         document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) + degreeMinus) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                //                         degreeMinus = degreeMinus - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             } else {
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(yushu < step) {
                //                         document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) - yushu) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
                //                         yushu = yushu - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             }
                //         } else {
                //             yushu = -yushu
                //             if(yushu > 22 / 2) {
                //                 let degreeMinus = 22 - yushu
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(degreeMinus < step) {
                //                         document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) + degreeMinus) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
                //                         degreeMinus = degreeMinus - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             } else {
                //                 let time = 1
                //                 _this._timer = setInterval(function() {
                //                     let step = 0.2
                //                     if(yushu < step) {
                //                         document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) - yushu) + 'deg)'
                //                         clearInterval(_this._timer)
                //                         _this._timer = 0
                //                     } else {
                //                         document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
                //                         yushu = yushu - 0.2
                //                         time++
                //                     }
                //                 }, 10)
                //             }
                //         }
                //     }
                //     let scaleDegree = document.getElementsByClassName('dayClock')[0].style.transform
                //     scaleDegree = scaleDegree.substr(7, scaleDegree.length - 4)
                //     scaleDegree = parseFloat(scaleDegree)
                //     let scaleMinus = scaleDegree - startTransform
                //     let numberMinus = scaleMinus / 22
                //     numberMinus = Math.round(numberMinus)
                //     _this.type = _this.type - numberMinus
                // })
            },
            initGoalHeightSelector() {
                //上半部分表盘
                let min = this.min
                let mid = this.mid
                let max = this.max
                if(max > this.maxWeight) {
                    max = this.maxWeight
                }
                if(min < this.minWeight) {
                    min = this.minWeight - 1
                }
                //每个旋转11.25度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.25度，小于的话就相反
                for(let i = min + 1; i <= max; i++) {
                    let degree = (i - mid) * 9
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '</div>'
                    this.selectorHtml += html
                }
                let _this = this
                this.$nextTick(function() {
                    //_this.addWeightScaleEventListen()
                })
            },
            //初始化月份表盘
            initWeekSelector() {
                let max = this.weekMax
                let min = this.weekMin
                let mid = this.weekMid
                //每个旋转11.36度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.36度，小于的话就相反
                this.weekHtml = ''
                for(let i = min; i <= max; i++) {
                    let degree = (i - mid) * 10
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '</div>'
                    this.weekHtml += html
                }
                this.week = mid
                let _this = this
                //下半部分表盘
                min = min + 18
                max = max + 18
                mid = mid + 18
                this.weekHtml1 = ''
                for(let i = min; i <= max - 1; i++) {
                    let degree = (i - mid) * 9
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '</div>'
                    this.weekHtml1 += html
                }
                this.$nextTick(function() {
                    //_this.addWeekScaleEventListen()
                })
            },
            //初始化天数表盘
            initTypeSelecor() {
                let min = 1
                let max = 3
                let mid = 2
                //每个旋转11.36度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.36度，小于的话就相反
                for(let i = min; i <= max; i++) {
                    let degree = (i - mid) * 22
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + this.typeList[i] + '</div>'
                    this.dayHtml += html
                }
                let _this = this
                _this.type = 1
                document.getElementsByClassName('dayClock')[0].style.transform = 'rotate(22deg)'
                this.$nextTick(function() {
                    //_this.addTypeScaleEventListen()
                })
            },
            //刷新体重数据表盘
            refreshGoalWeight() {
                let max = this.max
                let min = this.min
                let mid = this.mid
                if(max > this.maxWeight) {
                    max = this.maxWeight
                }
                if(min <= this.minWeight) {
                    min = this.minWeight - 1
                }
                //每个旋转11.36度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.36度，小于的话就相反
                this.selectorHtml = ''
                for(let i = min + 1; i <= max; i++) {
                    let degree = (i - mid) * 9
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '</div>'
                    this.selectorHtml += html
                }
                let _this = this
                document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(0deg)'
            },
            //刷新周数表盘
            refreshWeek() {
                let max = this.weekMax
                let min = this.weekMin
                let mid = this.weekMid
                //每个旋转11.36度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.36度，小于的话就相反
                this.weekHtml = ''
                for(let i = min; i <= max; i++) {
                    let degree = (i - mid) * 10
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '</div>'
                    this.weekHtml += html
                }
                this.week = mid
                let _this = this
                //下半部分表盘
                min = min + 18
                max = max + 18
                mid = mid + 18
                this.weekHtml1 = ''
                for(let i = min; i <= max - 1; i++) {
                    let degree = (i - mid) * 10
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '</div>'
                    this.weekHtml1 += html
                }
                document.getElementsByClassName('scaleDiv1')[0].style.transform = 'rotate(0deg)'
                // this.degreeStart2 = 0
                // this.startX2 = 0
                // this.startY2 = 0
                // this.endX2 = 0
                // this.endY2 = 0
                // this.scaleX2 = 0
                // this.scaleY2 = 0
                // this.startTransform2 = 0
                // this.nowTransform2 = 0
                // this.lastPlayDegree2 = 0
            },
            routeTo(path) {
                clearInterval(this._timer)
                //塑型
                if(this.type === '2' || this.type === 2) {
                    localStorage.setItem('myType', this.type)
                    localStorage.setItem('myWeek', 1)
                } else {
                    localStorage.setItem('myType', this.type)
                    localStorage.setItem('myGoalWeight', this.goalHeight)
                    localStorage.setItem('myWeek', this.week)
                }
                //接口调用
                let obj={};
                obj.currentWeight=localStorage.myWeight;
                obj.target=localStorage.myType;
                obj.targetWeekNum=localStorage.myWeek;
                obj.targetWeight=localStorage.myGoalWeight;
                api.targetSetting(obj).then(res=>{
                    if(res.code=='2000'){
                        clearInterval(this._timer);
                        for(let i=0;i<20000;i++){
                            clearInterval(i);
                        }
                        this.$toast.success('设置成功');
                        if (this.$route.query.from && this.$route.query.from != "undefined") {
                            window.xy.gototab('0',
                                function (res) {

                                },function (error) {
                                    alert('error');
                                }
                            )
                        }else{
                            this.$router.push({path: path})
                        }

                    }else{
                        this.$toast.fail(res.msg);
                    }

                }).catch(err=>{
                    this.$toast.fail('设置失败');
                })
                //this.$router.push({path: path})

            },
            routeTouch(event) {
                event.stopPropagation()
            },
            routeTouchEnd(event) {
                event.stopPropagation()
            },
            back() {
                if(location.href.indexOf('from=advise') >= 0) {
                    let url=location.origin+location.pathname+"#/advise";
                    //window.xy.openWindow(url)
                    window.xy.gototab('0',
                        function (res) {

                        },function (error) {
                            alert('error');
                        }
                    )
                    return
                }
                if(location.href.indexOf('from=target') >= 0) {
                    let url=location.origin+location.pathname+"#/target";
                    //window.xy.openWindow(url)
                    window.xy.gototab('0',
                        function (res) {

                        },function (error) {
                            alert('error');
                        }
                    )
                    return
                }
                this.$router.push({path: '/weight'})
            }
        },
        watch: {
            //监听type字段
            type(value) {
                //减重
                if(value === 1) {
                    this.mid = this.nowWeight
                    this.max = this.mid + 10
                    this.min = this.mid - 10
                    this.goalHeight = this.mid
                    this.maxWeight = this.nowWeight
                    this.minWeight = Math.ceil(this.nowWeight / 2)
                    this.weekMax = (this.nowWeight - this.goalHeight) / 0.1
                    this.weekMin = this.weekMax / 10
                    this.weekMin = Math.ceil(this.weekMin)
                    this.weekMax = Math.ceil(this.weekMax)
                    if(this.weekMax - this.weekMin > 18) {
                        this.maxWeek = this.weekMax
                        this.weekMid = this.weekMin + 9
                        this.weekMax = this.weekMin + 18
                    } else {
                        this.maxWeek = this.weekMax
                        this.weekMid = Math.ceil(this.weekMin + (this.weekMax - this.weekMin) / 2)
                    }
                    this.week = this.weekMid
                }
                //增重
                if(value === 3) {
                    // if(this.nowWeight < 180) {
                    //     this.min = this.nowWeight + 1
                    //     this.mid = this.min + 10
                    //     this.max = this.min + 20
                    // } else {
                    //     this.min = this.nowWeight + 1
                    //     if(this.min > 200) {
                    //         this.min = 200
                    //     }
                    //     this.max = 200
                    //     this.mid = Math.ceil(this.min + (this.max - this.min) / 2)
                    // }
                    this.mid = this.min = this.minWeight = this.goalHeight = parseInt(localStorage.myWeight)
                    if(this.goalHeight > 200) {
                        this.goalHeight = 200
                    }
                    this.maxWeight = 200
                    this.weekMax = (this.goalHeight - this.nowWeight) / 0.1
                    this.weekMin = this.weekMax / 2.5
                    this.weekMin = Math.ceil(this.weekMin)
                    this.weekMax = Math.ceil(this.weekMax)
                    if(this.weekMax - this.weekMin > 18) {
                        this.maxWeek = this.weekMax
                        this.weekMid = this.weekMin + 9
                        this.weekMax = this.weekMin + 18
                    } else {
                        this.maxWeek = this.weekMax
                        this.weekMid = Math.ceil(this.weekMin + (this.weekMax - this.weekMin) / 2)
                    }
                    this.week = this.weekMid
                }
                this.refreshGoalWeight()
                this.refreshWeek()
            },
            goalHeight(value) {
                if(this.type === 1) {
                    this.weekMax = (this.nowWeight - this.goalHeight) / 0.1
                    this.weekMin = this.weekMax / 10
                    this.weekMin = Math.ceil(this.weekMin)
                    this.weekMax = Math.ceil(this.weekMax)
                    if(this.weekMax - this.weekMin > 18) {
                        this.maxWeek = this.weekMax
                        this.weekMid = this.weekMin + 9
                        this.weekMax = this.weekMin + 18
                    } else {
                        this.maxWeek = this.weekMax
                        this.weekMid = Math.ceil(this.weekMin + (this.weekMax - this.weekMin) / 2)
                    }
                    this.week = this.weekMid
                }
                //增重
                if(this.type === 3) {
                    this.weekMax = (this.goalHeight - this.nowWeight) / 0.1
                    this.weekMin = this.weekMax / 2.5
                    this.weekMin = Math.ceil(this.weekMin)
                    this.weekMax = Math.ceil(this.weekMax)
                    if(this.weekMax - this.weekMin > 18) {
                        this.maxWeek = this.weekMax
                        this.weekMid = this.weekMin + 9
                        this.weekMax = this.weekMin + 18
                    } else {
                        this.maxWeek = this.weekMax
                        this.weekMid = Math.ceil(this.weekMin + (this.weekMax - this.weekMin) / 2)
                    }
                    this.week = this.weekMid
                }
                this.refreshWeek()
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .goalWeight[type="1"] {
    background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
  }
  .goalWeight[type="0"] {
    background-image: linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
  }
  .goalWeight{
    overflow: hidden;background: url("../assets/img/bj-2.png") no-repeat center center; background-size: 100% 100%;
    height: 100%;width: 100%;
    .back{
        position: absolute;
        left: 0.8rem;
        top: 1.2rem;
        transform: rotate(90deg);
        width: 0.35rem;
    }
    .questions{
      text-align: center;position: absolute;top: 16%;left: 50%;transform: translate(-50%, 0);width: 100%;
      .question{
        font-size: 0.64rem;color: #fff;font-family: 'PingFang Medium';
      }
      .answer{
        font-size: 0.45rem;color: #fff;margin-top: 0.6rem;
      }
    }
    .questions2{
      top: 34%;
      .answer1{
        margin-top: 1rem;
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
      .scaleDiv, .scaleDiv1{
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
  .goalWeight{
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
      top: 0rem;z-index: 10;width: 21.3rem!important;height: 21.3rem!important;margin-left: -10.65rem!important;
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
        width: 2rem;height: 12.8rem;padding-top: 0.5rem;margin-left: -1rem!important;
      }
      .leftOverLay{
        width: 4.8rem;height: 13.3rem;border-top-left-radius: 13.3rem;border-bottom-left-radius: 13.3rem;top: 0.5rem;
      }
      .rightOverLay{
        width: 4.8rem;height: 13.3rem;border-top-right-radius: 13.3rem;border-bottom-right-radius: 13.3rem;top: 0.5rem;
      }
    }
  }
</style>
