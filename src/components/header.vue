<template>
  <div class="header" v-show="isShowHeader">

    <div class="wp">
        <div class="header_inner">
          <div class="logo"><a href="./#index">logo</a></div>

          <nav>
          </nav>

          <div class="clearfix"></div>
        </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters,mapActions,mapState } from 'vuex'
  import * as _ from '../util/tool'
  import api from '../fetch/api'
  import router from '../router'

  export default {

    props: {
        title:String
    },
    data() {
      return {
          isShowHeader:true,
      }
    },
    created(){

    },
    mounted() {
        this.$nextTick(()=>{
        })
    },

    methods: {
      goBack () {
        this.$router.goBack();
      },


    },
    computed: {
      ...mapGetters({
//          curNav:"curNav",
          loginStatus: "loginStatus",
          userInfo: "userInfo"
      }),
      ...mapState({
      }),

    },
    watch: {

    }
  }
</script>

<style lang="scss" scoped>
@import '../assets/css/function';
.clearfix{
  display: block;
  clear: both;
}
.wp{
  width: 1200px;
  margin: 0 auto;
}
.header{

}
</style>
