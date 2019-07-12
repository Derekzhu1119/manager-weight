<template>
  <div id="advise" :class="sex === '1' ? 'men':''">
    <div class="nav-top">
      <div class="text">
        <!-- <span>体重趋势</span> -->
        <!-- <font>报告详情</font> -->
      </div>
    </div>
    <div class="top">
      <p>{{currentTime}}</p>
      <div v-show="noData" style="text-align:center;">您需要打卡后才会显示报表数据哦!</div>
    </div>

    <!--折线图-->
    <div class="top_chart1" id="report1"></div>
    <div class="line"></div>
    <!--折线面积图-->
    <div class="top_chart" id="zx_chat"></div>
    <div class="line"></div>
    <!--堆叠柱状图-->
    <div class="wrap">
      <div class="top_chart2" id="report2"></div>
      <!-- <span class="info">报表详情</span> -->
    </div>
    <div class="line"></div>
    <!--柱状图-->
    <div class="wrap">
      <div class="top_chart3" id="report3"></div>
      <!-- <span class="info">报表详情</span> -->
    </div>

  </div>
</template>

<script>
import api from '../fetch/api'
import { obj } from '../util/tool'

export default {
  data() {
    return {
      show: false,
      sex:localStorage.selectSex,
      myweight:localStorage.myWeight,
      currentWeek:[],
      weightData:[],
      compareLastWeight:[],
      report1Data:{food:[],sports:[]},
      report2Data:{data1:[],data2:[],data3:[]},
      report3Data:[],
      noData:false
    };
  },
  computed:{
    currentTime(){
      let startArr = (this.currentWeek[0] || "").split('-');
      let endArr = (this.currentWeek[6] || "").split('-');
      return `${startArr[1]}月${startArr[2]}日 - ${endArr[1]}月${endArr[2]}日`;
    }
  },
  methods: {
    init(){
      let week = new Date().getDay();
      this.currentWeek.length = 0;
      for (let index = 1; index <= 7; index++) {
        this.currentWeek.push(obj.getWeekDay(-week+index));
      }
      Promise.all(
        [api.getReport1(this.currentWeek[0],this.currentWeek[6]),
         api.getReport2(this.currentWeek[0], this.currentWeek[6]),
         api.getReport3(this.currentWeek[0], this.currentWeek[6])]
        ).then(res=>{
        console.log(res);
        this.report1Data.food = res[2].result.foodsCalories.map(item=>{
          if (JSON.stringify(item) == 'null') {
            return '';
          }else{
            return item.calories;
          }
        });
        this.report1Data.sports = res[2].result.sportsCalories.map(item=>{
          if (JSON.stringify(item) == 'null') {
            return '';
          }else{
            return item.calories;
          }
        });

        this.report2Data.data1 = res[1].result.data.map(item=>{
          if (JSON.stringify(item) == 'null') {
            return '';
          }else{
            return item.proteinPercentage;
          }
        });
        this.report2Data.data2 = res[1].result.data.map(item=>{
          if (JSON.stringify(item) == 'null') {
            return '';
          }else{
            return item.carbohydratePercentage;
          }
        });
        this.report2Data.data3 = res[1].result.data.map(item=>{
          if (JSON.stringify(item) == 'null') {
            return '';
          }else{
            return item.fatPercentage;
          }
        });

        this.report3Data = res[0].result.data.map(item=>{
          if (JSON.stringify(item) == 'null') {
            return '';
          }else{
            return item.calories;
          }
        });
       // 判断报表数据是否为空
       if (res[0].result.noData && res[1].result.noData && res[2].result.foodsCaloriesNotData && res[2].result.sportsCaloriesNotData) {
         this.noData = true;
       }


      //  let arr = [...new Set(this.report3Data)];
      //  let arr1 = [...new Set(this.report1Data.food)];
      //  let arr2 = [...new Set(this.report1Data.sports)];
      //  if (arr.length == 1 && arr[0] == '' && arr1.length == 1 && arr1[0] == '' && arr2.length == 1 && arr2[0] == '') {
      //    this.noData = true;
      //  }

      this.drawReport1();
      this.drawReport2();
      this.drawReport3();
      })
    },
    beforeClose(action, done) {
      this.$refs.dialogVideo.pause();
      done();
    },

    getWeightRecord(){
      api.getReport0(this.currentWeek[0],this.currentWeek[6]).then(res=>{
          this.weightData = res.result.data.map(item=>{
          if (JSON.stringify(item) == 'null') {
              return '';
            }else{
              return item.weight;
            }
          });

          this.compareLastWeight = res.result.data.map(item=>{
          if (JSON.stringify(item) == 'null') {
              return '';
            }else{
              return item.compareLastWeight;
            }
          });

          this.drawZhexian();
      })
    },

    drawReport1() {
      let zxChart = this.echarts.init(document.getElementById("report1"));
      let option = {
        title:{
          text:'膳食运动对比',
          left:"3%",
          textStyle:{
            fontSize:13,
            color:"#fff",
            fontWeight:"100"
          }
        },
        grid: {
          left: "4%",
          right: "4%",
          top:"20%",
          bottom: "8%",
          containLabel: true
        },
        legend: {
          orient:'vertical',
          top:0,
          itemGap:4,
          right:"2%",
          itemWidth:7,
          itemHeight:7,
          textStyle:{
            fontSize:10
          },
          data: [
            {
              name:"运动",
              textStyle:{
                color:"#4890FF",
                fontWeight:"100"
              },
              icon: "image://static/images/d2.png",
            },
            {name:"膳食",icon: "image://static/images/d1.png",textStyle:{
              color:"#F2602F",fontWeight:"100"
            }}
          ]
        },
        xAxis: {
          type: "category",
          splitLine:{
            show:false,
          },
          axisLine:{
            lineStyle:{
              color:'#fff',
              width:0,
            }
          },
          axisTick:{
            show:false
          },
          boundaryGap: false,
          data: this.currentWeek.map(val=>{return val.split('-')[2]})
        },
        yAxis: {
          type: "value",
          splitLine:{
            show:true,
            lineStyle:{
              type:"dashed",
              color:"#F3059A",
              opacity:0.6
            }
          },
          axisLine:{
            lineStyle:{
              color:'#fff',
              width:0,
            }
          },
          axisTick:{
            show:false
          }
        },
        series: [
          {
            name: "运动",
            data: this.report1Data.sports,
            type: "line",
            itemStyle:{
              opacity:0
            },
            areaStyle: {
              color:'#4890FF',
              opacity:0.5
            },
            lineStyle:{
              width:0
            }
          },
          {
            name: "膳食",
            data: this.report1Data.food,
            type: "line",
            itemStyle:{
              opacity:0
            },
            areaStyle: {
              color:'#F2602F',
              opacity:0.4
            },
            lineStyle:{
              width:0
            }
          }
        ]
      };
      zxChart.setOption(option);
      window.onresize = function() {
        zxChart.resize();
      };
    },

    drawReport2() {
      let zxChart = this.echarts.init(document.getElementById("report2"));
      let option = {
        title:{
          text:'膳食分析',
          left:"3%",
          textStyle:{
            fontSize:13,
            color:"#fff",
            fontWeight:"100"
          }
        },
        tooltip: {
          // alwaysShowContent:true,
          // triggerOn:'',
          trigger: "axis",
          formatter:function(params){
           let arr = params.map((item)=>{
             return {name:item.seriesName,value:item.value};
           });
           let bool = arr.every(val=>{return val.value == ''});
           if (bool) {
             return '';
           }else{
               let temp='';
             arr.map(item=>{
                 temp += `<div>${item.name}：${item.value}</div>`;

             });
               return temp;
           }
          },
          axisPointer: {
            type: "" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "6%",
          right: "6%",
          bottom: "10%",
          containLabel: true
        },
        legend: {
          itemGap :60,
          bottom:0,
          padding:10,
          itemWidth:10,
          itemHeight:10,
          textStyle:{
            color:"#fff"
          },
          data: [
            {name:"蛋白质",icon: 'circle'},
            {name:"碳水化合物",icon: 'circle'},
            {name:"脂肪",icon: 'circle'},
          ]
        },
        xAxis: {
          type: "category",
          splitLine:{
            show:false,
          },
          axisLine:{
            lineStyle:{
              color:'#fff',
              width:0,
            }
          },
          axisTick:{
            show:false
          },
          boundaryGap: false,
          data: this.currentWeek.map(val=>{return val.split('-')[2]})
        },
        yAxis:{
            // nameGap:155,
            // 刻度线
            axisLine:{
              lineStyle:{
                color:'#fff',
                width:0,
              }
            },
            //网格线
            splitLine:{
              show:false,
            },
            // 坐标刻度值
            axisLabel:{
              show:false
            },
            // 坐标刻度 线
            axisTick:{
              show:false
            },
            type: "value"
          },
        series: [
          {
            name: "蛋白质",
            type: "bar",
            stack: "蛋白质",
            data: this.report2Data.data1,
            itemStyle:{
              color:"#FF7142"
            }
          },
          {
            name: "碳水化合物",
            type: "bar",
            stack: "蛋白质",
            data: this.report2Data.data2,
            itemStyle:{
              barBorderRadius:0,
              color:"#5EC993"
            }
          },
          {
            name: "脂肪",
            type: "bar",
            stack: "蛋白质",
            data: this.report2Data.data3,
            barWidth:15,
            itemStyle:{
              barBorderRadius:[10,10,0,0],
              color:"#4890FF"
            }
          }
        ],
        // 标注线
        markLine:{

        }
      };
      zxChart.setOption(option);
      zxChart.dispatchAction({
            type: 'showTip',
            seriesIndex:1,  // 显示第几个series
            dataIndex: new Date().getDay() - 1 // 显示第几个数据
      });
      window.onresize = function() {
        zxChart.resize();
      };
    },

    drawReport3() {
      let zxChart = this.echarts.init(document.getElementById("report3"));
      let option = {
        title:{
          text:'运动分析',
          left:"3%",
          textStyle:{
            fontSize:13,
            color:"#fff",
            fontWeight:"100"
          }
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          splitLine:{
            show:false,
          },
          axisLine:{
            lineStyle:{
              color:'#fff',
              width:0,
            }
          },
          axisTick:{
            show:false
          },
          boundaryGap: false,
          data: this.currentWeek.map(val=>{return val.split('-')[2]})
        },
        yAxis:{
          //网格线
          splitLine:{
            show:true,
            lineStyle:{
              type:"dashed",
              color:this.sex === '1' ? "#8644F2":"#F3059A",
              opacity:0.6
            }
          },
            // 刻度线
            axisLine:{
              lineStyle:{
                color:'#fff',
                width:0,
              }
            },
            // 坐标刻度值
            axisLabel:{
              show:true
            },
            // 坐标刻度 线
            axisTick:{
              show:false
            },
            type: "value"
          },
        series: [
          {
            name: "运动指数",
            type: "bar",
            data: this.report3Data,
            barWidth:15,
            itemStyle:{
              normal:{
                label:{
                  show:true,
                  position:'top',
                  textStyle:{
                    color:"#fff"
                  }
                },
                color: this.sex === '1' ? "#8644F2":"#F8376E",
                opacity:0.6,
                barBorderRadius:[10,10,0,0],
              }
            }
          }
        ],
        // 标注线
        markLine:{}
      };
      zxChart.setOption(option);
      window.onresize = function() {
        zxChart.resize();
      };
    },

    drawZhexian() {
      let zxChart = this.echarts.init(document.getElementById("zx_chat"));
      let that = this;
      let option = {
        title:{
          text:'体重趋势',
          left:"3%",
          textStyle:{
            fontSize:13,
            color:"#fff",
            fontWeight:"100"
          }
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          splitLine:{
            show:false,
          },
          axisLine:{
            lineStyle:{
              color:'#fff',
              width:0,
            }
          },
          axisTick:{
            show:false
          },
          boundaryGap: false,
          data: this.currentWeek.map(val=>{return val.split('-')[2]})
        },
        yAxis:{
          //网格线
          splitLine:{
            show:true,
            lineStyle:{
              type:"dashed",
              color:this.sex === '1' ? "#8644F2":"#F3059A",
              opacity:0.6
            }
          },
            // 刻度线
            axisLine:{
              lineStyle:{
                color:'#fff',
                width:0,
              }
            },
            // 坐标刻度值
            axisLabel:{
              show:true
            },
            // 坐标刻度 线
            axisTick:{
              show:false
            },
            type: "value"
          },
        series: [
          {
            name: "体重",
            type: "bar",
            data: this.weightData,
            barWidth:15,
            itemStyle:{
              normal:{
                label:{
                  show:true,
                  position:'top',
                  textStyle:{
                    color:"#fff"
                  }
                },
                color: (params)=>{
                //  let arr = new Array(7);
                //  let pre = '';
                //  for (let index = 0; index < this.weightData.length; index++) {
                //    const item = this.weightData[index];
                //    if (item !== '') {
                //      if (pre === '') {
                //         pre = this.myweight;
                //      }
                //      item > this.myweight ? arr[index] = 2 : item == this.myweight ? arr[index] = 1 : arr[index] = 0;
                //      pre = item;
                //    }
                //  }
                  var colorList = ['#43B47B','#45B3FF','#FF7142']; // = , < , >
                  if (this.compareLastWeight[params.dataIndex] == '2') {
                    return colorList[2]; // >
                  }else if(this.compareLastWeight[params.dataIndex] == '3'){
                    return colorList[0]; // =
                  }else{
                    return colorList[1]; // <
                  }
                },
                opacity:1,
                barBorderRadius:[10,10,0,0],
              },
            }
          }
        ],
        // 标注线
        markLine:{}
      };
      zxChart.setOption(option);
      zxChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 1,  // 显示第几个series
          dataIndex: 1 // 显示第几个数据
      });
      window.onresize = function() {
        zxChart.resize();
      };
    },
  },
  mounted() {
    this.init();
    setTimeout(() => {
      this.$nextTick(function() {
          this.getWeightRecord(this.currentWeek[0],this.currentWeek[6]);
        });
    }, 1000);
    let that=this;
    window.initReportData = function () {
        that.init();
        that.getWeightRecord();
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
        //设置body颜色
        if(this.sex=='1' || this.sex==1){$('body').addClass('men').removeClass('nosafePadding');}
    })
  },
    created() {
        if(this.$route.query.token && typeof this.$route.query.token !='undefined' && this.$route.query.token!=null){
            localStorage.setItem('token',this.$route.query.token)
        }

    },
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
    position: relative;
    font-family: "黑体";
    background-image:  linear-gradient(140deg, #dd0698 10%,#1f0a86 90%);
  &.men{
    background-image:  linear-gradient(140deg, #3031b1 10%,#11153c 90%);
  }
  padding-bottom: px2rem(200px);
    min-height:100%;
  .line{
    clear: both;
    height: 1px;
    width: 100%;
    background: rgba(225,225,225,.32);
  }
  .top_chart {
    overflow: hidden;
    width: 100%;
    margin-top: px2rem(80px);
    margin-bottom: px2rem(80px);
    height: px2rem(900px);
  }
  .top_chart1 {
    overflow: hidden;
    width: 100%;
    height: px2rem(1000px);
  }
  .top_chart2 {
    overflow: hidden;
    width: 100%;
    margin: px2rem(80px) 0;
    height: px2rem(900px);
  }
  .top_chart3 {
    overflow: hidden;
    width: 100%;
    margin-top: px2rem(80px);
    height: px2rem(900px);
  }
  .wrap{
    position: relative;
    .info{
      position: absolute;
      top: 2.5%;
      right: 3%;
      color: #fff;
      font-size: px2rem(30px);
      opacity: .65;
    }
  }
  .nav-top {
    padding-top: px2rem(100px);
    width: 100%;
    color: #fff;
    position: relative;
    z-index: 100;
    .text {
      span {
        font-size: px2rem(42px);
        padding-left: px2rem(40px);
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
    // margin-bottom: px2rem(450px);
    position: relative;
    z-index: 100;
    > p {
      padding: px2rem(46px) 0;
      text-align: center;
    }
  }
}
</style>
