<template>
    <div id="app">

        <!--<v-tab v-show="isShowTab" :tab-items="tabItems"></v-tab>-->
        <div class="mui-content">
            <transition :name="transitionName">
                <router-view></router-view>
            </transition>
        </div>

    </div>
</template>

<script>
    import header from '@/components/header'
    import footer from '@/components/footer'
    import toast from '@/components/toast'
    import alert from '@/components/alert'
    import loading from '@/components/loading'

    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: 'app',
        components: {
            'v-header': header,
            'v-footer': footer,
            'v-toast': toast,
            'v-alert': alert,
            'v-loading': loading,
        },
        data() {
            return {
                // title:'融创员工菜单'
                transitionName: 'slide-left'
            }
        },
        created() {
            if (sessionStorage.selectSex == '1' || localStorage.selectSex == '1') {
                $('body').addClass('men')
            } else {
                $('body').removeClass('men')
            }
        },
        methods: {
            ...mapActions({setNavState: 'setNavState'}),

        },
        watch: {
            $route(to, from) {
                //如果to索引大于from索引,判断为前进状态,反之则为后退状态
                if (to.meta.index > from.meta.index) {
                    //设置动画名称
                    this.transitionName = 'slide-left';
                } else {
                    this.transitionName = 'slide-right';
                }
                // if(to.meta.index != from.meta.index){
                //     if(this.$route.path!='/height' && this.$route.path!='/birth' && this.$route.path!='/weight' && this.$route.path!='/goalWeight'){
                //         $('body').removeClass('nosafePadding')
                //     }else{
                //         $('body').addClass('nosafePadding')
                //     }
                // }
            }
        },
        computed: {
            ...mapGetters({
                loginStatus: "loginStatus",
                token: "token",
                sex: "sex",
                weight: "weight",
                birthday: "birthday",
                height: "height"
            }),
            title() {
                return ''
            }


        }
    }
</script>

<style lang="scss">
    @import './assets/css/function';

    body {
        position: relative;
    }

    html, body, .router-view, #app {
        width: 100%;
        min-height: 100%;
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .mui-content {
        height: 100%;
    }

    * {
        -webkit-touch-callout: none; /*系统默认菜单被禁用*/
        -webkit-user-select: none; /*webkit浏览器*/
        -khtml-user-select: none; /*早期浏览器*/
        -moz-user-select: none; /*火狐*/
        -ms-user-select: none; /*IE10*/
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }

    input, textarea {
        -webkit-user-select: auto; /*webkit浏览器*/
    }

    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
        will-change: transform;
        transition: all 500ms;
        position: absolute;
    }

    .slide-right-enter {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }

    .slide-right-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

    .slide-left-enter {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

    .slide-left-leave-active {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }

</style>
