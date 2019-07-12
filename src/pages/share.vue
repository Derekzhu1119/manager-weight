<template>
    <div id="share" :class="{'men':sex==1}">
        <div class="share_header">{{Detail.now .split(' ')[0]}}饮食记录</div>
        <div class="share_con_top">
            <img src="../assets/images/share.png" alt="">
            <div class="share_con_top_txt">
                <li>运动消耗 <span v-if="Detail.punchDetail">{{Detail.punchDetail.sportOutput || 0}} kcal</span></li>
                <li>食物摄入 <span v-if="Detail.punchDetail">{{Detail.punchDetail.foodInput || 0}} kcal</span></li>
                <p>
                    <van-icon name="clock-o"/>
                    {{Detail.now}}
                </p>
            </div>
        </div>
        <div class="share_con_list">
            <div class="share_item" v-if="Detail.punchDetail">
                <van-row>
                    <van-col span="3" style="text-align: center"><i class="iconfont icon-niunai" style="color: #f600a9;font-size: 24px"></i></van-col>
                    <van-col span="10" offset="1">早餐</van-col>
                    <van-col span="10" style="text-align: right">{{Detail.punchDetail.punchBreakfastFoodInfo.foodInput || 0}} <b>kcal</b></van-col>
                </van-row>
                <ul>
                    <li v-if="Detail.punchDetail.punchBreakfastFoodInfo" v-for="(item,index) in Detail.punchDetail.punchBreakfastFoodInfo.foods">
                        <van-row>
                            <van-col span="13" offset="1">{{item.name}}<small>{{item.unitName}}</small></van-col>
                            <van-col span="10" style="text-align: right">{{item.calories || 0}}<b>kcal</b></van-col>
                        </van-row>
                    </li>

                </ul>

            </div>
            <div class="share_item" v-if="Detail.punchDetail.punchLunchFoodInfo">
                <van-row>
                    <van-col span="3" style="text-align: center"><i class="iconfont icon-rouqin" style="color: #f600a9;font-size: 24px"></i></van-col>
                    <van-col span="10" offset="1">午餐</van-col>
                    <van-col span="10" style="text-align: right">{{Detail.punchDetail.punchLunchFoodInfo.foodInput || 0}} <b>kcal</b></van-col>
                </van-row>
                <ul>
                    <li v-for="(item,index) in Detail.punchDetail.punchLunchFoodInfo.foods">
                        <van-row>
                            <van-col span="13" offset="1">{{item.name}}<small>{{item.unitName}}</small></van-col>
                            <van-col span="10" style="text-align: right">{{item.calories || 0}}<b>kcal</b></van-col>
                        </van-row>
                    </li>
                </ul>

            </div>
            <div class="share_item">
                <van-row>
                    <van-col span="3" style="text-align: center"><i class="iconfont icon-yueliang" style="color: #f600a9;font-size: 24px"></i></van-col>
                    <van-col span="10" offset="1">晚餐</van-col>
                    <van-col span="10" style="text-align: right">{{Detail.punchDetail.punchDinnerFoodInfo.foodInput || 0}} <b>kcal</b></van-col>
                </van-row>
                <ul>
                    <li v-if="Detail.punchDetail.punchDinnerFoodInfo" v-for="(item,index) in Detail.punchDetail.punchDinnerFoodInfo.foods">
                        <van-row>
                            <van-col span="13" offset="1">{{item.name}}<small>{{item.unitName}}</small></van-col>
                            <van-col span="10" style="text-align: right">{{item.calories || 0}}<b>kcal</b></van-col>
                        </van-row>
                    </li>
                </ul>

            </div>
            <div class="share_item">
                <van-row>
                    <van-col span="3" style="text-align: center"><i class="iconfont icon-yundong" style="color: #4890ff;font-size: 30px"></i></van-col>
                    <van-col span="15" offset="1">运动 <br/>
                        <small v-if="Detail.punchDetail.punchSportInfo" v-for='(item,index) in Detail.punchDetail.punchSportInfo.sports' style="margin-left: 0">
                            {{item.name}}
                        </small>
                    </van-col>
                    <van-col span="5" style="text-align: right">{{Detail.punchDetail.punchSportInfo.duration || 0}} <b style="color:#4890ff">min</b></van-col>
                </van-row>


            </div>
        </div>
    </div>
