<template>
  <div id="body-data" :class="sex === '1' ? 'men':''">
    <div class="nav-top">
      <div class="text"><img src="../assets/images/i4.png" alt="" @click="back()"><span>我的身体数据</span></div>
    </div>
    <div class="top">
      <div class="wrap">
        <span>{{bodyData.score}}</span>
        <font>分</font>
      </div>
      <div class="wrap2">
        <div class="item">
          <p>生理年龄{{bodyData.agePhysiological}}岁</p>
          <p>{{bodyData.weight}}KG</p>
        </div>
        <div class="item">
          <p>实际年龄{{bodyData.age}}岁</p>
          <p>{{bodyData.height}}cm</p>
        </div>
      </div>
    </div>
    <!--折线图-->
    <div class="bolang">
      <div class="bolang_inner">
          <img :src="sex=='1' ? 'static/images/line_m.png' :'static/images/line_w.png'" alt="" v-for="index of 100" :key="index">
      </div>
    </div>
    <div class="card">
      <div class="tit">
        BMI
      </div>
      <div class="bar">
        <div class="outbar outbar2">
          <div class="tip" :style="{left:(bodyData.bmiValue*2 > 100 ? 92 : bodyData.bmiValue*2 - 5)+ '%'}">{{bodyData.bmiValue}}</div>
          <div class="innerbar" :style="{width:(bodyData.bmiValue*2 > 100 ? 100 : bodyData.bmiValue*2) + '%'}"></div>
          <div class="des">
            <span class="t">偏轻 18.5</span>
            <span class="t">健康 24</span>
            <span class="t">超重 28</span>
            <span class="t">肥胖</span>
          </div>
        </div>
      </div>
      <div class="tit">
        体脂率
      </div>
      <div class="bar">
        <div class="outbar">
          <div class="tip" :style="{left:(bodyData.bodyFatRateValue*2 > 100 ? 95 : bodyData.bodyFatRateValue*2 - 5) + '%'}">{{bodyData.bodyFatRateValue}}</div>
          <div class="innerbar" :style="{width:(bodyData.bodyFatRateValue*2 > 100 ? 100 : bodyData.bodyFatRateValue*2) + '%'}"></div>
          <div class="des">
            <span class="t">瘦 11</span>
            <span class="t">标准 21</span>
            <span class="t">微胖 26</span>
            <span class="t">肥胖</span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <p>根据体重指数和体脂率，你的身材{{bodyData.bodyType == '1' ? '有些偏瘦' : bodyData.bodyType == '2' ? "非常标准" : bodyData.bodyType == '3' ? "有些偏胖" : "属于肥胖型"}}</p>
        <p>健康体重范围：{{bodyData.healthWeightStart}}-{{bodyData.healthWeightEnd}}公斤（孕妇和运动员不适用）</p>
      </div>

    </div>
    <div class="card card2">
      <div class="tit">预算卡路里</div>
      <p><span style="color:#5ec993;">{{bodyData.budgetCalories}}</span>kcal</p>
      <p>根据你的身体状况，设定每日卡路里摄入量</p>
    </div>
    <div class="card card2 mb">
      <div class="tit">脂肪燃烧心率</div>
      <p>每分钟<span style="color:#f83a6e;">{{bodyData.fatBurningHeartRateHighStart}}-{{bodyData.fatBurningHeartRateHighEnd}}</span>次</p>
      <p>运动时，心率在这个范围内，油脂燃烧效率是最高的</p>
    </div>
  </div>
</template>

