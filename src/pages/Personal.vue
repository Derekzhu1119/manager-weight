<template>
    <div class="personal" :class="sex === '1' ? 'men':''">
        <div class="personal_top">
            <van-nav-bar
                    title="个人中心"
                    left-text=""
                    left-arrow
                    @click-left="onClickBack"

            />
        </div>
        <van-cell-group class="p_con" :border="false" v-if="userInfo.baseInfo && userInfo.targetInfo">
            <van-cell title="用户名/昵称" :value="userInfo.baseInfo.loginName"  class="p_item"/>
            <van-cell title="性别" :value="userInfo.baseInfo.sex==1 ? '男' : '女'"   class="p_item"/>
            <van-cell title="出生日期" :value="userInfo.baseInfo.birth"   class="p_item"/>
            <van-cell title="身高" :value="userInfo.baseInfo.height + 'cm'"   class="p_item"/>
            <van-cell title="初始体重" :value="userInfo.targetInfo.weight + 'kg'" class="p_item"/>
            <van-cell title="目标" :value="userInfo.targetInfo.target==1 ? '减轻重量': userInfo.targetInfo.target==2 ? '塑形' : userInfo.targetInfo.target==3 ? '增加肌肉' :'脂肪燃烧'"  class="p_item" />
            <van-cell title="目标体重" :value="userInfo.targetInfo.targetWeight + 'kg'"   class="p_item"/>
            <van-cell title="目标达成时间" :value="userInfo.targetInfo.targetDate"   class="p_item"/>
            <van-cell title="关于体重管家" is-link class="p_item" @click="showAbout=true" />
        </van-cell-group>
        <div class="btnCon">

            <van-row>
                <van-col span="10"><van-button size="large" type="primary" @click="retry">重新评测</van-button></van-col>
                <van-col span="10" offset="4"><van-button size="large" type="danger" @click="loginOut">退出登录</van-button></van-col>
            </van-row>
        </div>

        <van-popup v-model="showAbout" position="right" :overlay="true" class="about" :class="sex === '1' ? 'men':''">
            <div class="about_top">
                <van-nav-bar
                        title="关于体重管家"
                        left-text=""
                        left-arrow
                        @click-left="showAbout=false"
                />
            </div>
            <div class="about_inner">
                <p>体重管家是一款个人开发的体重管理应用。</p>
                <p>体重管家都有什么？</p>
                <p>1、基于性别，身高，年龄，体重自动化分析的健康报告。</p>
                <p>2、设立健康目标，根据目标自动平衡实现时间，倡导健康减重。</p>
                <p>3、每日趣味性打卡，便捷记录膳食、运动、和体重变化，辅助你实时掌握运动消耗和膳食摄入情况，合理安排接下来的膳食运动。</p>
                <p>4、体重、运动、膳食的数据的长期跟踪分析，帮助你更好的达成目标。</p>

               <p style="margin-top: 40px; font-weight: bold; text-align: right">开发者： Derek.zhu</p>
            </div>
        </van-popup>
    </div>
</template>

<script>
import api from '../fetch/api'
import { obj } from '../util/tool'
export default {
  data() {
    return {
        userInfo:{},
        sex:localStorage.selectSex,
        showAbout:false

    };
  },
  methods: {
      loginOut(){
          localStorage.clear();
          window.xy.logout(
              function (res) {
                  this.$toast.fail('退出成功');
              },function (error) {
                  this.$toast.fail('退出失败');
              }
          )
      },
      retry(){
          let url=location.origin+location.pathname+"#/height?from=personal";
          window.xy.openWindow(url)
      },
      onClickBack(){
          this.$router.go(-1);
      },
  },
  mounted() {

      //接口获取用户信息并存储
      api.getUserInfo().then(res=>{
          if(res.code=='2000'){
              this.userInfo=res.result;
          }
      }).catch(err=>{
          this.$toast.fail('获取用户信息失败')
      })
  },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            //设置body颜色
        })
    },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/function";
.personal{
    min-height: 100%;
    overflow-x: hidden;
    width: 100%;
    background-image:  linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
    &.men{
        background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
    }
    .personal_top{
        padding-top: px2rem(60px);
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
    .p_con{
        background: none;
        .p_item{
            background: none;
            padding: px2rem(40px) 0px;
            margin-right:3%;
            width:auto !important;
            margin:0 15px;
            border-bottom: px2rem(1px) solid rgba(255,255,255,0.5);
            color: #fff;
            .van-cell__value{
                color: #fff;
            }
            &::after{
                display: none;
            }
        }

    }
    .btnCon{
        text-align: center;
        width:80%;
        margin-left: 10%;
        margin-top: px2rem(150px);
        box-sizing: border-box;
    }
    .about{
        width: 100%;
        height: 100%;
        padding-top: px2rem(60px);
        background-image:  linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
        &.men{
            background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
        }
        .about_top{
            padding-top: px2rem(60px);
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
        .about_inner{
            color: #fff;
            width:80%;
            margin-left: 10%;
            margin-top: px2rem(150px);
            box-sizing: border-box;
            font-size: px2rem(42px);
            line-height: px2rem(86px);
            p{
                color: #fff;
                font-size: px2rem(42px);
                line-height: px2rem(100px);
            }
        }
    }


}
</style>


