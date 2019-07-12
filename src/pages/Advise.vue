<template>
  <div id="advise" :class="sex === '1' ? 'men':''">
    <div class="nav-top">
      <div class="text"><img src="../assets/images/i4.png" alt="" @click="back()"><span>建议</span>
        <font @click="gotoNewWindow">重置目标</font>
      </div>
    </div>
    <div class="top">
      <p>减脂第{{planBeginDays}}天，距离目标还有</p>
      <div class="wrap">
        <span>{{planRemainingDays}}</span>
        <font>天</font>
      </div>
      <div class="week_list">
        <ul>
          <li v-for="(item,index) in currentWeekDays" :class="new Date().getDate() == item ? 'active':''" :key="index"><span>{{new Date().getDate() == item ? '今天' : item}}</span></li>
        </ul>
      </div>
    </div>

    <!--折线图-->
    <div class="bolang">
      <div class="bolang_inner">
          <img :src="sex=='1' ? 'static/images/line_m.png' :'static/images/line_w.png'" alt="" v-for="index of 100" :key="index">
      </div>
    </div>
    <div class="card">
      <div class="head_top">
        <div class="left">
          <img src="../assets/images/c4.png" alt="">
        </div>
        <div class="center">
          <div>膳食建议</div>
          <div>轻松为您提供了合理的膳食建议，使达成目标事半功倍。</div>
        </div>
        <!-- <div class="right" @click="showModel = true"><i class="iconfont icon-jinru-copy"></i></div> -->
      </div>
      <ul>
        <li>
          <span class="s3">{{breakfast.calories}}<small>kcal</small>
          </span>
          <span class="s2">
            <article>早餐</article>
            <p>{{breakfast.suggest}}</p>
          </span>
          <!-- <span class="s1" @click="refreshFoodSuggest(breakfast.id,breakfast.type)">
            <i class="iconfont icon-shuaxin"></i>
          </span> -->
        </li>
        <li>
          <span class="s3">{{lunch.calories}}<small>kcal</small>
          </span>
          <span class="s2">
            <article>午餐</article>
            <p>{{lunch.suggest}}</p>
          </span>
          <span class="s1" @click="refreshFoodSuggest(lunch.id,lunch.type)">
            <!--<i class="iconfont icon-shuaxin"></i>-->
          </span>
        </li>
        <li>
          <span class="s3">{{dinner.calories}}<small>kcal</small>
          </span>
          <span class="s2">
            <article>晚餐</article>
            <p>{{dinner.suggest}}</p>
          </span>
          <span class="s1" @click="refreshFoodSuggest(dinner.id,dinner.type)">
            <!--<i class="iconfont icon-shuaxin"></i>-->
          </span>
        </li>
      </ul>
    </div>

    <div class="card card2">
      <div class="head_top">
        <div class="left">
          <img src="../assets/images/c5.png" alt="">
        </div>
        <div class="center">
          <div>运动建议</div>
          <div>根据您的身体情况，好为您提供了合理的运动建议</div>
        </div>
      </div>
      <ul>
        <li v-for="item in suportData" :key="item.id">
          <span class="s3">{{item.duration}}<small>min</small>
          </span>
          <span class="s2">
            <article>{{item.suggest}}</article>
            <p>{{item.suggestSub}}</p>
          </span>
          <!-- <span class="s1" @click="showVideo(item.video)">
            <i class="iconfont icon-bofang"></i>
          </span> -->
        </li>
      </ul>
    </div>

    <div class="card card3">
      <div class="head_top">
        <div class="left">
          <img src="../assets/images/c3.png" alt="">
        </div>
        <div class="center">
          <div>减肥禁忌</div>
          <div>健康的生活方式和合理的作息，更有助于达成减脂塑形<br>目标</div>
        </div>
        <!-- <div class="right"><i class="iconfont icon-jinru-copy"></i></div> -->
      </div>
      <ul>
        <li v-for="item in WeightabbotData" :key="item.id">
          <span class="s3">
            <i class="iconfont icon-jinzhi"></i>
          </span>
          <span class="s2">
            <article>{{item.suggest}}</article>
            <p>{{item.suggestSub}}</p>
          </span>
        </li>
      </ul>
    </div>
    <van-dialog className="video" :before-close="beforeClose" v-model="show">
      <video src="https://www.w3cschool.cn/statics/demosource/movie.mp4" controls autoplay class="video" ref="dialogVideo"
        width="100%"></video>
    </van-dialog>

    <!-- <van-popup v-model="showModel" position="bottom" :overlay="true" class="pClass">
      <div class="play_con">
        <div class="play_con_top">
          <li><span>运动建议</span></li>
        </div>
        <div class="play_con_list1">
          <ul>
            <li>
              <span class="s1">
                <van-icon name="static/images/test1.jpg" /></span>
              <span class="s2">
                <b>鸡蛋</b>
                <small>144千卡/100克</small>
              </span>
              <span class="s3">100</span>
            </li>
            <li>
              <span class="s1">
                <van-icon name="static/images/test1.jpg" /></span>
              <span class="s2">
                <b>鸡蛋</b>
                <small>144千卡/100克</small>
              </span>
              <span class="s3">100</span>
            </li>
          </ul>
        </div>
      </div>
    </van-popup> -->

  </div>
