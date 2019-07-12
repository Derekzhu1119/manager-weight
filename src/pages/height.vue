<template>
  <div class="height" :type="sex">
    <img src="../assets/images/i4.png" alt="" @click="back()" class="back" v-show="showBack">
    <p class="titleEn">Balance</p>
    <p class="title">欢迎来到体重管家</p>
    <div class="avatar">
      <div class="flex" @click="selectSex(0)">
        <img src="../assets/img/female.png"/>
        <img src="../assets/img/line1.png" class="lineImg" v-show="sex === '0' || sex === 0"/>
        <img src="../assets/img/line2.png" class="lineImg" v-show="sex === '0' || sex === 0"/>
        <img src="../assets/img/line3.png" class="lineImg" v-show="sex === '0' || sex === 0"/>
      </div>
      <div class="flex" @click="selectSex(1)">
        <img src="../assets/img/male.png"/>
        <img src="../assets/img/line1.png" class="lineImg" v-show="sex === '1' || sex === 1"/>
        <img src="../assets/img/line2.png" class="lineImg" v-show="sex === '1' || sex === 1"/>
        <img src="../assets/img/line3.png" class="lineImg" v-show="sex === '1' || sex === 1"/>
      </div>
    </div>
    <div class="sex">
      <img src="../assets/img/nan.png" v-show="sex === '1' || sex === 1"/>
        <img src="../assets/img/nv.png" v-show="sex === '0' || sex === 0"/>
    </div>
    <div class="questions">
      <p class="question">你的身高</p>
      <p class="answer">{{nowHeight}}cm</p>
    </div>
    <div class="container">
      <div class="selector" :type="sex" @touchstart="scaleStart" @touchmove="scaleMove" @touchend="scaleEnd">
        <div class="leftOverLay"></div>
        <div class="rightOverLay"></div>
        <div class="btn" @click="routeTo('/birth', $event)" @touchmove="routeTouch" @touchend="routeTouchEnd">
            <i class="iconfont icon-queding" style="font-size: 24px;"></i>
          <!--<img src="../assets/img/btn-img.png" v-show="sex === '1' || sex === 1"/>-->
          <!--<img src="../assets/img/btn-img-red.png" v-show="sex === '0' || sex === 0"/>-->
        </div>
        <div class="scaleDiv" style="transform: rotate(0deg)">
          <div class="clock"  style="transform: rotate(0deg)" v-html="selectorHtml"></div>
          <div class="clock clock1"  style="transform: rotate(180deg)" v-html="selectorHtml1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "height",
        data() {
            return {
                selectorHtml: '',
                selectorHtml1: '',
                nowHeight: 160,
                clockRange: [{
                }],
                clock1Range: [{

                }],
                min: 152,
                mid: 160,
                max: 168,
                sex: localStorage.selectSex ? localStorage.selectSex : '1',
                _timer: 0,
                degreeStart: 0,
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0,
                scaleX: 0,
                scaleY: 0,
                startTransform: 0,
                nowTransform: 0,
                lastPlayDegree: 0,
                showBack: false
            }
        },
        created() {
            if(this.$route.query.token && typeof this.$route.query.token !='undefined' && this.$route.query.token!=null){
                localStorage.setItem('token',this.$route.query.token)
            }
          //判断是否是从personal页面跳转过来
            if(location.href.indexOf('from=personal') >= 0) {
                this.showBack = true
            }
        },
        mounted () {
            let _this = this
            this.$nextTick(function() {
                _this.initHeightSelector()
            })
            $('body').addClass('nosafePadding');
            this.init();
        },
        methods: {
            init() {
                // 初始化之前有选择的高度数据
                if(localStorage.myHeight) {
                    this.nowHeight = parseInt(localStorage.myHeight)
                    this.mid = this.nowHeight
                    this.min = this.mid - 8
                    this.max = this.mid + 8
                }
                // 从app获取token
                //localStorage.clear();
                //设置测试token
                //localStorage.setItem('token','b23a2f076f094eb0b6e8ec98540827c2');
                var that=this;
                 window.xy.getLoginUserInfo(
                     function (res) {
                        // alert(res);
                         //that.$toast(JSON.stringify(res));
                         //that.$toast(res.token)
                        localStorage.setItem('token',res.token);

                    },function (error) {
                        alert('error');
                    }
                )
                if(localStorage.token==null || localStorage.token=='undefined' || typeof localStorage.token=='undefined'){
                    //that.$toast('no token')
                }
                //localStorage.setItem('myHeight', this.nowHeight)
            },
            scaleStart(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                let touch = event.targetTouches[0];
                //滑动起点的坐标
                this.startX = touch.pageX;
                this.startY = touch.pageY;
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let scaleObj = document.getElementsByClassName('selector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let dy = scaleY - this.startY
                let dx = this.startX - scaleX
                //与x正轴的夹角
                this.degreeStart = Math.atan2(dy,dx) * 180 / Math.PI;

                this.startTransform = document.getElementsByClassName('scaleDiv')[0].style.transform
                this.startTransform = this.startTransform.substr(7, this.startTransform.length - 4)
                this.startTransform = parseFloat(this.startTransform)
            },
            scaleMove(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                let touch = event.targetTouches[0];
                _this.endX = touch.pageX;
                _this.endY = touch.pageY;
                let clientWidth = document.documentElement.clientWidth;
                let clientHeight = document.documentElement.clientHeight;
                let scaleObj = document.getElementsByClassName('selector')[0]
                let scaleHeight = scaleObj.offsetHeight
                let scaleX = clientWidth / 2
                let scaleY = clientHeight + scaleHeight * 0.7
                let dy1 = scaleY - _this.endY
                let dx1 = _this.endX - scaleX
                //与x正轴的夹角
                let angle = Math.atan2(dy1,dx1) * 180 / Math.PI;
                if(angle < 0) {
                    angle = 360 + angle
                    angle = Math.ceil(angle)
                } else {
                    angle = Math.floor(angle)
                }
                let degreeMinus = (_this.degreeStart - angle)
                degreeMinus = degreeMinus * 2
                _this.nowTransform = _this.startTransform + degreeMinus
                //100数值为旋转900度，当旋转900度后，不能再旋转
                if(_this.nowTransform >= (_this.mid - 100) * 11.25) {
                    _this.nowTransform = (_this.mid - 100) * 11.25
                }
                //230数值为旋转562.5度，当旋转562.5度后，不能再旋转
                if(_this.nowTransform <= -(230 - _this.mid) * 11.25) {
                    _this.nowTransform = -(230 - _this.mid) * 11.25
                }
                let playSound_number = ((_this.nowTransform - _this.lastPlayDegree) / 11.25)
                if(playSound_number < 0) {
                    playSound_number = -playSound_number
                }
                if(playSound_number > 0.5 && playSound_number < 1) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                    //window.xy.vibrate('30');
                    window.xy.playSound()
                    if(_this.nowTransform - _this.lastPlayDegree < 0) {
                        _this.lastPlayDegree = _this.lastPlayDegree - 1 * 11.25
                    } else {
                        _this.lastPlayDegree = _this.lastPlayDegree + 1 * 11.25
                    }
                }
                for(let i = 1; i <= playSound_number; i++) {
                    console.log('播放')
                    //window.plugins.NativeAudio.stop('rotateMusic');
                   // window.xy.vibrate('30');
                    window.xy.playSound()
                    if(i + 1 > playSound_number) {
                        if(_this.nowTransform - _this.lastPlayDegree < 0) {
                            _this.lastPlayDegree = _this.lastPlayDegree - i * 11.25
                        } else {
                            _this.lastPlayDegree = _this.lastPlayDegree + i * 11.25
                        }
                    }
                }
                document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + _this.nowTransform + 'deg)'
                for(let j = 0;j < 9; j++) {
                    if(_this.nowTransform < -180 * j + 20 && _this.nowTransform > -180 * j) {
                        let min1 = _this.min + (16 * (j - 1))
                        let max1 = _this.max + (16 * (j - 1))
                        let mid1 = _this.mid + (16 * (j - 1))
                        if(min1 < 100) {
                            min1 = 100 - 1
                        }
                        if(max1 > 230) {
                            max1 = 230
                        }
                        if(j % 2 === 1) {
                            _this.selectorHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 11.25
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml += html
                            }
                        } else {
                            _this.selectorHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 11.25
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml1 += html
                            }
                        }
                    }
                    if(_this.nowTransform < -180 * j && _this.nowTransform > (-180 * j - 20)) {
                        let min1 = _this.min + (16 * (j + 1))
                        let max1 = _this.max + (16 * (j + 1))
                        let mid1 = _this.mid + (16 * (j + 1))
                        if(min1 < 100) {
                            min1 = 100 - 1
                        }
                        if(max1 > 230) {
                            max1 = 230
                        }
                        if(j % 2 === 1) {
                            _this.selectorHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 11.25
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml += html
                            }
                        } else {
                            _this.selectorHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 11.25
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml1 += html
                            }
                        }
                    }
                    if(_this.nowTransform > 180 * j - 20 && _this.nowTransform < 180 * j) {
                        let min1 = _this.min - (16 * (j - 1))
                        let max1 = _this.max - (16 * (j - 1))
                        let mid1 = _this.mid - (16 * (j - 1))
                        if(min1 < 100) {
                            min1 = 100 - 1
                        }
                        if(max1 > 230) {
                            max1 = 230
                        }
                        if(j % 2 === 1) {
                            _this.selectorHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 11.25
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml += html
                            }
                        } else {
                            _this.selectorHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 11.25
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml1 += html
                            }
                        }
                    } else if(_this.nowTransform > 180 * j && _this.nowTransform < 180 * j + 20) {
                        let min1 = _this.min - (16 * (j + 1))
                        let max1 = _this.max - (16 * (j + 1))
                        let mid1 = _this.mid - (16 * (j + 1))
                        if(min1 < 100) {
                            min1 = 100 -1
                        }
                        if(max1 > 230) {
                            max1 = 230
                        }
                        if(j % 2 === 1) {
                            _this.selectorHtml = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 11.25
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml += html
                            }
                        } else {
                            _this.selectorHtml1 = ''
                            for(let i = min1 + 1; i <= max1; i++) {
                                let degree = (i - mid1) * 11.25
                                let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                                html = html + '>' + i + '</div>'
                                _this.selectorHtml1 += html
                            }
                        }
                    }
                }
            },
            scaleEnd(event) {
                let _this = this
                if(_this._timer > 0) {
                    event.preventDefault()
                    return
                }
                //判断旋转角度是否是11.25的倍数，如果不是，则回弹到最近的11.25的倍数
                if(_this.nowTransform % 11.25 !== 0) {
                    let yushu = _this.nowTransform % 11.25
                    if(yushu > 0) {
                        //如果超过11.25的一半，则补全另一半，否则，回弹超出的部分
                        if(yushu > 11.25 / 2) {
                            let degreeMinus = 11.25 - yushu
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(degreeMinus < step) {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform + step * (time - 1) + degreeMinus) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform + step * time) + 'deg)'
                                    degreeMinus = degreeMinus - 0.2
                                    time++
                                }
                            }, 10)
                        } else {
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(yushu < step) {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform - step * (time - 1) - yushu) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform - step * time) + 'deg)'
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
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform - step * (time - 1) + degreeMinus) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform - step * time) + 'deg)'
                                    degreeMinus = degreeMinus - 0.2
                                    time++
                                }
                            }, 10)
                        } else {
                            let time = 1
                            _this._timer = setInterval(function() {
                                let step = 0.2
                                if(yushu < step) {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform + step * (time - 1) - yushu) + 'deg)'
                                    clearInterval(_this._timer)
                                    _this._timer = 0
                                } else {
                                    document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (_this.nowTransform + step * time) + 'deg)'
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
                let numberMinus = scaleDegree / 11.25
                numberMinus = Math.round(numberMinus)
                _this.nowHeight = _this.mid - numberMinus
            },
            // addScaleEventListen() {
            //     //移动端设备的屏幕宽度
            //     let clientWidth = document.documentElement.clientWidth;
            //     let clientHeight = document.documentElement.clientHeight;
            //     let startX = 0
            //     let startY = 0
            //     let endX = 0
            //     let endY = 0
            //     let scaleObj = document.getElementsByClassName('selector')[0]
            //     let scaleHeight = scaleObj.offsetHeight
            //     let degreeStart = 0
            //     //获取旋转基点
            //     let scaleX = clientWidth / 2
            //     let scaleY = clientHeight + scaleHeight * 0.7
            //     let startTransform
            //     let nowTransform
            //     let _this = this
            //     let lastPlayDegree = 0
            //     //旋转方向
            //     let direction
            //     scaleObj.addEventListener('touchstart', function(event) {
            //         if(_this._timer > 0) {
            //             event.preventDefault()
            //             return
            //         }
            //         let touch = event.targetTouches[0];
            //         //滑动起点的坐标
            //         startX = touch.pageX;
            //         startY = touch.pageY;
            //         let dy = scaleY - startY
            //         let dx = startX - scaleX
            //         //与x正轴的夹角
            //         degreeStart = Math.atan2(dy,dx) * 180 / Math.PI;
            //
            //         startTransform = document.getElementsByClassName('scaleDiv')[0].style.transform
            //         startTransform = startTransform.substr(7, startTransform.length - 4)
            //         startTransform = parseFloat(startTransform)
            //     })
            //     scaleObj.addEventListener('touchmove', function(event) {
            //         if(_this._timer > 0) {
            //             event.preventDefault()
            //             return
            //         }
            //         let touch = event.targetTouches[0];
            //         endX = touch.pageX;
            //         endY = touch.pageY;
            //         let dy1 = scaleY - endY
            //         let dx1 = endX - scaleX
            //         //与x正轴的夹角
            //         let angle = Math.atan2(dy1,dx1) * 180 / Math.PI;
            //         if(angle < 0) {
            //             angle = 360 + angle
            //             angle = Math.ceil(angle)
            //         } else {
            //             angle = Math.floor(angle)
            //         }
            //         let degreeMinus = (degreeStart - angle)
            //         if(degreeMinus > 0) {
            //             direction = 'shunshizhen'
            //         } else {
            //             direction = 'nishizhen'
            //         }
            //         degreeMinus = degreeMinus * 2
            //         nowTransform = startTransform + degreeMinus
            //         let playSound_number = ((nowTransform - lastPlayDegree) / 11.25)
            //         if(playSound_number < 0) {
            //             playSound_number = -playSound_number
            //         }
            //         if(playSound_number > 0.5 && playSound_number < 1) {
            //             console.log('播放')
            //             //window.plugins.NativeAudio.stop('rotateMusic');
            //             window.plugins.NativeAudio.play('rotateMusic');
            //             if(nowTransform - lastPlayDegree < 0) {
            //                 lastPlayDegree = lastPlayDegree - 1 * 11.25
            //             } else {
            //                 lastPlayDegree = lastPlayDegree + 1 * 11.25
            //             }
            //         }
            //         for(let i = 1; i <= playSound_number; i++) {
            //             console.log('播放')
            //             //window.plugins.NativeAudio.stop('rotateMusic');
            //             window.plugins.NativeAudio.play('rotateMusic');
            //             if(i + 1 > playSound_number) {
            //                 if(nowTransform - lastPlayDegree < 0) {
            //                     lastPlayDegree = lastPlayDegree - i * 11.25
            //                 } else {
            //                     lastPlayDegree = lastPlayDegree + i * 11.25
            //                 }
            //             }
            //         }
            //         //100数值为旋转900度，当旋转900度后，不能再旋转
            //         if(nowTransform >= (_this.mid - 100) * 11.25) {
            //             nowTransform = (_this.mid - 100) * 11.25
            //         }
            //         //230数值为旋转562.5度，当旋转562.5度后，不能再旋转
            //         if(nowTransform <= -(230 - _this.mid) * 11.25) {
            //             nowTransform = -(230 - _this.mid) * 11.25
            //         }
            //         document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + nowTransform + 'deg)'
            //         for(let j = 0;j < 9; j++) {
            //             if(nowTransform < -180 * j + 20 && nowTransform > -180 * j) {
            //                 let min1 = _this.min + (16 * (j - 1))
            //                 let max1 = _this.max + (16 * (j - 1))
            //                 let mid1 = _this.mid + (16 * (j - 1))
            //                 if(min1 < 100) {
            //                     min1 = 100 - 1
            //                 }
            //                 if(max1 > 230) {
            //                     max1 = 230
            //                 }
            //                 if(j % 2 === 1) {
            //                     _this.selectorHtml = ''
            //                     for(let i = min1 + 1; i <= max1; i++) {
            //                         let degree = (i - mid1) * 11.25
            //                         let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
            //                         html = html + '>' + i + '</div>'
            //                         _this.selectorHtml += html
            //                     }
            //                 } else {
            //                     _this.selectorHtml1 = ''
            //                     for(let i = min1 + 1; i <= max1; i++) {
            //                         let degree = (i - mid1) * 11.25
            //                         let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
            //                         html = html + '>' + i + '</div>'
            //                         _this.selectorHtml1 += html
            //                     }
            //                 }
            //             }
            //             if(nowTransform < -180 * j && nowTransform > (-180 * j - 20)) {
            //                 let min1 = _this.min + (16 * (j + 1))
            //                 let max1 = _this.max + (16 * (j + 1))
            //                 let mid1 = _this.mid + (16 * (j + 1))
            //                 if(min1 < 100) {
            //                     min1 = 100 - 1
            //                 }
            //                 if(max1 > 230) {
            //                     max1 = 230
            //                 }
            //                 if(j % 2 === 1) {
            //                     _this.selectorHtml = ''
            //                     for(let i = min1 + 1; i <= max1; i++) {
            //                         let degree = (i - mid1) * 11.25
            //                         let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
            //                         html = html + '>' + i + '</div>'
            //                         _this.selectorHtml += html
            //                     }
            //                 } else {
            //                     _this.selectorHtml1 = ''
            //                     for(let i = min1 + 1; i <= max1; i++) {
            //                         let degree = (i - mid1) * 11.25
            //                         let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
            //                         html = html + '>' + i + '</div>'
            //                         _this.selectorHtml1 += html
            //                     }
            //                 }
            //             }
            //             if(nowTransform > 180 * j - 20 && nowTransform < 180 * j) {
            //                 let min1 = _this.min - (16 * (j - 1))
            //                 let max1 = _this.max - (16 * (j - 1))
            //                 let mid1 = _this.mid - (16 * (j - 1))
            //                 if(min1 < 100) {
            //                     min1 = 100 - 1
            //                 }
            //                 if(max1 > 230) {
            //                     max1 = 230
            //                 }
            //                 if(j % 2 === 1) {
            //                     _this.selectorHtml = ''
            //                     for(let i = min1 + 1; i <= max1; i++) {
            //                         let degree = (i - mid1) * 11.25
            //                         let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
            //                         html = html + '>' + i + '</div>'
            //                         _this.selectorHtml += html
            //                     }
            //                 } else {
            //                     _this.selectorHtml1 = ''
            //                     for(let i = min1 + 1; i <= max1; i++) {
            //                         let degree = (i - mid1) * 11.25
            //                         let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
            //                         html = html + '>' + i + '</div>'
            //                         _this.selectorHtml1 += html
            //                     }
            //                 }
            //             } else if(nowTransform > 180 * j && nowTransform < 180 * j + 20) {
            //                 let min1 = _this.min - (16 * (j + 1))
            //                 let max1 = _this.max - (16 * (j + 1))
            //                 let mid1 = _this.mid - (16 * (j + 1))
            //                 if(min1 < 100) {
            //                     min1 = 100 -1
            //                 }
            //                 if(max1 > 230) {
            //                     max1 = 230
            //                 }
            //                 if(j % 2 === 1) {
            //                     _this.selectorHtml = ''
            //                     for(let i = min1 + 1; i <= max1; i++) {
            //                         let degree = (i - mid1) * 11.25
            //                         let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
            //                         html = html + '>' + i + '</div>'
            //                         _this.selectorHtml += html
            //                     }
            //                 } else {
            //                     _this.selectorHtml1 = ''
            //                     for(let i = min1 + 1; i <= max1; i++) {
            //                         let degree = (i - mid1) * 11.25
            //                         let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
            //                         html = html + '>' + i + '</div>'
            //                         _this.selectorHtml1 += html
            //                     }
            //                 }
            //             }
            //         }
            //     })
            //     scaleObj.addEventListener('touchend', function(event) {
            //         if(_this._timer > 0) {
            //             event.preventDefault()
            //             return
            //         }
            //         //判断旋转角度是否是11.25的倍数，如果不是，则回弹到最近的11.25的倍数
            //         if(nowTransform % 11.25 !== 0) {
            //             let yushu = nowTransform % 11.25
            //             if(yushu > 0) {
            //                 //如果超过11.25的一半，则补全另一半，否则，回弹超出的部分
            //                 if(yushu > 11.25 / 2) {
            //                     let degreeMinus = 11.25 - yushu
            //                     let time = 1
            //                     _this._timer = setInterval(function() {
            //                         let step = 0.2
            //                         if(degreeMinus < step) {
            //                             document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) + degreeMinus) + 'deg)'
            //                             clearInterval(_this._timer)
            //                             _this._timer = 0
            //                         } else {
            //                             document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
            //                             degreeMinus = degreeMinus - 0.2
            //                             time++
            //                         }
            //                     }, 10)
            //                 } else {
            //                     let time = 1
            //                     _this._timer = setInterval(function() {
            //                         let step = 0.2
            //                         if(yushu < step) {
            //                             document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) - yushu) + 'deg)'
            //                             clearInterval(_this._timer)
            //                             _this._timer = 0
            //                         } else {
            //                             document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
            //                             yushu = yushu - 0.2
            //                             time++
            //                         }
            //                     }, 10)
            //                 }
            //             } else {
            //                 yushu = -yushu
            //                 if(yushu > 11.25 / 2) {
            //                     let degreeMinus = 11.25 - yushu
            //                     let time = 1
            //                     _this._timer = setInterval(function() {
            //                         let step = 0.2
            //                         if(degreeMinus < step) {
            //                             document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * (time - 1) + degreeMinus) + 'deg)'
            //                             clearInterval(_this._timer)
            //                             _this._timer = 0
            //                         } else {
            //                             document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform - step * time) + 'deg)'
            //                             degreeMinus = degreeMinus - 0.2
            //                             time++
            //                         }
            //                     }, 10)
            //                 } else {
            //                     let time = 1
            //                     _this._timer = setInterval(function() {
            //                         let step = 0.2
            //                         if(yushu < step) {
            //                             document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * (time - 1) - yushu) + 'deg)'
            //                             clearInterval(_this._timer)
            //                             _this._timer = 0
            //                         } else {
            //                             document.getElementsByClassName('scaleDiv')[0].style.transform = 'rotate(' + (nowTransform + step * time) + 'deg)'
            //                             yushu = yushu - 0.2
            //                             time++
            //                         }
            //                     }, 10)
            //                 }
            //             }
            //         }
            //         let scaleDegree = document.getElementsByClassName('scaleDiv')[0].style.transform
            //         scaleDegree = scaleDegree.substr(7, scaleDegree.length - 4)
            //         scaleDegree = parseFloat(scaleDegree)
            //         let numberMinus = scaleDegree / 11.25
            //         numberMinus = Math.round(numberMinus)
            //         _this.nowHeight = _this.mid - numberMinus
            //         // let scaleMinus = scaleDegree - startTransform
            //         // let numberMinus = scaleMinus / 11.25
            //         // numberMinus = Math.round(numberMinus)
            //         // _this.nowHeight = _this.nowHeight - numberMinus
            //     })
            // },
            //初始化身高选择器表盘
            initHeightSelector() {
                //上半部分表盘
                let min = this.min
                let mid = this.mid
                let max = this.max
                if(max > 230) {
                    max = 230
                }
                if(min < 100) {
                    min = 100 - 1
                }
                //每个旋转11.25度，已mid为初始化中间一个，高于mid一刻度，向右旋转11.25度，小于的话就相反
                for(let i = min + 1; i <= max; i++) {
                    let degree = (i - mid) * 11.25
                    let html = '<div class="number" style="transform: rotate(' + degree + 'deg)"'
                    html = html + '>' + i + '</div>'
                    this.selectorHtml += html
                }
                let _this = this
                this.$nextTick(function() {
                    //_this.addScaleEventListen()
                })
            },
            routeTo(path) {
                clearInterval(this._timer)
                localStorage.setItem('myHeight', this.nowHeight);
                localStorage.setItem('selectSex', this.sex);
                this.$router.push({path: path})
            },
            routeTouch(event) {
                event.stopPropagation()
            },
            routeTouchEnd(event) {
                event.stopPropagation()
            },
            //设置性别
            selectSex(type){
                this.$store.dispatch('setSex', type);
                localStorage.selectSex = type
                this.sex = type
                if(this.sex=='1'){
                    $('body').addClass('men')
                }else{
                    $('body').removeClass('men')
                }
            },
            back() {
                let url=location.origin+location.pathname+"#/personal";
                //window.xy.openWindow(url)
                window.xy.gototab('0',
                    function (res) {

                    },function (error) {
                        alert('error');
                    }
                )
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .height[type="1"] {
    background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
  }
  .height[type="0"] {
    background-image: linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
  }
  .height{
    overflow: hidden;
    height: 100%;width: 100%;
    .back{
      position: absolute;
      left: 0.8rem;
      top: 1.2rem;
      transform: rotate(90deg);
      width: 0.35rem;
    }
    .titleEn{
      text-align: center;color: #fff;font-size: 0.77rem;font-family: 'PingFang Medium';position: absolute;top: 18.5%;left: 50%;transform: translate(-50%, 0);
    }
    .title{
      text-align: center;color: #fff;font-size: 0.33rem;letter-spacing: 0.01rem;
      position: absolute;top: 24%;left: 50%;transform: translate(-50%, 0);
    }
    .avatar{
      display: flex;width: 100%;position: absolute;top: 37%;left: 50%;transform: translate(-50%, 0);
      .flex{
        flex: 1;align-items: flex-start;display: flex;justify-content: center;flex-direction: column;
        position: relative;
        img{
          width: 2.4rem;height: 2.24rem;
        }
        .lineImg{
          position: absolute;width: 3rem;height: 3rem;
          animation:imgRotate 2s linear infinite;
        }
      }
      .flex:first-child{
        img{
          margin-left: 32%;
        }
        .lineImg{
          top: -0.3rem;left: -0.3rem;
        }
      }
      .flex:last-child{
        align-items: center;
        img{
          margin-right: 10%;
        }
        .lineImg{
          top: -0.3rem;left: 0.6rem;
        }
      }
    }
    .sex{
      text-align: center;position: absolute;top: 53%;left: 50%;transform: translate(-50%, 0);
      img{
        width: 0.73rem;
      }
    }
    .questions{
      text-align: center;position: absolute;bottom: 4.9rem;left: 50%;transform: translate(-50%, 0);width: 100%;
      .question{
        font-size: 0.64rem;color: #fff;font-family: 'PingFang Medium';
      }
      .answer{
        font-size: 0.45rem;color: #fff;margin-top: 0.3rem;
      }
    }
    .container{
      width: 100%;height: 3.77rem;overflow: hidden;position: absolute;bottom:0;
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
      width: 13.3rem;height: 13.3rem;position: absolute;top: 0rem;border-radius: 50%;
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
  .height{
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
    .selector{
      .clock{
        width: 100%;height: 50%;border-top-left-radius: 50%;border-top-right-radius: 50%;position: absolute;
        top: 0;
      }
      .clock1{
        width: 100%;height: 50%;border-bottom-left-radius: 50%;border-bottom-right-radius: 50%;position: absolute;
        top: 50%;
      }
      .number{
        transform-origin: 50% 50%;position: absolute;top: 0;left: 50%;width: 0.7rem;height: 12.8rem;
        color: #fff;margin-left: -0.35rem;font-size: 0.43rem;text-align: center;padding-top: 0.5rem;
        z-index: 10;
      }
      .leftOverLay{
        width: 5.5rem;height: 13.3rem;position: absolute;left: 0.5rem;top: 0.2rem;
        border-top-left-radius: 13.3rem;border-bottom-left-radius: 13.3rem;
        z-index: 11;opacity: 0.7;
      }
      .rightOverLay{
        width: 5.5rem;height: 13.3rem;position: absolute;right: 0.5rem;top: 0.2rem;
        border-top-right-radius: 13.3rem;border-bottom-right-radius: 13.3rem;
        z-index: 11;opacity: 0.7;
      }
    }
  }
</style>
<style>
  @keyframes imgRotate{

    0%{-webkit-transform:rotate(0deg);}

    25%{-webkit-transform:rotate(90deg);}

    50%{-webkit-transform:rotate(180deg);}

    75%{-webkit-transform:rotate(270deg);}

    100%{-webkit-transform:rotate(360deg);}
  }
</style>