</template>
<script>
    import api from '../fetch/api'
    import * as _ from '../util/tool'
    export default {
        components: {},
        data() {
            return {
                loading: false,
                isIphoneX : (/iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812),
                isIphoneXr : (/iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896),
                isIphoneXsMax : (/iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896),
                // 用户信息
                userInfo:{},
                sex:window.localStorage.selectSex || 1,
                //详情
                Detail:{},
                //当前年月
                currentDate: new Date(),
                currentY: new Date().getFullYear(),
                currentM: parseInt(new Date().getMonth())+1,
                currentD: new Date().getDate(),



            }
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {

            })
        },
        created() {
            document.title='首页';

        },
        mounted() {

            //native扫码调用
            var that=this;
            window.eoopWeb = {
            }
            // if(this.$route.query.userName && typeof this.$route.query.userName !='undefined' && this.$route.query.userName!=null){
            //     console.log(this.$route.query.userName)
            // }
            this.getDetailShare()

        },
        computed: {


        },
        methods: {
            getDetailShare(){
                let d=this.currentY+"-"+this.currentM+"-"+this.currentD;
                api.getDetailShare(d,this.$route.query.loginName).then(res=>{
                    if(res.code=='2000'){
                        this.Detail=res.result;
                    }
                }).catch(err=>{
                    this.$toast.fail('获取详情失败')
                })
            }

        },
        updated(){

        },
        watch:{

        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/css/function';

    .clearfix {
        clear: both;
        display: block;
    }
    #share{
        min-height: 100vh;
        position: relative;
        background-image:  linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
        padding:0 0 px2rem(200px) 0;
        &.men{
            background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
        }
        .share_header{
            position: relative;
            z-index: 9;
            padding-top: px2rem(55px);
            text-align: center;
            color: #fff;

        }
        .share_con_top{
            position:relative;
            text-align: center;
            img{
                width: 95%;
            }
            .share_con_top_txt{
                position: absolute;
                right: px2rem(145px);
                bottom: px2rem(150px);
                color: #fff;
                text-align: right;
                li{
                    margin-bottom: px2rem(35px);
                    font-size: px2rem(32px);
                }
                p{
                    margin-top: px2rem(90px);
                    font-size: px2rem(32px);
                    vertical-align: middle;

                }
            }
        }
        .share_con_list{
            padding: px2rem(100px);
            padding-top: 0;
            .share_item{
                color: #fff;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding-bottom: px2rem(100px);
                padding-top: px2rem(100px);
                div{
                    font-size: px2rem(48px);
                }


                small{
                    display: inline-block;
                    margin-top: px2rem(10px);
                    opacity: .5;
                    font-size: px2rem(42px);
                    margin-left: px2rem(40px);
                }
                b{
                    color: #0dda7f;
                    display: inline-block;
                    font-size: px2rem(30px);
                    padding-top: px2rem(30px);
                    font-size: px2rem(42px);

                }
                ul{
                    li{
                        margin-top: px2rem(20px);
                        height: px2rem(80px);
                        line-height: px2rem(80px);

                        small{
                            margin-top:0;
                            font-size: px2rem(42px);
                        }
                        b{
                            color: #0dda7f;
                            display: inline-block;
                            font-size: px2rem(30px);
                            padding-top: 0;
                            font-size: px2rem(42px);

                        }
                        div{
                            font-size: px2rem(42px);
                        }
                    }
                }
            }
        }



    }


</style>