<script>
import api from '../fetch/api'
import { obj } from '../util/tool'
export default {
  data() {
    return {
      barValue: 78,
      bimValue: 43,
      sex:localStorage.selectSex,
      currentWeek:[],
      bodyData:{}
    };
  },
  computed:{},
  methods: {
    back(){
        if (this.$route.query.type && this.$route.query.type != "undefined" && this.$route.query.type=='1') {
            window.xy.gototab('1',
                function (res) {

                },function (error) {
                    alert('error');
                }
            )
        }else{
            window.xy.gototab('0',
                function (res) {

                },function (error) {
                    alert('error');
                }
            )
        }
      //this.$router.go(-1);
    },
    getBodyData(){
      api.getBodyData().then(res=>{
        console.log(res);
        this.bodyData = res.result;
      })
    }
  },
  mounted(){
    $('body').removeClass('nosafePadding');
    if(this.sex==1){
        $('body').addClass('men');
    }else{
        $('body').removeClass('men');
    }
    let week = new Date().getDay();
    this.currentWeek.length = 0;
    for (let index = 1; index <= 7; index++) {
      this.currentWeek.push(obj.getWeekDay(-week+index));
    }
    this.getBodyData();
  }

};
</script>

<style lang="scss" scoped>
@import "../assets/css/function";
#body-data {
    position: relative;
  font-family: "黑体";
    background-image:  linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
  &.men{
    background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
  }
  padding-bottom: px2rem(114px);
  .nav-top {
    padding-top: px2rem(150px);
    width: 100%;
    color: #fff;
    position: relative;
    z-index: 100;
    text-align: center;
    .text{
      span{
        font-size: px2rem(44px);
      }
      img{
        position: absolute;
        left: px2rem(30px);
        top: px2rem(105px);
        transform: rotate(90deg);
        width: px2rem(35px);
      }
    }
  }
  .top {
    color: #fff;
    margin-bottom: px2rem(80px);
    position: relative;
    z-index: 100;
    .wrap {
      height: px2rem(200px);
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        font-size: px2rem(88px);
        color: #ff9854;
        padding-right: 5px;
      }
      > font {
        font-size: px2rem(34px);
        padding-top: px2rem(26px);
        opacity: .7;
      }
    }
    .wrap2 {
      height: px2rem(150px);
      width: 70%;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      .item {
        text-align: center;
        p {
          padding-bottom: px2rem(50px);
          font-size: px2rem(34px);
          opacity: 0.7;
        }
      }
    }
  }
  .card {
    width: px2rem(985px);
    height: px2rem(878px);
    padding: px2rem(100px) px2rem(80px);
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: 10px;
    color: #fff;
    background: rgba($color: #fff, $alpha: 0.05);
    .tit {
      font-size: px2rem(36px);
      color: #fff;
      padding-bottom: px2rem(70px);
    }
    .bar {
      margin-bottom: px2rem(100px);
      .outbar{
        background: rgba(150, 133, 133, 0.4);
        border-radius: 4px;
        height: 8px;
        position: relative;
        &.outbar2{
          .innerbar{
            background: #f9c268;
          }
          .tip {
            background: #ff9853;
          }
        }
        .innerbar{
          position: absolute;
          background: #ff295f;
          border-radius: 4px;
          height: 100%;
        }
        .tip {
          background: #ff295f;
          font-size: px2rem(24px);
          height: px2rem(48px);
          line-height: px2rem(48px);
          padding: 0 px2rem(25px);
          border-radius: px2rem(60px);
          position: absolute;
          top: px2rem(-58px);
          left: -10px;
        }
        .des{
          padding-top: 14px;
          opacity: 0.5;
          >.t{
            position: absolute;
            font-size: px2rem(26px);
            display: flex;
            &:first-child{
              left: 19%;
            }
            &:nth-child(2){
              left: 38%;
            }
            &:nth-child(3){
              left: 56%;
            }
            &:last-child{
              left: 85%;
            }
          }
        }
      }
    }
    .bottom {
      padding-top: px2rem(100px);
      text-align: center;
      color: #fff;
      > p {
        font-size: px2rem(34px);
        &:last-child {
          font-size: px2rem(24px);
          opacity: 0.26;
          padding-top: 10px;
        }
      }
    }
  }
  .card2 {
    margin-top: px2rem(45px);
    height: px2rem(388px);
    > p {
      font-size: px2rem(34px);
      text-align: center;
      &:first-of-type {
        padding-bottom: px2rem(24px);
        > span {
          font-size: px2rem(52px);
        }
      }
    }
  }
}
</style>
