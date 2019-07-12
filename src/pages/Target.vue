<template>
  <div id="target" :class="sex == '1' ? 'men':''">
    <div class="top">
      <div  @click="pushRouter('personal')">
        <div class="img" :class="sex == '1' ? 'men':''">
          <img :src="sex == '1' ? 'static/images/male.png':'static/images/female.png'" alt="">
        </div>
        <div class="text">
          {{loginName}}
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
        我的目标
      </div>
      <!-- 30->200    80->100   -->
      <div class="process" :class="sex === '1' ? 'men':''">
        <div class="t" :style="{left:((bodyData.weight-30)/170*100 > 100 ? 96 : (bodyData.weight-30)/170*100) + '%'}"><img src="../assets/images/t.png" alt=""></div>
        <div class="tip" :class="sex === '1' ? 'men':''" :style="{left:((bodyData.weight-30)/170*100 > 100 ? 90 : (bodyData.weight-30)/170*100 - 4) + '%'}">{{bodyData.weight}}kg</div>
        <div class="inner" :style="{marginLeft:(bodyData.healthWeightStart-30)/170*100 + '%',width:(bodyData.healthWeightEnd-bodyData.healthWeightStart)/170*100 + '%'}"><span v-show="(bodyData.healthWeightEnd-bodyData.healthWeightStart)/170*100 > 20">标准范围</span></div>
      </div>
      <div class="des">{{targetInfo.targetWeekNum}}周{{targetInfo.target == '1' ? '减轻重量' : targetInfo.target == '2' ? "塑形" : targetInfo.target == '3' ? "增加肌肉" : "脂肪燃烧"}}{{targetInfo.computeTargetWeightDifference}}KG</div>
      <div class="imgs">
        <div class="bgimg" :class="sex === '1' ? 'men':''">
          <div class="content" @click="gotoNewWindow">
            <img src="../assets/images/c6.png" alt="">设置体重目标
          </div>
        </div>
        <div class="bgimg r" :class="sex === '1' ? 'men':''" @click="pushRouter('advise')">
          <div class="content" :class="sex === '1' ? 'men':''">
            <img src="../assets/images/i8.png" style="width:auto;" alt="">饮食及运动<br> 建议
          </div>
        </div>
      </div>
    </div>
    <div class="card card2">
      <div class="tit">我的身体数据</div>
      <div class="wrap">
        <div class="item">
          <div class="left" :class="sex === '1' ? 'men':''">BMI</div>
          <div>{{bodyData.bmiValue}}</div>
        </div>
        <div class="item">
          <p class="btn" :class="sex === '1' ? 'men':''" @click="pushRouter('body-data')">详细报告</p>
        </div>
        <div class="item">
          <div class="right">身体类型</div>
          <div>{{bodyData.bodyType == '1' ? '有些偏瘦' : bodyData.bodyType == '2' ? "非常标准" : bodyData.bodyType == '3' ? "有些偏胖" : "属于肥胖型"}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../fetch/api'
import { obj } from '../util/tool'
export default {
  data() {
    return {
        sex:localStorage.selectSex,
        currentWeek:[],
        loginName:'',
        targetInfo:{},
        bodyData:{}
    };
  },
  methods: {
    init(){
      let week = new Date().getDay();
      this.currentWeek.length = 0;
      for (let index = 1; index <= 7; index++) {
        this.currentWeek.push(obj.getWeekDay(-week+index));
      }
      this.getUserInfo();
      this.getBodyData();
    },
    pushRouter(path) {
      this.$router.push({ path });
    },
    getBodyData(){
      api.getBodyData().then(res=>{
        console.log(res);
        this.bodyData = res.result;
      })
    },
    getUserInfo(){
      api.getUserInfo().then(res=>{
          this.loginName = res.result.baseInfo.loginName;
          this.targetInfo = res.result.targetInfo;
          localStorage.myWeight=res.result.targetInfo.weight;
          localStorage.sex=res.result.baseInfo.sex==2 ? 0 :1;
          localStorage.selectSex=res.result.baseInfo.sex==2 ? 0 :1;
          localStorage.myWeek=res.result.targetInfo.targetWeekNum;
          localStorage.myType=res.result.targetInfo.target;
          localStorage.myHeight=res.result.baseInfo.height;
          localStorage.myGoalWeight=res.result.targetInfo.targetWeight;
          localStorage.myDay=new Date(res.result.baseInfo.birth).getDate();
          localStorage.myMonth=parseInt(new Date(res.result.baseInfo.birth).getMonth())+1;
          localStorage.myYear= new Date(res.result.baseInfo.birth).getFullYear();
      })
    },
    //打开新的webview
    gotoNewWindow(){
      let url=location.origin+location.pathname+"#/goalWeight?from=target";
        window.xy.openWindow(url)
    }
  },
  mounted() {
    this.init();
    let that=this;
    window.initTargetData =function () {
        that.init();
    }
  },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            //设置body颜色
            if(this.sex=='1' || this.sex==1){$('body').addClass('men').removeClass('nosafePadding');}
        })
    },
    create(){
        if(this.$route.query.token && typeof this.$route.query.token !='undefined' && this.$route.query.token!=null){
            localStorage.setItem('token',this.$route.query.token)
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/function";
#target {
    position: relative;
    background-image:  linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
    margin-bottom: px2rem(200px);
    font-family: "黑体";
  &.men{
    background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
  }
  min-height:100%;
  padding-bottom: px2rem(114px);
  .top {
    margin-bottom: px2rem(60px);
    height: px2rem(360px);
    position: relative;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
      margin: 0 auto;
      width: px2rem(200px);
      height: px2rem(200px);
      border: 3px solid #d804b8;
      border-radius: 50%;
      img {
        width: px2rem(200px);
        height: px2rem(200px);
        border-radius: 50%;
      }
      &.men{
        border: 3px solid #682bcc;
      }
    }
    .text {
      margin-top: px2rem(20px);
      text-align: center;
      font-size: 14px;
      font-family: "PingFangSC-Regular";
      color: #fff;
    }
  }
  .card {
    width: px2rem(985px);
    height: px2rem(710px);
    padding: px2rem(100px) px2rem(80px);
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: 10px;
    background: rgba($color: #fff, $alpha: 0.05);
    .tit {
      font-size: px2rem(36px);
      color: #fff;
      padding-bottom: px2rem(60px);
    }
    .des {
      font-size: px2rem(34px);
      color: #fff;
      padding: px2rem(40px) 0 px2rem(65px) 0;
      text-align: center;
    }
    .process {
      height: px2rem(60px);
      background: #ff295f;
      border-radius: 30px;
      position: relative;
      width: 100%;
      &.men{
        background: #1A95DB;
        .inner{
          background: #115BEF;
        }
      }
      .tip{
        position: absolute;
        font-size: px2rem(26px);
        background: #ff295f;
        color: #fff;
        height: px2rem(46px);
        display: flex;
        align-items: center;
        padding:0 px2rem(16px);
        border-radius: 10px;
        top: px2rem(-60px);
        z-index: 111;
        &.men{
          background: #1A95DB;
        }
      }
      .t{
        position: absolute;
        >img{
          width: px2rem(17px);
          height: 100%;
        }
      }
      .inner {
        background: #ff9853;
        border-radius: 30px;
        height: 100%;
        box-sizing: border-box;
        padding-top: 2px;
        line-height: px2rem(60px);
        text-align: center;
        color: #fff;
        >span{
          font-size: px2rem(22px);
        }
      }
    }
    .imgs {
      display: flex;
      justify-content: space-between;
      .bgimg {
        width: px2rem(390px);
        height: px2rem(210px);
        background: url("../assets/images/c1.png") no-repeat;
        background-size: contain;
        display: flex;
        align-items: center;
        justify-content: center;
        &.men{
          background: url("../assets/images/cc1.png") no-repeat;
          background-size: contain;
        }
        &:last-child {
          background: url("../assets/images/c2.png") no-repeat;
          background-size: contain;
        }
        &.r.men{
          background: url("../assets/images/cc2.png") no-repeat;
          background-size: contain;
        }
        .content {
          color: #fff;
          font-size: px2rem(30px);
          width: px2rem(280px);
          height: px2rem(105px);
          line-height: 11px;
          display: flex;
          align-items: center;
          > img {
            height: px2rem(70px);
            width: px2rem(70px);
            padding-right: px2rem(26px);
          }
        }
      }
    }
  }
  .card2 {
    margin-top: px2rem(45px);
    height: px2rem(388px);
    .wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      .item {
        > div {
          position: relative;
          padding-left: 15px;
          &.left {
            padding-bottom: px2rem(20px);
            font-size: px2rem(32px);
            &::before {
              content: "";
              position: absolute;
              left: 0;
              top: px2rem(10px);
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #f8376e;
            }
            &.men{
              &::before {
                background: #8644F2;
              }
            }
          }
          &.right {
            padding-bottom: px2rem(20px);
            font-size: px2rem(32px);
            &::before {
              content: "";
              position: absolute;
              left: 0;
              top: px2rem(10px);
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #4890ff;
            }
          }
          &:last-child {
            font-size: px2rem(38px);
            padding-top: 5px;
          }
        }

        &:nth-child(2) {
          .btn {
            font-size: px2rem(32px);
            width: px2rem(169px);
            height: px2rem(60px);
            line-height: px2rem(60px);
            border-radius: 15px;
            text-align: center;
            background: #ff2b5f;
            margin-left: px2rem(50px);
            &.men{
              background: #4CA8DC;
            }
          }
        }
      }
    }
  }
  .date_list {
    width: 100%;
    overflow-x: scroll;
    ul {
      width: px2rem(3800px);
      li {
        float: left;
        width: px2rem(110px);
        height: px2rem(110px);
        margin: px2rem(20px) 0;
        line-height: px2rem(110px);
        text-align: center;
        color: #fff;
        opacity: 0.5;
        &.active {
          position: relative;
          opacity: 1;

          span {
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
        &.isToday {
          position: relative;
          opacity: 1;

          span {
            display: block;
            text-align: center;
            width: px2rem(60px);
            height: px2rem(60px);
            line-height: px2rem(60px);
            margin-left: px2rem(25px);
            margin-top: px2rem(25px);
            background: #5a098d;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>


