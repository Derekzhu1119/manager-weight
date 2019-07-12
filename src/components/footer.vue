<template>
  <div class="footer">
    <div class="wp">
      footer
    </div>
  </div>
</template>

<script>
  import { mapGetters,mapActions,mapState } from 'vuex'
  import * as types from '../vuex/types'
  import * as util from '../util/tool'
  require('../util/webView.js')
  export default {
    props: {
    },
    data() {
      return {
      }
    },
    created(){

    },
    ready(){
    },
    methods: {

    },
    computed: {
      ...mapGetters([
        'system',
      ]),
      ...mapState({

      })
    },
  }
</script>

<style lang="scss" scoped>
@import '../assets/css/function';
.footer{
  padding: 35px 0;
  font-size: 14px;
  color: #999999;
  background: #f6f6f6;
  text-align: center;
  border-top:2px solid #fff;
}



</style>