</template>

<script>
import api from '../fetch/api'
export default {
  data() {
    return {
      show: false,
      // showModel: false,
      planBeginDays:0,
      planRemainingDays:0,
      sex:localStorage.selectSex,
      breakfast:{},
      lunch:{},
      dinner:{},
      suportData:[],
      WeightabbotData:[],
      currentWeek:[],
      currentWeekDays:[],
      weightData:[],

    };
  },
  methods: {
    init(){
      this.getUserInfo();
      this.getFoodSuggest();
      this.getSuportSuggest();
      this.getWeightabbot();
    },
    getFoodSuggest(){
      api.getFoodSuggest().then(res=>{
        this.breakfast = res.result.breakfast;
        this.lunch = res.result.lunch;
        this.dinner = res.result.dinner;
      })
    },
    getSuportSuggest(){
      api.getSuportSuggest().then(res=>{
        this.suportData = res.result;
      })
    },
    getUserInfo(){
      api.getUserInfo().then(res=>{
        this.planBeginDays = res.result.targetInfo.planBeginDays;
        this.planRemainingDays = res.result.targetInfo.planRemainingDays;
        localStorage.myWeight=res.result.targetInfo.weight
      })
    },
    getWeightabbot(){
      api.getWeightabbot().then(res=>{
        this.WeightabbotData = res.result;
      })
    },
    showVideo(url){
      this.show = true;
      setTimeout(() => {
        this.$refs.dialogVideo.src = url;
      }, 100);

    },
    refreshFoodSuggest(excludeSuggestId,type){
      api.refreshFoodSuggest(excludeSuggestId,type).then(res=>{
        switch (type) {
          case '1':
            this.breakfast = res.result;
            break;
          case '2':
            this.lunch = res.result;
            break;
          case '3':
            this.dinner = res.result;
          break;
          default:
            break;
        }
        this.$toast.success('刷新成功');
      })
    },
    getDay(day){
    　　var today = new Date();
    　　var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    　　today.setTime(targetday_milliseconds);
    　　var tYear = today.getFullYear();
    　　var tMonth = today.getMonth();
    　　var tDate = today.getDate();
    　　tMonth = this.doHandleMonth(tMonth + 1);
    　　tDate = this.doHandleMonth(tDate);
    　　return tYear+"-"+tMonth+"-"+tDate;
    },

    doHandleMonth(month){
    　　var m = month;
    　　if(month.toString().length == 1){
    　　　　m = "0" + month;
    　　}
    　　return m;
    },
    beforeClose(action, done) {
      this.$refs.dialogVideo.pause();
      done();
    },
    back() {
        //this.$router.push('index');
        //// 0:目标  1:打卡  2:报表
      this.$router.go(-1);
    },
    routeTo(path) {
        this.$router.push({path: path})
    },
    //打开新的webview
    gotoNewWindow(){
        let url=location.origin+location.pathname+"#/goalweight?from=advise";
        window.xy.openWindow(url)
    }
  },
  mounted() {
    let week = new Date().getDay();
    this.currentWeek.length = 0;
    for (let index = 1; index <= 7; index++) {
      this.currentWeek.push(this.getDay(-week+index));
      this.currentWeekDays.push(this.getDay(-week+index).split('-')[2]);
    }
    this.init();
  }
};
</script>
<style lang="scss">
.video .van-dialog__content {
  padding: 5px 5px 0 5px;
}
</style>

<style lang="scss" scoped>
@import "../assets/css/function";

