<template>
    <div id="index" :class="{'men':sex==1}">
        <div class="index_top">
            <div class="index_tip">
                <span><van-icon name="static/images/i8.png" size="25px" /></span>
                <p>
                    <b v-if="userInfo.baseInfo">你好，{{userInfo.baseInfo.loginName}}</b>

                    <van-notice-bar background="none" class="dscroll" style="" :speed="20">
                        <small v-if="userInfo && userInfo.targetInfo">今天是你{{userInfo.targetInfo.target=='1' ? '减轻重量' : userInfo.targetInfo.target=='2' ? '塑形' : userInfo.targetInfo.target=='3' ? '增加肌肉' : '脂肪燃烧'}}的第{{userInfo.targetInfo.planBeginDays}}天，离目标还有{{userInfo.targetInfo.planRemainingDays}}天，继续加油！</small>
                    </van-notice-bar>

                </p>
            </div>
            <div class="index_progress">

                <van-slider
                        v-model="barValue"
                        bar-height="4px"
                        disabled
                        :active-color="sex==1 ?'#c90bc7': '#f9c268'"
                        inactive-color="rgba(255,255,255,0.16)"
                        class="current_slider"
                >
                    <div
                            slot="button"
                            class="custom-button"
                    >
                    </div>
                </van-slider>
            </div>
            <div class="date">
                <div class="date_top">
                    <span @click="showDatePickAction">{{new Date(currentDate).getFullYear()+'年'+(parseInt(new Date(currentDate).getMonth())+1)+'月'}}<van-icon name="arrow-down"  style="vertical-align: text-bottom;padding-left: 5px" /></span>
                    <i @click="showShare=true"><van-icon name="static/images/i3.png" /></i>
                </div>
                <div class="date_list" :class="{'men':sex==1}">
                    <!--<v-touch v-on:swipeleft="SwipeLeftDate"  v-on:swiperight="SwipeRightDate">-->
                    <ul>
                        <li v-for="(item,index) in currentMonthDays" :class="{'isToday':item.isToday && (item.y!=currentY || item.m!=currentM || item.d==currentD),'active':item.y==currentY && item.m==currentM && item.d==currentD,'isSelected':item.isSelected}" @click="selectDay(item)">
                            <span>{{item.d}}</span>
                        </li>

                    </ul>
                    <!--</v-touch>-->
                </div>
            </div>

        </div>
        <div class="bolang">
            <div class="bolang_inner">
                <img :src="sex=='1' ? 'static/images/line_m.png' :'static/images/line_w.png'" alt="" v-for="index of 100" :key="index">
            </div>

        </div>
        <!--折线图-->
        <div class="top_chart" id="zx_chat"></div>
            <!--当前昨天对比-->
        <div class="current_data">
            <span><b>{{indexDetail.weightPunch || 0}} <small>kg</small></b><span v-if="indexDetail.weightPunchDateTime">今天{{indexDetail.weightPunchDateTime.split(" ")[1].substring(0,5)}}</span></span>
            <span @click="showTizhongCardAction"><b><small><i class="iconfont icon-tizhong1" style="font-size: 24px"></i></small></b><span>体重打卡</span></span>
            <span><b><small><van-icon name="static/images/i10.png" size="10px" :class="{'isrotate':indexDetail.compareLastday>0}"/></small>{{Math.abs(indexDetail.compareLastday)}} </b><span>对比上次</span></span>
        </div>
        <!--首页燃脂图-->
        <div class="index_center">
            <div class="chart2">
                    <canvas id="echarts"></canvas>
            </div>
            <div class="center_inner" :class="{'men':sex==1,'femen':sex==0}">
                <img :src="sex==1 ? 'static/images/i_1.png' : 'static/images/i1.png'" alt="" class="c1">
                <img :src="sex==1 ? 'static/images/i_2.png' : 'static/images/i2.png'" alt="" class="c2">
                <span><small>还可以摄入</small><br/>{{indexDetail.stillEatingCalories || 0}}<small style="padding-left: 5px">kcal</small><br/><small>不超过就能瘦哦</small></span>
            </div>
            <div class="center_canvas">
                <canvas id="canvas"></canvas>
            </div>
        </div>
        <!--首页底部-->
        <div class="daka_detail_top">
            <span>
                <!--<van-icon name="static/images/i5.png" />-->
                <i class="iconfont icon-sw-f-copy" style="color: #f600a9"></i>
                <b>
                    食物摄入
                    <small>{{indexDetail.foodInput}}</small>
                </b>
            </span>

            <span>
                <!--<van-icon name="static/images/i12.png" />-->
                <i class="iconfont icon-icon-test-copy" style="color: #0dbfee"></i>
                <b>
                    运动消耗
                    <small>{{indexDetail.sportOutput}}</small>
                </b>
            </span>

        </div>
        <div class="daka_detail_item">
            <article><van-icon name="static/images/i6.png" />食物摄入</article>
            <ul class="t1">
                <li @click="openMeal(1)" v-if="indexDetail.punchBreakfastFoodInfo">
                    <span class="s1">
                        <!--<van-icon name="static/images/i15.png" />-->
                        <i class="iconfont icon-niunai" style="color: #f600a9;font-size: 20px"></i>
                    </span>
                    <span class="s2">
                        <article>早餐</article>
                        <p>
                            <small style="font-size: 12px" v-for="(item,index) in indexDetail.punchBreakfastFoodInfo.foods" :key="index">
                                {{item.name+"*"+item.num+'('+item.unitName+')'}}
                                {{index==indexDetail.punchBreakfastFoodInfo.foods.length-1 ? '' : ','}}
                            </small>
                            <small style="font-size: 12px" v-if="indexDetail.punchBreakfastFoodInfo.foods.length==0">
                                暂无数据
                            </small>
                           </p>
                    </span>
                    <span class="s3">
                        {{indexDetail.punchBreakfastFoodInfo.foodInput || 0}} <small>kcal</small>
                    </span>
                </li>
                <li @click="openMeal(2)" v-if="indexDetail.punchLunchFoodInfo">
                    <span class="s1">
                        <!--<van-icon name="static/images/i9.png" />-->
                        <i class="iconfont icon-rouqin" style="color: #f600a9;font-size: 20px"></i>
                    </span>
                    <span class="s2">
                        <article>午餐</article>
                        <p>
                            <small style="font-size: 12px" v-for="(item,index) in indexDetail.punchLunchFoodInfo.foods" :key="index">
                                {{item.name+"*"+item.num+'('+item.unitName+')'}}
                                {{index==indexDetail.punchLunchFoodInfo.foods.length-1 ? '' : ','}}
                            </small>
                             <small style="font-size: 12px" v-if="indexDetail.punchLunchFoodInfo.foods.length==0">
                                暂无数据
                            </small>
                           </p>
                    </span>
                    <span class="s3">
                        {{indexDetail.punchLunchFoodInfo.foodInput || 0}} <small>kcal</small>
                    </span>
                </li>
                <li @click="openMeal(3)" v-if="indexDetail.punchDinnerFoodInfo">
                    <span class="s1">
                        <!--<van-icon name="static/images/i7.png" />-->
                        <i class="iconfont icon-yueliang" style="color: #f600a9;font-size: 20px"></i>
                    </span>
                    <span class="s2">
                        <article>晚餐</article>
                        <p>
                             <small style="font-size: 12px" v-for="(item,index) in indexDetail.punchDinnerFoodInfo.foods" :key="index">
                                    {{item.name+"*"+item.num+'('+item.unitName+')'}}
                                    {{index==indexDetail.punchDinnerFoodInfo.foods.length-1 ? '' : ','}}
                             </small>
                              <small style="font-size: 12px" v-if="indexDetail.punchDinnerFoodInfo.foods.length==0">
                                暂无数据
                            </small>
                        </p>

                    </span>
                    <span class="s3">
                        {{indexDetail.punchDinnerFoodInfo.foodInput || 0}} <small>kcal</small>
                    </span>
                </li>
            </ul>
            <article><van-icon name="static/images/i13.png" />运动消耗</article>
            <ul class="t2">
                <li @click="openPlay" v-if="indexDetail.punchSportInfo">
                    <span class="s1">
                        <!--<van-icon name="static/images/i11.png" />-->
                        <i class="iconfont icon-yundong" style="color: #4890ff;font-size: 20px"></i>

                    </span>
                    <span class="s2">
                        <article>运动</article>
                        <p>
                            <small style="font-size: 12px" v-for="(item,index) in indexDetail.punchSportInfo.sports" :key="index">
                                    {{item.name}}
                                    {{index==indexDetail.punchSportInfo.sports.length-1 ? '' : ','}}
                             </small>
                             <small style="font-size: 12px" v-if="indexDetail.punchSportInfo.sports.length==0">
                                暂无数据
                            </small>
                        </p>
                    </span>
                    <span class="s3">
                        {{indexDetail.punchSportInfo.duration || 0}} <small>min</small>
                    </span>
                </li>
            </ul>
        </div>
        <!--年月份选择-->
        <van-popup v-model="showDatePick" position="bottom" @closed="hideNativetab(false)" :overlay="true" style="background: none">
            <van-datetime-picker
                    v-model="currentDate"
                    type="year-month"
                    :formatter="formatter"
                    @confirm="hideDate"
                    @cancel="hideDate"
                    @change="changeCurrentMouth(1)"
            />
        </van-popup>
        <!--运动-->
        <van-popup v-model="showPlay" position="bottom" @closed="hideNativetab(false)" :overlay="true" class="pClass">
            <div class="play_con">
                <div class="play_con_top">
                    <li @click="playActive=0" :class="{'active':playActive==0}"><span>已打卡</span></li>
                    <li @click="playActive=1" :class="{'active':playActive==1}"><span>快乐运动</span></li>
                </div>
                <div class="play_con_list1" v-show="playActive==0">
                    <ul>

                        <van-swipe-cell :right-width="60" class="pList1" v-for="(item,index) in allreadyplayList" :key="index">
                            <li>
                                <span class="s1"><van-icon :name="item.image" /></span>
                                <span class="s2">
                                        <b>{{item.name}}</b>
                                        <small>{{item.description}}</small>
                                     </span>
                                <span class="s3">{{item.caloriesCount}}</span>

                            </li>
                            <van-icon name="clear" @click="removeplayFromMyCard(item.id)" color="#fff" slot="right" class="del_icon" />
                        </van-swipe-cell>



                    </ul>
                </div>
                <div class="play_con_list2" v-show="playActive==1">
                    <div class="play_con_list2_search">
                        <van-search
                                v-model="searchPlayKey"
                                placeholder="请输入搜索关键词"
                                @search="onSearchPlay"
                                shape="round"
                                class="inSearch"
                                background="#171231"
                        />
                    </div>
                    <div class="play_con_list2_inner">
                        <div class="play_con_list2_inner_l">
                            <li v-for="(item,index) in sportCategory" :key="index" :class="{'active':currentPlayTab==index}" @click="getPlayListById(item.id,index)">
                                {{item.name}}
                            </li>
                        </div>
                        <div class="play_con_list2_inner_r">
                            <ul>
                                <li v-for="(item,index) in playList" :key="index">
                                    <span class="s1"><van-icon :name="item.image" /></span>
                                    <span class="s2"><b>{{item.name}}</b><small>{{item.description}}</small></span>
                                    <span class="s3"><van-icon name="clear" @click="removeFromMyplay(index,item.id)" v-show="playList[index].num>0" /><small v-show="playList[index].num>0">{{playList[index].num}}</small><van-icon name="add" @click="addToMyplay(item)" /></span>

                                </li>
                            </ul>
                        </div>
                        <div class="clearfix"></div>
                    </div>


                </div>
            </div>
        </van-popup>
        <!--饮食-->
        <van-popup v-model="showFood" position="bottom" @closed="hideNativetab(false)" :overlay="true" class="pClass">
            <div class="play_con">
                <div class="play_con_top">
                    <li @click="foodActive=0" :class="{'active':foodActive==0}"><span>已打卡</span></li>
                    <li @click="foodActive=1" :class="{'active':foodActive==1}"><span>健康饮食</span></li>
                </div>
                <div class="play_con_list1" v-show="foodActive==0">
                    <ul>
                            <van-swipe-cell :right-width="60" class="pList1" v-for="(item,index) in allreadyfoodList" :key="index">
                                <li>
                                    <span class="s1"><van-icon :name="item.image" /></span>
                                    <span class="s2">
                                        <b>{{item.name}} *{{item.num}}</b>
                                        <small>{{item.unitDescription}}</small>
                                     </span>
                                    <span class="s3">{{item.caloriesCount}}</span>

                                 </li>
                                <van-icon name="clear" @click="removefoodFromMyCard(item.id)" color="#fff" slot="right" class="del_icon" />
                            </van-swipe-cell>
                    </ul>
                </div>
                <div class="play_con_list2" v-show="foodActive==1">
                    <div class="play_con_list2_search">
                        <van-search
                                v-model="searchFoodKey"
                                placeholder="请输入搜索关键词"
                                @search="onSearchFood"
                                shape="round"
                                class="inSearch"
                                background="#171231"
                        />
                    </div>
                    <div class="play_con_list2_inner">
                        <div class="play_con_list2_inner_l">
                            <li  v-for="(item,index) in foodCategory" :key="index" :class="{'active':currentFoodTab==index}" @click="getFoodListById(item.id,index)">{{item.name}}</li>

                        </div>
                        <div class="play_con_list2_inner_r">
                            <ul>
                                <li v-for="(item,index) in foodList" :key="index">
                                    <span class="s1"><van-icon :name="item.image" /></span>
                                    <span class="s2"><b>{{item.name}}</b><small>{{item.description}}</small></span>
                                    <span class="s3"><van-icon name="clear" @click="removeFromMyFood(index,item.id)" v-show="foodList[index].num>0" /><small v-show="foodList[index].num>0">{{foodList[index].num}}</small><van-icon name="add" @click="addToMyFood(item)" /></span>
                                </li>
                            </ul>
                        </div>
                        <div class="clearfix"></div>
                    </div>


                </div>
            </div>
        </van-popup>
        <!--分享页面右侧弹出-->
        <van-popup v-model="showShare" position="right" @closed="hideNativetab(false)" :overlay="false" class="sharepop" :class="{'men':sex==1}">
            <div class="share">
                <div class="share_top">
                    <van-nav-bar
                            title="分享至"
                            left-text=""
                            right-text="完成"
                            left-arrow
                            @click-left="onClickBack"
                            @click-right="onClickDown"
                    />
                </div>
                <div class="share_con">
                    <div class="share_con_top">
                        <img src="../assets/images/share.png" alt="">
                        <div class="share_con_top_txt">
                            <li>运动消耗 <span>{{indexDetail.sportOutput || 0}} kcal</span></li>
                            <li>食物摄入 <span>{{indexDetail.foodInput || 0}} kcal</span></li>
                            <p>
                                <van-icon name="clock-o"/>
                                {{indexDetail.weightPunchDateTime}}
                            </p>
                        </div>
                    </div>
                    <div class="share_con_list">
                        <!--<div @click="shareToNative('3')">-->
                            <!--<van-row class="share_item">-->
                                <!--<van-col span="5" offset="1" class="i1"><van-icon name="static/images/share_05.png" /></van-col>-->
                                <!--<van-col span="15">Facebook</van-col>-->
                                <!--<van-col span="2" offset="1" size="14" class="i2"><van-icon name="arrow" /></van-col>-->
                            <!--</van-row>-->
                        <!--</div>-->
                        <div @click="shareToNative('1')">
                            <van-row class="share_item">
                                <van-col span="5" offset="1" class="i1"><van-icon name="static/images/share_09.png" /></van-col>
                                <van-col span="15">微信好友</van-col>
                                <van-col span="2" offset="1" size="14" class="i2"><van-icon name="arrow" /></van-col>
                            </van-row>
                        </div>
                        <div @click="shareToNative('0')">
                            <van-row class="share_item">
                                <van-col span="5" offset="1" class="i1"><van-icon name="static/images/share_11.png" /></van-col>
                                <van-col span="15">朋友圈</van-col>
                                <van-col span="2" offset="1" size="14" class="i2"><van-icon name="arrow" /></van-col>
                            </van-row>
                        </div>


                    </div>
                </div>
            </div>

        </van-popup>
        <!--弹出运动食物打卡消耗选择-->
        <van-popup v-model="showSelectUnit" position="bottom" @closed="hideNativetab(false)" :overlay="true">
            <div  class="tzModel">
                <van-cell-group>
                    <van-field clearable :label="unitPlaceholder"  :border='true' readonly v-model="unitNum"  style="background: #eee"/>
                </van-cell-group>
                <!--<van-cell style="padding-left:0">-->
                    <!--<van-tag type="danger" v-if="unitNum">{{ (parseFloat(unitNum)*12)+'卡路里'}}</van-tag>-->
                <!--</van-cell>-->
                <van-tabs v-model="selectedUnit">
                    <van-tab v-for="(item,index) in unitArr" :key="index" :title="item.name+'('+(item.description || 'min')+')'"></van-tab>
                </van-tabs>
            </div>

            <van-number-keyboard
                    :show="true"
                    extra-key=""
                    theme="custom"
                    close-button-text="完成"
                    @blur="show = false"
                    @input="onInputkeyboard"
                    @close="completeKeyboard"
                    @delete="onDeletekeyboard"
                    :safe-area-inset-bottom="true"
            />
        </van-popup>
        <!--弹出体重打卡-->
        <van-popup v-model="showTizhongCard" position="bottom" @closed="hideNativetab(false)" :overlay="true">
            <div  class="tzModel">
                <van-cell-group>
                    <van-field clearable label="请输入体重:" :border='true' readonly v-model="currentWeight" style="background: #eee"/>
                </van-cell-group>
                <van-cell style="padding-left:0;display: none">
                    <van-tag type="danger" v-if="currentWeight">{{ (parseFloat(currentWeight)*20)+'卡路里'}}</van-tag>
                </van-cell>
                <van-tabs v-model="selectedWeightUnit">
                    <van-tab v-for="(item,index) in unitWeightArr" :key="index" :title="item.name"></van-tab>
                </van-tabs>
            </div>

            <van-number-keyboard
                    :show="true"
                    extra-key="."
                    theme="custom"
                    close-button-text="完成"
                    @blur="show = false"
                    @input="onInputkeyboardWeight"
                    @close="completeKeyboardWeight"
                    @delete="onDeletekeyboardWeight"
                    :safe-area-inset-bottom="true"
            />
        </van-popup>
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapState} from 'vuex'
    import api from '../fetch/api'
    import * as _ from '../util/tool'
    import '../util/webView'
    import * as Cirlce from '../util/zcircleMove'
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
                indexDetail:{},
                //顶部进度条
                barValue:20,
                currentRate:10,
                dateScrollIndex:0,
                //当前年月
                currentDate: new Date(),
                currentY: new Date().getFullYear(),
                currentM: parseInt(new Date().getMonth())+1,
                currentD: new Date().getDate(),
                //当月日期
                currentMonthDays:[],
                //显示年月选择
                showDatePick:false,
                //显示分享
                showShare:false,
                //显示运动弹框
                showPlay:false,
                //显示食物弹框
                showFood:false,
                // 食物搜索
                searchFoodKey:'',
                // 运动搜索
                searchPlayKey:'',
                // 运动当前tab
                playActive:0,
                // 食物当前tab
                foodActive:0,
                //食物，运动
                foodCategory:[],
                sportCategory:[],
                allreadyfoodList:[],
                allreadyplayList:[],
                foodList:[],
                playList:[],
                // 运动左侧菜单当前
                currentPlayTab:0,
                // 食物左侧菜单当前
                currentFoodTab:0,
                // 折线图数据源
                zData:[],
                //打卡单位选择
                showSelectUnit:false,
                //弹出键盘选中的值
                unitNum:'',
                //单位选项
                unitArr:[],
                //当前体重
                currentWeight:'',
                //体重单位
                unitWeightArr:[
                    {
                        id:1,
                        name:'公斤'
                    }
                ],
                // 当前选中的单位
                selectedUnit:0,
                selectedWeightUnit:0,
                //体重打卡
                showTizhongCard:false,
                //弹框label值
                unitPlaceholder:'请输入',
                //弹出框的类型（food/play）
                currentUnitModel:'food',
                currentMealtype:1,
                currentSelectid:'',
                currentMonthCarded:[]


            }
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                //this.toast('提示信息');

            })
        },
        created() {
            if(this.$route.query.token && typeof this.$route.query.token !='undefined' && this.$route.query.token!=null){
                localStorage.setItem('token',this.$route.query.token)
            }
        },
        mounted() {
            //native扫码调用
            var that=this;
            window.eoopWeb = {
                reloadIndex:function () {

                    //获取首页打卡详情
                    let d=that.currentY+"-"+that.currentM+"-"+that.currentD;
                    that.getIndexDetail(d)
                }
            }
            this.$nextTick(function () {
                // 初始化日期日历
                that.firstTimeDraw();
                that.getRecordayMonth();
                //爆炸图先渲染
                setTimeout(function () {
                    that.getCanvas();
                    //初始化到当天位置
                    document.getElementsByClassName('date_list')[0].scrollLeft=(new Date().getDate()-1)*$(".date_list ul li").width();
                    that.dateScrollIndex=new Date().getDate()<=9 ? 0 : Math.ceil(new Date().getDate()/9)

                },1500)
                //获取用户信息
                this.getUserInfo();
            })
        },
        computed: {
            ...mapGetters({
                loginStatus: "loginStatus",
                token: "token",
                // sex:"sex",
                weight:"weight",
                birthday:"birthday",
                height:"height"
            }),

        },
        methods: {
            //获取用户信息
            getUserInfo(){
                let that=this;
                //localStorage.setItem('token','b23a2f076f094eb0b6e8ec98540827c2');
                //接口获取用户信息并存储
                //获取用户信息
                if(window.xy && window.xy.getLoginUserInfo){
                    window.xy.getLoginUserInfo(
                        function (res) {
                            window.localStorage.setItem('token', res.token);
                            // that.$store.dispatch('setToken', window.localStorage.token);
                            api.getUserInfo().then(res=>{

                                if(res.code=='2000'){
                                    that.userInfo=res.result;
                                    that.barValue=res.result.targetInfo.planCompletePercentage
                                    window.localStorage.setItem('selectSex', res.result.baseInfo.sex);
                                    that.sex=res.result.baseInfo.sex;
                                    // that.$store.dispatch('setSex', window.localStorage.selectSex);
                                    // //设置body颜色
                                    if(that.sex=='1' || that.sex==1){
                                        $('body').addClass('men').removeClass('nosafePadding');
                                    }else{
                                        $('body').removeClass('men').removeClass('nosafePadding')
                                    }

                                    //获取首页打卡详情
                                    let d=that.currentY+"-"+that.currentM+"-"+that.currentD;
                                    that.getIndexDetail(d)

                                }else{
                                    that.$toast.fail('获取用户信息失败')
                                }
                            }).catch(err=>{
                                that.$toast.fail('获取用户信息失败!')
                            })

                        },function (error) {
                            that.$toast.error('error');
                        }
                    )
                }else{
                    api.getUserInfo().then(res=>{

                        if(res.code=='2000'){
                            that.userInfo=res.result;
                            that.barValue=res.result.targetInfo.planCompletePercentage
                            window.localStorage.setItem('selectSex', res.result.baseInfo.sex);
                            // that.$store.dispatch('setSex', window.localStorage.selectSex);
                            // //设置body颜色
                            if(that.sex=='1' || that.sex==1){$('body').addClass('men').removeClass('nosafePadding');}else{
                                $('body').removeClass('men').removeClass('nosafePadding')
                            }
                            //获取折线图迁移(当前时间范围)
                            let sd=1;
                            let nd=31;
                            // if(new Date().getDate()>=1 && new Date().getDate()<=9){
                            //     sd=1;
                            //     nd=9
                            // }else if(new Date().getDate()>=10 && new Date().getDate()<=19){
                            //     sd=10;
                            //     nd=19
                            // }else if(new Date().getDate()>=20 && new Date().getDate()<=29){
                            //     sd=19;
                            //     nd=31
                            // }else{
                            //     sd=22;
                            //     nd=31
                            // }
                            let startDate=that.currentY+"-"+that.currentM+"-"+sd;
                            let endDate=that.currentY+"-"+that.currentM+"-"+nd;
                            that.getWeightRecord(startDate,endDate)
                            //获取首页打卡详情
                            let d=that.currentY+"-"+that.currentM+"-"+that.currentD;
                            that.getIndexDetail(d)
                        }else{
                            that.$toast.fail(res.msg)
                        }
                    }).catch(err=>{
                        that.$toast.fail('获取用户信息失败!')
                    })
                }

            },
            formatter(type, value) {
                if (type === 'year') {
                    return `${value}年`;
                } else if (type === 'month') {
                    return `${value}月`
                }
                return value;
            },
            //首次进入渲染日历
            firstTimeDraw(){
                let y=new Date(this.currentDate).getFullYear();
                let m=parseInt(new Date(this.currentDate).getMonth())+1;
                let totalDay=_.getDaysInMonth(y,m);
                let that=this;
                that.currentMonthDays=[];
                for(let i=1;i<=totalDay;i++){
                    let obj={};
                    obj.y=y;
                    obj.m=m;
                    obj.d=i;
                    if(new Date().getFullYear()==y && parseInt(new Date().getMonth())+1==m && new Date().getDate()==i){
                        obj.isToday=true;
                    }else{
                        obj.isToday=false
                    }
                    that.currentMonthDays.push(obj);
                }
            },
            // 月份切换后修改日期
            changeCurrentMouth(){
                let that=this;
                this.firstTimeDraw();
                document.getElementsByClassName('date_list')[0].scrollLeft=0;
                this.getRecordayMonth()
            },
            //体重后更新数据
            getRecordayMonth(){
                let that=this;
                let y=new Date(this.currentDate).getFullYear();
                let m=parseInt(new Date(this.currentDate).getMonth())+1;
                api.getRecordayMonth(y+'-'+m).then(res=>{
                    //当月已打卡的day
                    this.currentMonthCarded=res.result;
                    that.currentMonthDays.map((res,index)=>{
                        if(that.currentMonthCarded.indexOf(res.d)!=-1){
                            that.currentMonthDays[index].isSelected=true
                        }
                    })



                })
            },
            //日期点击事件
            selectDay(dateObj){
                this.currentY = dateObj.y;
                this.currentM = dateObj.m;
                this.currentD = dateObj.d;
                //初始化所有数据
                let d=this.currentY+"-"+this.currentM+"-"+this.currentD;
                this.isToday=false
                this.getIndexDetail(d)
                //获取打卡相关
                // this.getRecordFood(d);
                // this.getRecordSport(d)
            },
            //日期向左滑动
            SwipeLeftDate(){
                console.log('向左滑动');
                // this.dateScrollIndex++;
                // let that=this;
                // let swidth=$(".date_list ul li").width()*9;
                // $(".date_list").animate({scrollLeft:that.dateScrollIndex*swidth},700);
                //
                // let sd=1;
                // let nd=31;
                // if(that.dateScrollIndex==0){
                //     sd=1;
                //     nd=9
                // }else if(that.dateScrollIndex==1){
                //     sd=10;
                //     nd=18
                // }else if(that.dateScrollIndex==2){
                //     sd=19;
                //     nd=31
                // }else{
                //     sd=22;
                //     nd=31
                // }
                // let startDate=this.currentY+"-"+this.currentM+"-"+sd;
                // let endDate=this.currentY+"-"+this.currentM+"-"+nd;
                // this.getWeightRecord(startDate,endDate)


            },
            //日期向右滑动
            SwipeRightDate(){
                console.log('向右边滑动');
               //  if(this.dateScrollIndex>1){
               //      this.dateScrollIndex--
               //  }else{
               //      this.dateScrollIndex=0
               //  }
               //  let that=this;
               //  let swidth=$(".date_list ul li").width()*9;
               //  $(".date_list").animate({scrollLeft:that.dateScrollIndex*swidth},700);
               //  //document.getElementsByClassName('date_list')[0].scrollLeft-=380;
               //
               //  let sd=1;
               //  let nd=31;
               //  if(that.dateScrollIndex==0){
               //      sd=1;
               //      nd=9
               //  }else if(that.dateScrollIndex==1){
               //      sd=10;
               //      nd=18
               //  }else if(that.dateScrollIndex==2){
               //      sd=19;
               //      nd=31
               //  }else{
               //      sd=22;
               //      nd=31
               //  }
               //  let startDate=this.currentY+"-"+this.currentM+"-"+sd;
               //  let endDate=this.currentY+"-"+this.currentM+"-"+nd;
               // // this.zData=[50,80,50,68,60,70,40,59,70]
               //  this.getWeightRecord(startDate,endDate)

            },
            // 显示年月选择
            showDatePickAction(){
                this.showDatePick=true;
                this.hideNativetab(true)
            },
            // 体重打卡显示
            showTizhongCardAction(){
                this.showTizhongCard=true;
                this.currentWeight='';
                this.hideNativetab(true)
            },
            // 年月选择隐藏

            hideDate(){
                this.showDatePick=false
            },
            //弹框出现时候隐藏或者显示nativeBar
            hideNativetab(f){
                window.xy.isHideTab(f,
                    function (res) {

                    },function (error) {

                    }
                )
            },
            //热力图动画
            getCanvas(){
                let that=this;
                let dpr=$("html").attr('data-dpr');
                //顶部动画
                const el = document.getElementById('canvas');
                const ctx = el.getContext('2d');
                const pi = Math.PI;
                const points =30;
                const radius = 40;
                const h = 320;
                const w = 320;
                const center = {
                    x: w / 2,
                    y: h / 2
                };
                const circles = [];
                const rangeMin =32;
                const rangeMax =35;

                let mouseY = 0;
                let tick = 0;
                let color=that.sex==1 ? 'rgba(69,65,190,0.3)' : 'rgba(243,5,154,0.3)';
                const gradient1 = ctx.createLinearGradient(0, 0, w, 0);
                gradient1.addColorStop(0, color);
                gradient1.addColorStop(1, color);

                const gradient2 = ctx.createLinearGradient(0, 0, w, 0);
                gradient2.addColorStop(0, color);
                gradient2.addColorStop(1, color);

                const gradient3 = ctx.createLinearGradient(0, 0, w, 0);
                gradient3.addColorStop(0, color);
                gradient3.addColorStop(1, color);
                const gradients = [ gradient1,gradient2,gradient3];
                ctx.scale(dpr, dpr);
                el.width = w * dpr;
                el.height = h * dpr;
                el.style.width = w + 'px';
                el.style.height = h + 'px';

                for (var idx = 0; idx <= gradients.length - 1; idx++) {
                    let swingpoints = [];
                    let radian = 0;
                    for (var i = 0; i < points; i++){
                        radian = pi * 2 / points * i;
                        var ptX = center.x + radius * Math.cos(radian);
                        var ptY = center.y + radius * Math.sin(radian);

                        swingpoints.push({
                            x: ptX,
                            y: ptY,
                            radian: radian,
                            range: random(rangeMin, rangeMax),
                            phase: 0
                        });
                    }

                    circles.push(swingpoints);

                }
// swingCircle
                function swingCircle() {
                    ctx.clearRect(0, 0, w * dpr, h * dpr);

                    ctx.globalAlpha = 1;
                    // ctx.globalCompositeOperation = 'source-over';
                    ctx.globalCompositeOperation = 'screen';

                    for (let k = 0; k < circles.length; k++) {
                        let swingpoints = circles[k];

                        for (var i = 0; i < swingpoints.length; i++){
                            swingpoints[i].phase += random(1, 10) * -0.01;

                            let phase = 4 * Math.sin(tick / 65);

                            if (mouseY !== 0) {
                                phase = mouseY / 200 + 1;
                            }

                            var r = radius + (swingpoints[i].range * phase * Math.sin(swingpoints[i].phase)) - rangeMax;

                            swingpoints[i].radian += pi / 360;

                            var ptX = center.x + r * Math.cos(swingpoints[i].radian);
                            var ptY = center.y + r * Math.sin(swingpoints[i].radian);



                            swingpoints[i] = {
                                x: ptX,
                                y: ptY,
                                radian: swingpoints[i].radian,
                                range: swingpoints[i].range,
                                phase: swingpoints[i].phase,
                            };
                        }

                        const fill = gradients[k];

                        drawCurve(swingpoints, fill);

                    }
                    tick++;
                    requestAnimationFrame(swingCircle);
                }
// --------------------------------------------------------------------------- //
// drawCurve
                function drawCurve(pts, fillStyle) {
                    ctx.fillStyle = fillStyle;
                    ctx.beginPath();
                    ctx.moveTo(
                        (pts[cycle( - 1, points)].x + pts[0].x) / 2,
                        (pts[cycle( - 1, points)].y + pts[0].y) / 2);
                    for (var i = 0; i < pts.length; i++){

                        ctx.quadraticCurveTo(
                            pts[i].x,
                            pts[i].y,
                            (pts[i].x + pts[cycle(i + 1, points)].x) / 2,
                            (pts[i].y + pts[cycle(i + 1, points)].y) / 2);
                    }

                    ctx.closePath();
                    ctx.fill();

                }
// --------------------------------------------------------------------------- //
// cycle
                function cycle( num1, num2 ) {
                    return ( num1 % num2 + num2 ) % num2;
                }
// --------------------------------------------------------------------------- //
// random
                function random (num1, num2) {
                    var max = Math.max(num1, num2);
                    var min = Math.min(num1, num2);
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                requestAnimationFrame(swingCircle);
            },
            // 折线图
            drawZhexian(){
                // var _that = this;
                // let option = {
                //     tooltip : {
                //         trigger: 'axis',
                //         show:false
                //     },
                //     grid: {
                //         left: 0,
                //         right: 0,
                //         top: 0,
                //         bottom: "10%"
                //     },
                //     calculable : true,
                //     xAxis : [
                //         {
                //             //取消显示坐标轴,坐标轴刻度,坐标值
                //             show: false,
                //             triggerEvent:true,
                //             type: 'category',
                //             boundaryGap: false,
                //             // data: ['周一','周二','周三','周四','周五','周六','周日'],
                //             axisLabel: {
                //                 color: "#fff",  //刻度线标签颜色
                //                 show: false,
                //
                //             },
                //             position:'top',
                //             offset:-150,
                //             axisLine:{
                //                 show:false
                //             },
                //             // 取消坐标轴刻度线
                //             axisTick: {
                //                 show: false
                //             },
                //             //取消网格线
                //             splitLine: {
                //                 show: false
                //             }
                //
                //
                //         }
                //     ],
                //     yAxis : [
                //         {
                //             //取消显示坐标轴,坐标轴刻度,坐标值
                //             show: false,
                //             min:60,
                //             max:120,
                //
                //             type : 'value',
                //             splitLine:false,
                //             axisLabel: {
                //                 color: _that.sex==1 ?'#0dbfee':"#ef00a8"  //刻度线标签颜色
                //             },
                //         }
                //     ],
                //     label:{
                //         color:"#fff"
                //     },
                //     series : [
                //         {
                //             name:'卡路里',
                //             type:'line',
                //             color:_that.sex==1 ?'#8644f2':'#ef00a8',
                //             smooth:true,//设置折线图平滑
                //             data:_that.zData,
                //             symbol:'none',
                //             areaStyle: {
                //                 origin:'end',
                //                 color:_that.sex==1 ?'#3f29b5':'#ef00a8'
                //             },
                //
                //             itemStyle : { normal: {
                //                 label : {show: false}
                //             }}
                //         }
                //
                //     ]
                // };
                // if(this.isIphoneX || this.isIphoneXr || this.isIphoneXsMax){
                //     $("#zx_chat").height($("#zx_chat").height()+30)
                // }
                // // if(this.isIphoneX){
                // //     $("#zx_chat").height($("#zx_chat").height()+60)
                // // }
                // let zxChart = _that.echarts.init(document.getElementById('zx_chat'));
                // zxChart.setOption(option);



            },
            //环形图
            runCirlce(p){
                // 环形图//percents 为百分比的值  范围 0- 1
                let that=this;
                Cirlce.run(
                    {
                        obj:'echarts',
                        url:'static/images/i14.png',   //小图地址rgba(55,68,167,1)
                        percent:p>1 ? 1 : p,
                        circleBottomColor:that.sex==1 ? ' rgba(55,68,167,1)':'rgba(116,30,150,0.5)',
                        innerColorStart:that.sex==1 ? ' #0dbfee':'#f8c068',
                        innerColorEnd:that.sex==1 ? ' #8b39f1':'#e52556'
                    }
                );
            },
            //打开运动弹框
            openPlay(){
                this.showPlay=true;
                this.playActive=0;
                let d=this.currentY+"-"+this.currentM+"-"+this.currentD;
                this.getRecordSport(d);
                this.getCategorySport();
            },
            //打开用餐弹框
            openMeal(type){
                this.showFood=true;
                this.foodActive=0;
                this.currentMealtype=type;
                let d=this.currentY+"-"+this.currentM+"-"+this.currentD;
                this.getRecordFood(d,this.currentMealtype);
                this.getCategoryFood();

            },
            //食物搜索
            onSearchFood(){
                api.searchFood(this.searchFoodKey).then(res=>{
                    if(res.code=='2000'){
                        this.foodList=res.result;
                    }
                }).catch(err=>{
                    this.$toast.fail('获取运动列表失败')
                })
            },
            //运动搜索
            onSearchPlay(){
                api.searchSport(this.searchPlayKey).then(res=>{
                    if(res.code=='2000'){
                        this.playList=res.result;
                    }
                }).catch(err=>{
                    this.$toast.fail('获取运动列表失败')
                })
            },
            //从食物已打卡移除
            removefoodFromMyCard(id){
                this.$dialog.confirm({
                    title: '确认删除当前食物打卡?',
                }).then(() => {
                    let d=this.currentY+"-"+this.currentM+"-"+this.currentD;
                    api.deleteFood(id).then(res=>{
                        if(res.code=='2000'){
                            this.$toast.success('删除成功');
                            // 更新已打卡
                            this.getRecordFood(d,this.currentMealtype);
                            this.getIndexDetail(d)
                        }else{
                            this.$toast.fail(res.msg)
                        }
                    })
                }).catch(() => {
                    // on cancel
                });

            },
            //从运动已打卡移除
            removeplayFromMyCard(id){
                this.$dialog.confirm({
                    title: '确认删除当前运动打卡?',
                }).then(() => {
                    let d=this.currentY+"-"+this.currentM+"-"+this.currentD;
                    api.deletePlay(id).then(res=>{
                        if(res.code=='2000'){
                            this.$toast.success('删除成功');
                            // 更新已打卡
                            this.getRecordSport(d);
                            this.getIndexDetail(d)
                        }else{
                            this.$toast.fail(res.msg)
                        }
                    })
                }).catch(() => {
                    // on cancel
                });
            },
            //运动增加到常用
            addToMyplay(obj){
                //this.playList[i].num++;
                this.showSelectUnit=true;
                this.unitPlaceholder=obj.name+'时间';
                this.currentUnitModel='play',
                this.currentSelectid=obj.id,
                this.unitNum='';
                this.unitArr=[{'name':'分钟','id':'1'}];

                this.hideNativetab(true)
            },
            //饮食增加到已打卡(显示弹框)
            addToMyFood(obj){
                //this.foodList[i].num++;
                this.showSelectUnit=true;
                this.unitPlaceholder=obj.name;
                this.currentUnitModel='food',
                this.currentSelectid=obj.id,
                this.unitNum='';
                this.unitArr=[];
                obj.unitInfos.map(res=>{
                    let obj={};
                    obj.id=res.id;
                    obj.name=res.name;
                    obj.description=res.description;
                    this.unitArr.push(obj)
                })
                this.hideNativetab(true);

            },
            // 饮食移除到常用
            removeFromMyFood(i,id){
                //this.foodList[i].num--;
            },
            removeFromMyplay(i,id){
                //this.playList[i].num--;
            },
            //返回主页面
            onClickBack(){
                this.showShare=false
            },
            //完成分享
            onClickDown(){
                this.showShare=false
            },
            //键盘输入事件
            onInputkeyboard(value){
                this.unitNum+=value;
            },
            //键盘删除事件
            onDeletekeyboard(value){
                this.unitNum=this.unitNum.substring(0,this.unitNum.length-1)
            },
            //点击完成选择并关闭键盘的时候
            completeKeyboard(){
                if(this.unitNum=='' || parseFloat(this.unitNum)==0){
                    this.$toast('输入框不能为空');
                }else{
                    let d=this.currentY+"-"+this.currentM+"-"+this.currentD;
                    if(this.currentUnitModel=='food'){
                        api.foodMark(d,this.currentSelectid,this.unitNum,this.currentMealtype,this.unitArr[this.selectedUnit].id).then(res=>{
                            if(res.code=='2000'){
                                this.$toast.success('食物打卡成功');
                                this.foodActive=0;
                                // 更新已打卡
                                this.getRecordFood(d,this.currentMealtype);
                                this.getIndexDetail(d)
                            }else{
                                this.$toast.fail(res.msg)
                            }
                        })
                    }else{
                        api.sportMark(d,this.unitNum,this.currentSelectid).then(res=>{
                            if(res.code=='2000'){
                                this.$toast.success('运动打卡成功');
                                this.playActive=0;
                                // 更新已打卡
                                this.getRecordSport(d);
                                this.getIndexDetail(d)
                            }else{
                                this.$toast.fail(res.msg)
                            }
                        })
                    }
                    this.showSelectUnit=false;
                    this.unitNum='';
                    this.selectedUnit=0;
                    this.hideNativetab(false);
                }

            },

            //体重键盘输入事件
            onInputkeyboardWeight(value){
                if(value=='.'){
                    if(this.currentWeight.indexOf(".") == -1){
                        this.currentWeight+=value;
                    }
                }else{
                    this.currentWeight+=value;
                }



            },
            //体重键盘删除事件
            onDeletekeyboardWeight(value){
                this.currentWeight=this.currentWeight.substring(0,this.currentWeight.length-1)
            },
            //体重点击完成选择并关闭键盘的时候
            completeKeyboardWeight(){
                if(this.currentWeight=='' || parseFloat(this.unitNum)==0){
                    this.$toast('输入框不能为空');
                }else{
                    let d=this.currentY+"-"+this.currentM+"-"+this.currentD;
                    // console.log(this.currentWeight);
                    // console.log(this.selectedWeightUnit);
                    api.weightMark(d,this.currentWeight).then(res=>{
                        if(res.code=='2000'){
                            this.$toast.success('体重打卡成功');
                            // 重新获取数据
                            setTimeout(()=>{
                                this.getRecordayMonth();
                                this.getIndexDetail(d)
                            },500)


                        }else{
                            this.$toast.fail(res.msg)
                        }
                        this.showTizhongCard=false;
                        this.currentWeight='';
                        this.selectedWeightUnit=0;
                        this.hideNativetab(false);
                    })
                }

            },
            //接口获取首页打卡详情后渲染
            getIndexDetail(date){
                var that=this;
                api.getIndexDetail(date).then(res=>{
                    if(res.code=='2000'){
                        this.indexDetail=res.result;
                        setTimeout(function () {
                            that.runCirlce(parseFloat(that.indexDetail.foodInputPercentage)/100);

                        },1500)

                    }
                }).catch(err=>{
                    this.$toast.fail('获取详情失败')
                })
            },
            //// 赋值折线图数据(打卡记录体重接口)
            getWeightRecord(startDate,endDate){
                api.getWeightRecord(startDate,endDate).then(res=>{
                    this.zData=[]
                    if(res.code=='2000'){
                        if(res.result){
                            if(res.result.length==0){
                                this.zData=[60,60,60]
                            }
                            else if(res.result.length==1){
                                this.zData.push(res.result[0].weight);
                                this.zData.push(res.result[0].weight);
                            }else{
                                res.result.map(res=>{
                                    this.zData.push(res.weight);
                                })
                            }
                        }
                        //折线图渲染
                        setTimeout(()=>{
                            this.drawZhexian();
                        },1000)
                    }

                }).catch(err=>{
                   // this.$toast.fail('获取体重详情失败')
                })
            },
            //获取食物类别
            getCategoryFood(){
                api.getCategoryFood().then(res=>{
                    if(res.code=='2000'){
                        this.foodCategory=res.result;
                        //获取第一个类别下的list
                        this.getFoodListById(res.result[0].id,0)
                    }
                }).catch(err=>{
                    this.$toast.fail('获取食物类别失败')
                })
            },
            //获取已经打卡食物
            getRecordFood(date,type){
                api.getRecordFood(date,type).then(res=>{
                    if(res.code=='2000'){
                        this.allreadyfoodList=res.result;
                    }
                }).catch(err=>{
                    this.$toast.fail('获取已经打卡食物失败')
                })
            },
            //获取运动类别
            getCategorySport(){
                api.getCategorySport().then(res=>{
                    if(res.code=='2000'){
                        this.sportCategory=res.result;
                        //获取第一个类别下的list
                        this.getPlayListById(res.result[0].id,0)

                    }
                }).catch(err=>{
                    this.$toast.fail('获取运动类别失败')
                })
            },
            //获取已打卡运动
            getRecordSport(date){
                this.allreadyplayList=[];
                api.getRecordSport(date).then(res=>{
                    if(res.code=='2000'){
                        this.allreadyplayList=res.result;
                    }
                }).catch(err=>{
                    this.$toast.fail('获取已打卡运动失败')
                })
            },
            //根据类别获取食物
            getFoodListById(id,index){
                this.currentFoodTab=index;
                api.getFoodListById(id).then(res=>{
                    if(res.code=='2000'){
                        this.foodList=res.result;
                    }
                }).catch(err=>{
                    this.$toast.fail('获取食物列表失败')
                })
            },
            //根据类别获取运动
            getPlayListById(id,index){
                this.currentPlayTab=index;
                api.getPlayListById(id).then(res=>{
                    if(res.code=='2000'){
                        this.playList=res.result;
                    }
                }).catch(err=>{
                    this.$toast.fail('获取运动列表失败')
                })
            },
            //调用native方法分享
            shareToNative(type){
                // 0 朋友圈  1 微信好友  2 微信收藏  3 facebook
                   // let url='https://app.derekzhu.site/html/#/height';
                    let url=location.origin+location.pathname+"#/share?loginName="+this.userInfo.baseInfo.loginName;
                    let title='体重管家';
                    let content='体重管家体重管家体重管家';
                    let image='https://app.derekzhu.site/html/static/images/test2.jpg';
                    window.xy.share(type, url, title, content, image,
                        function(result){

                        }, function(result){

                        }
                    );
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
    #index{
        min-height: 100vh;
        position: relative;
        background-image:  linear-gradient(140deg, #e60599 10%,#6b088e 40%, #1e0a86 90%);
        /*padding:0 px2rem(68px) px2rem(200px) px2rem(68px);*/
        padding:0 0 px2rem(200px) 0;
        &.men{
            background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
        }
        .index_top{
            position: relative;
            z-index: 9;
            padding: px2rem(55px) px2rem(60px) 0 px2rem(60px);
            padding-top: px2rem(55px);
            .index_tip{
                display: flex;
                margin-bottom: px2rem(10px);
                span{
                    display: block;
                }
                p{
                    padding-left: px2rem(30px);

                    b{
                        display: block;
                        margin-bottom: px2rem(10px);
                        font-size: px2rem(42px);
                        color: #fff;
                    }
                    small{
                        display: block;
                        color: #fff;
                        font-size: px2rem(32px);
                        opacity: 1;
                    }
                }
                .dscroll{
                    width: px2rem(850px);
                    height: auto;
                    padding: 0
                }
            }
            .date{
                margin-top: px2rem(50px);
                .date_top{
                    display: flex;
                    justify-content: space-between;
                    span{
                        color: #fff;
                    }
                    i{

                    }
                }
            }
            .date_list{
                width: 100%;
                overflow-x: scroll;
                ul{
                    width: px2rem(3800px);
                    li{
                        float: left;
                        width: px2rem(110px);
                        height: px2rem(110px);
                        margin: px2rem(20px) 0;
                        line-height: px2rem(110px);
                        text-align: center;
                        color: #fff;
                        opacity: .5;
                        span{
                            font-size: px2rem(42px);
                        }

                        &.active{
                            position: relative;
                            opacity: 1;
                            span{
                                display: block;
                                text-align: center;
                                width: px2rem(60px);
                                height: px2rem(60px);
                                line-height: px2rem(60px);
                                margin-left: px2rem(25px);
                                margin-top: px2rem(25px);
                                background: #fd6162;
                                border-radius: 50%;
                            }
                        }
                        &.isToday{
                            position: relative;
                            opacity: 1;

                            span{
                                display: block;
                                text-align: center;
                                width: px2rem(60px);
                                height: px2rem(60px);
                                line-height: px2rem(60px);
                                margin-left: px2rem(25px);
                                margin-top: px2rem(25px);
                                background: #fd6162 !important;
                                border-radius: 50%;
                            }
                        }
                        &.isSelected{
                            opacity: 1;
                            position: relative;
                            span{
                                display: block;
                                text-align: center;
                                width: px2rem(60px);
                                height: px2rem(60px);
                                line-height: px2rem(60px);
                                margin-left: px2rem(25px);
                                margin-top: px2rem(25px);
                                &::after{
                                    content: "" !important;
                                    position: absolute !important;
                                    display: block !important;
                                    left: px2rem(38px) !important;
                                    width:px2rem(30px) !important;
                                    height:px2rem(20px) !important;
                                    /*border-left: 2px solid #fd6162;*/
                                    border-bottom: 2px solid #fd6162 !important;
                                    top:px2rem(70px) !important;
                                }
                            }
                        }

                    }
                }
                &.men{
                    ul{
                        li{
                            &.active{
                                span{
                                    background: rgb(246, 0, 169);
                                }
                            }
                            &.isToday{
                                span{
                                    background: rgb(246, 0, 169);
                                }
                            }
                            &.isSelected{
                                opacity: 1;
                                position: relative;
                                span{

                                    &::after{
                                        border-color:rgb(246, 0, 169);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .top_chart{
            width: 100%;
            height: px2rem(700px);
            position: absolute;
            left: 0;
            top:0;
            display: none;
        }
        .bolang{
            width: 100%;
            margin-top: px2rem(60px);
            overflow: hidden;
            .bolang_inner{
                width:80000px;
                animation: run 1600s linear infinite;
                img{
                    width: 800px;
                }

                @keyframes run {
                    0%{transform: translateX(0%)}
                    100%{transform: translateX(-100%)}
                }
            }

        }
        .current_data{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: px2rem(60px);
            position: relative;
            z-index: 9;
            margin-top: px2rem(-150px);
            &>span{

                b{
                    display: block;
                    font-size: px2rem(64px);
                    color: #fff;
                    font-weight: bold;
                    text-align: center;
                    small{
                        font-size: px2rem(42px);
                        padding-left: px2rem(12px);
                    }
                }
                span{
                    display: block;
                    font-size: px2rem(36px);
                    color: #fff;
                    opacity: .8;
                    margin-top: px2rem(18px);
                }

            }
        }
        .index_center{
            position: relative;
            margin-top: px2rem(-100px);
            padding: 0 px2rem(60px);
            .center_canvas{
                position: absolute;
                left: 50%;
                top:0;
                z-index: 4;
                transform: translateX(-50%);
            }
            .center_inner{
                position: absolute;
                background: linear-gradient(140deg,#8F0791 0%, #41098A 90%);

                /*background: rgba(255,255,255,0.1);*/
                width: px2rem(600px);
                height: px2rem(600px);
                border-radius: 50%;
                top:px2rem(200px);
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                z-index: 5;
                &.femen{
                    background-image: linear-gradient(140deg, #a90693 10%,#820890 90%);
                }
                &.men{
                    /*background: rgba(55,68,167,1);*/
                    /*background:#22247C;*/
                    background-image: linear-gradient(140deg, #292B99 10%,#202273 90%);
                }
                span{
                    position: absolute;
                    z-index:6 ;
                    display: block;
                    text-align: center;
                    font-weight: bold;
                    font-size: px2rem(56px);
                    line-height: px2rem(60px);
                }
                img{
                    position: absolute;
                    width: 50%;
                    left: 25%;
                    top:25%;
                    &.c1{
                        animation:r1 4s linear infinite;
                    }
                    &.c2{
                        animation:r2 4s linear infinite;
                    }
                    @keyframes r1 {
                        0% {
                            transform: rotate(0deg);
                        }

                        25% {
                            transform: rotate(90deg);
                        }

                        50% {
                            transform: rotate(180deg);
                        }

                        75% {
                            transform: rotate(270deg);
                        }

                        100% {
                            transform: rotate(360deg);
                        }
                    }
                    @keyframes r2 {

                        0% {
                           transform: rotate(0deg);
                        }

                        25% {
                            transform: rotate(-90deg);
                        }

                        50% {
                           transform: rotate(-180deg);
                        }

                        75% {
                            transform: rotate(-270deg);
                        }

                        100% {
                            transform: rotate(-360deg);
                        }
                    }
                }
            }
            .chart2{
                position: relative;
                z-index:6;
                display: flex;
                justify-content: center;
                transform: scale(0.7);
                #echarts{
                    width: px2rem(1000px);
                    height: px2rem(1000px);
                }
            }
        }
        .daka_detail_top{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: px2rem(35px) 0;
            margin-top: px2rem(-100px);
            padding: 0 px2rem(60px);
            span{
                display: block;
                display: flex;

                i{
                    font-size: px2rem(100px);
                }
                b{
                    font-size: px2rem(42px);
                    color: #f600a9;
                    text-align: center;
                    padding-top: px2rem(10px);
                    margin-left: px2rem(20px);
                    font-weight: bold;
                    small{
                        display: block;
                        color: #fff;
                        text-align: center;
                        margin-top: px2rem(15px);
                    }
                }
            }
            span:nth-child(2){
                b{
                    color: #4890ff;
                }
            }
        }
        .daka_detail_item{
            padding: 0 px2rem(60px);
            margin-top: px2rem(105px);
            &>article{
                display: flex;
                color: #fff;
                font-size: px2rem(42px);
                align-items: center;
                i{
                    font-size:px2rem(60px) ;
                    margin-right: px2rem(25px);
                }
            }
            ul{
                margin: px2rem(50px) 0;
                li{
                    background:url("../assets/images/s_bg.png") repeat;
                    border-radius: px2rem(20px);
                    box-sizing: border-box;
                    margin-bottom: px2rem(30px);
                    height: px2rem(240px);
                    width: 100%;
                    display: flex;
                    align-items: center;
                    padding: 0 px2rem(70px);
                    span.s1{
                        margin-right: px2rem(40px);
                        i{
                            font-size: px2rem(80px);
                        }
                    }
                    span.s2{
                        font-size: px2rem(36px);
                        color: #fff;
                        width: 80%;
                        article{
                            margin-bottom: px2rem(17px);
                            font-size: px2rem(46px);
                            position: relative;
                            padding-left: px2rem(30px);
                            &::before{
                                content: "";
                                width: px2rem(15px);
                                height: px2rem(15px);
                                background: #f600a9;
                                border-radius: 50%;
                                position: absolute;
                                left: 0;
                                top:px2rem(10px);
                            }
                        }
                        p{
                            font-size: px2rem(38px);
                        }
                    }
                    span.s3{
                        text-align: right;
                        color: #fff;
                        font-size: px2rem(42px);
                        small{
                            color: #f600a9;
                            display: block;
                            font-size: px2rem(36px);
                            padding-top: px2rem(20px);
                        }
                    }
                    &::after{
                        content: "";
                        clear: both;
                        display: block;
                    }

                }
            }
            ul.t2{
                li{
                    span.s2{
                        article{
                            &::before{
                                content: "";
                                width: px2rem(15px);
                                height: px2rem(15px);
                                background: #487dec;
                                border-radius: 50%;
                                position: absolute;
                                left: 0;
                                top:px2rem(10px);
                            }
                        }
                    }
                    span.s3{
                        text-align: right;
                        color: #fff;
                        font-size: px2rem(42px);
                        small{
                            color: #487dec;
                            display: block;
                            font-size: px2rem(36px);
                            padding-top: px2rem(20px);
                        }
                    }
                    &::after{
                        content: "";
                        clear: both;
                        display: block;
                    }
                }
            }
        }
        /*打卡弹窗*/
        .pClass{
            background: none;

        }
        .play_con{
            background: #080324;
            border-radius: px2rem(150px) px2rem(150px) 0 0;
            height: px2rem(1500px);
            padding-bottom: px2rem(200px);
            .play_con_top{
                width: 100%;
                display: flex;
                justify-content: center;
                li{
                    width: 50%;
                    height: px2rem(150px);
                    line-height: px2rem(150px);
                    text-align: center;
                    color: #fff;
                    span{
                        padding-bottom: px2rem(20px);
                    }
                    &.active{
                        span{
                            border-bottom: 1px solid #fff;
                        }
                    }

                }

            }
            .play_con_list1{
                padding: px2rem(45px);
                overflow-y: scroll;
                height: 100%;
                ul{
                    li{
                        display: flex;
                        background: url("../assets/images/s_bg.png") repeat;
                        padding: px2rem(40px);
                        border-radius: px2rem(100px);
                        align-items: center;
                        position: relative;
                        z-index: 2;
                        span{
                            &.s1{
                                display: block;
                                border-radius: 50%;
                                overflow: hidden;
                                i{
                                    font-size: px2rem(120px);
                                    border-radius: 50%;
                                    img{
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                            }
                            &.s2{
                                display: block;
                                flex: 4;
                                margin-left: px2rem(50px);
                                b{
                                    font-size: px2rem(42px);
                                    display: block;
                                    margin-bottom: px2rem(22px);
                                    color: #fff;
                                }
                                small{
                                    display: block;
                                    color: #fff;
                                    font-size: px2rem(36px);
                                    position: relative;
                                    padding-left: px2rem(40px);
                                    &::before{
                                        position: absolute;
                                        content: "";
                                        display: block;
                                        top:px2rem(10px);
                                        left: 0;
                                        width: px2rem(20px);
                                        height: px2rem(20px);
                                        border-radius: 50%;
                                        background: #f600a9;
                                    }
                                }
                            }
                            &.s3{
                                color: #f600a9;
                                font-size: px2rem(36px);
                                flex: 1;
                                font-weight: bold;

                            }
                        }

                    }
                    .pList1{
                        margin-bottom: px2rem(40px);
                        background: url("../assets/images/s_bg.png") repeat;
                        border-radius: px2rem(100px);
                        .del_icon{
                            font-size: 30px;
                            padding-top:px2rem(60px);
                            padding-left: 15px
                        }

                    }
                }
            }
            .play_con_list2{

                overflow-y: scroll;
                height: 100%;
                .inSearch{
                    background: none !important;
                    border-bottom:px2rem(1px) solid rgba(255,255,255,0.16);
                    padding-bottom: px2rem(80px);
                    i{
                        color: #fff;
                    }
                    input{
                        color: #fff !important;
                        &::placeholder{
                            color: #fff;
                        }
                    }
                    .van-search__content{
                        background: #171231;

                    }
                }
                .play_con_list2_inner{
                    display: flex;

                    .play_con_list2_inner_l{
                        flex: 2;
                        border-right: px2rem(1px) solid rgba(255,255,255,0.16);
                        padding-bottom: px2rem(100px);
                        padding-top: px2rem(50px);
                        overflow-y: scroll;
                        height: px2rem(1000px);
                        li{
                            text-align: center;
                            height: px2rem(135px);
                            line-height: px2rem(135px);
                            font-size: px2rem(40px);
                            text-align: center;
                            opacity: .4;
                            color: #fff;
                            &.active{
                                color: #fff;
                                opacity: 1;
                            }
                        }
                    }
                    .play_con_list2_inner_r{
                        flex: 5;
                        overflow-y: scroll;
                        height: px2rem(1150px);
                        ul{
                            padding-bottom: px2rem(100px);
                            padding: px2rem(70px) px2rem(30px) px2rem(150px) px2rem(30px);
                            li{
                                display: flex;
                                background: url("../assets/images/s_bg.png") repeat;
                                padding: px2rem(40px) px2rem(35px);
                                border-radius: px2rem(100px);
                                align-items: center;
                                margin-bottom: px2rem(40px);
                                span{
                                    &.s1{
                                        display: block;
                                        border-radius: 50%;
                                        overflow: hidden;
                                        i{
                                            font-size: px2rem(120px);
                                            border-radius: 50%;
                                            img{
                                                width: 100%;
                                                height: 100%;
                                            }
                                        }
                                    }
                                    &.s2{
                                        display: block;
                                        flex: 10;
                                        margin-left: px2rem(30px);
                                        b{
                                            font-size: px2rem(40px);
                                            display: block;
                                            margin-bottom: px2rem(22px);
                                            color: #fff;
                                        }
                                        small{
                                            display: block;
                                            color: #fff;
                                            font-size: px2rem(32px);
                                            position: relative;
                                            padding-left: px2rem(30px);
                                            &::before{
                                                position: absolute;
                                                content: "";
                                                display: block;
                                                top:px2rem(5px);
                                                left: 0;
                                                width: px2rem(20px);
                                                height: px2rem(20px);
                                                border-radius: 50%;
                                                background: #f600a9;
                                            }
                                        }
                                    }
                                    &.s3{
                                        i{
                                            font-size: px2rem(48px);
                                            padding-left: px2rem(20px);
                                            padding-right: px2rem(20px);

                                        }
                                        color: #fff;
                                        height: px2rem(120px);
                                        line-height: px2rem(120px);
                                        vertical-align: middle;
                                        flex: 3;
                                        font-weight: bold;
                                        text-align: right;
                                        display: flex;
                                        justify-content: flex-end;
                                        align-items: center;
                                        small{
                                            font-size: px2rem(36px);
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //分享弹窗
        .sharepop{
            width: 100%;
            height: 100%;
            background-image:  linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
            background-size: 100% 100%;
            overflow-y: scroll;
            &.men{
                background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);

            }
            .share{
                width: 100%;
                height: 100%;
                .share_top{
                    padding-top: px2rem(80px);
                    .van-nav-bar{
                        background: none;
                        div{
                            color: #fff;
                        }
                        &::after{
                            display: none;
                        }
                        i{
                            color: #fff;
                        }
                        span{
                            color: #fff;
                        }
                    }
                }
                .share_con{

                    .share_con_top{
                        position:relative;
                        text-align: center;
                        img{
                            width: 90%;
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
                        margin-top: px2rem(15px);
                        padding:px2rem(15px) px2rem(85px);
                        .share_item{
                            border-bottom: px2rem(2px) solid #6435a0;
                            color: #fff;
                            padding: px2rem(30px) 0;
                            justify-content: center;
                            height: px2rem(120px);
                            line-height: px2rem(120px);

                            i{
                                color: #fff;
                                vertical-align: middle;
                            }
                            .i1{
                                font-size: px2rem(80px);

                            }
                            .i2{
                                font-size: px2rem(50px);
                            }
                        }
                    }

                }
            }
        }


    }


</style>