#advise {
    background-image:  linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
    position: relative;
    font-family: "黑体";
  &.men{
    background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
  }
  padding-bottom: px2rem(114px);
  .nav-top {
    padding-top: px2rem(100px);
    width: 100%;
    color: #fff;
    position: relative;
    z-index: 100;
    text-align: center;
    .text {
      span {
        font-size: px2rem(44px);
      }
      img {
        position: absolute;
        left: px2rem(30px);
        top: px2rem(105px);
        transform: rotate(90deg);
        width: px2rem(35px);
      }
      font {
        position: absolute;
        right: px2rem(30px);
        top: px2rem(105px);
        font-size: px2rem(34px);
        float: right;
      }
    }
  }
  .top {
    color: #fff;
    margin-bottom: px2rem(80px);
    position: relative;
    z-index: 100;
    > p {
      padding: px2rem(86px) 0 px2rem(46px) 0;
      text-align: center;
    }
    .wrap {
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
        opacity: 0.7;
      }
    }
    .week_list {
      margin: px2rem(68px);
      border-top: 1px solid rgba(225, 225, 225, 0.32);
      ul {
        display: flex;
        justify-content: space-around;
        li {
          padding-top: px2rem(35px);
          text-align: center;
          position: relative;
          font-size: px2rem(30px);
          span {
            opacity: 0.2;
            font-size: px2rem(28px);
          }
          &.active::before {
            content: "";
            position: absolute;
            top: px2rem(-3px);
            height: px2rem(7px);
            border-radius: 5px;
            width: 100%;
            // left: -25%;
            background: rgba(94, 201, 147, 1);
          }
        }
      }
    }
  }
  .card {
    width: px2rem(985px);
    padding: px2rem(95px) px2rem(76px);
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: 10px;
    color: #fff;
    background: rgba($color: #fff, $alpha: 0.05);
    .head_top {
      display: flex;
      align-items: center;
      padding-bottom: px2rem(69px);
      border-bottom: 1px solid rgba(225, 225, 225, 0.32);
      .left {
        > img {
          width: px2rem(69px);
          height: px2rem(110px);
        }
      }
      .center {
        margin-left: px2rem(36px);
        width: 78%;
        > div:first-child {
          font-size: px2rem(36px);
          margin-bottom: px2rem(16px);
        }
        > div:last-child {
          font-size: px2rem(26px);
          line-height: px2rem(32px);
          opacity: 0.5;
        }
      }
      .right {
        color: #0dda7f;
      }
    }
    > ul {
      li {
        display: flex;
        align-items: center;
        padding-top: px2rem(86px);
        span.s1 {
          margin-right: px2rem(40px);
          i {
            color: #0dda7f;
          }
        }
        span.s2 {
          font-size: px2rem(36px);
          color: #fff;
          width: 80%;
          article {
            margin-bottom: px2rem(17px);
            font-size: px2rem(40px);
            position: relative;
          }
          p {
            font-size: px2rem(30px);
            opacity: 0.6;
          }
        }
        span.s3 {
          color: #fff;
          font-size: px2rem(40px);
          margin-right: px2rem(72px);
          small {
            color: #0dda7f;
            display: block;
            font-size: px2rem(30px);
            padding-top: px2rem(8px);
          }
        }
      }
    }
    &.card2 {
      margin-top: px2rem(34px);
      ul li {
        span.s3 small {
          color: #ff7242;
        }
        span.s1 i {
          color: #ff7242;
        }
      }
    }
    &.card3 {
      margin-top: px2rem(34px);
    }
  }
  .pClass {
    background: none;
  }
  .play_con {
    background: #080324;
    border-radius: px2rem(150px) px2rem(150px) 0 0;
    .play_con_top {
      width: 100%;
      display: flex;
      justify-content: center;
      li {
        width: 50%;
        height: px2rem(150px);
        line-height: px2rem(150px);
        text-align: center;
        color: #fff;
        span {
          padding-bottom: px2rem(20px);
        }
        &.active {
          span {
            border-bottom: 1px solid rgba(255, 255, 255, 0.7);
          }
        }
      }
    }
    .play_con_list1 {
      padding: px2rem(45px);
      ul {
        li {
          display: flex;
          background: url("../assets/images/s_bg.png") repeat;
          padding: px2rem(40px);
          border-radius: px2rem(100px);
          align-items: center;
          margin-bottom: px2rem(40px);
          span {
            &.s1 {
              display: block;
              border-radius: 50%;
              overflow: hidden;
              i {
                font-size: px2rem(120px);
                border-radius: 50%;
              }
            }
            &.s2 {
              display: block;
              flex: 4;
              margin-left: px2rem(50px);
              b {
                font-size: px2rem(42px);
                display: block;
                margin-bottom: px2rem(22px);
                color: #fff;
              }
              small {
                display: block;
                color: #fff;
                font-size: px2rem(36px);
                position: relative;
                padding-left: px2rem(40px);
                &::before {
                  position: absolute;
                  content: "";
                  display: block;
                  top: px2rem(10px);
                  left: 0;
                  width: px2rem(20px);
                  height: px2rem(20px);
                  border-radius: 50%;
                  background: #f600a9;
                }
              }
            }
            &.s3 {
              color: #f600a9;
              font-size: px2rem(36px);
              flex: 1;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
