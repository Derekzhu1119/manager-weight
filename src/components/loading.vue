<template>
    <div class="loading">
        <div class="mask"></div>
		<div class="loader-inner">
			<!--<div class="loader-line-wrap">-->
				<!--<div class="loader-line"></div>-->
			<!--</div>-->
			<!--<div class="loader-line-wrap">-->
				<!--<div class="loader-line"></div>-->
			<!--</div>-->
			<!--<div class="loader-line-wrap">-->
				<!--<div class="loader-line"></div>-->
			<!--</div>-->
			<!--<div class="loader-line-wrap">-->
				<!--<div class="loader-line"></div>-->
			<!--</div>-->
			<!--<div class="loader-line-wrap">-->
				<!--<div class="loader-line"></div>-->
			<!--</div>-->
			<!--<img src="../assets/images/loading.gif" alt="">-->

			<div class="spinner">
				<div class="bar1">
				</div>
				<div class="bar2">
				</div>
				<div class="bar3">
				</div>
				<div class="bar4">
				</div>
				<div class="bar5">
				</div>
				<div class="bar6">
				</div>
				<div class="bar7">
				</div>
				<div class="bar8">
				</div>
				<div class="bar9">
				</div>
				<div class="bar10">
				</div>
				<div class="bar11">
				</div>
				<div class="bar12">
				</div>
			</div>
		</div>
    </div>
</template>

<style lang="scss" scoped>
@import '../assets/css/function';
@-webkit-keyframes loading {
	from {opacity: 1;width:5px;height:25px;}
	to {opacity: 0.25;width:5px;height:25px;}
}
@keyframes loading{
	from {opacity: 1;width:5px;height:25px;}
	to {opacity: 0.25;width:5px;height:25px;}
}
div.spinner {
	position: absolute;
	top:50%;
	left:40%;
	display: inline-block;
	transform: scale(.6);
}
div.spinner div {
	width:5px;
	height:10px;
	background: #fff;
	border:1px solid #fff;
	position: absolute;
	left: 100%;
	top: 100%;
	opacity: 1;
	-webkit-animation: loading 2s linear infinite;
	-webkit-border-radius: 30px;
}
div.spinner div.bar1 {-webkit-transform:rotate(0deg) translate(0, -34px); -webkit-animation-delay: -0s;}
div.spinner div.bar2 {-webkit-transform:rotate(30deg) translate(0, -34px); -webkit-animation-delay: -1.8334s;}
div.spinner div.bar3 {-webkit-transform:rotate(60deg) translate(0, -34px); -webkit-animation-delay: -1.6668s;}
div.spinner div.bar4 {-webkit-transform:rotate(90deg) translate(0, -34px); -webkit-animation-delay: -1.5002s;}
div.spinner div.bar5 {-webkit-transform:rotate(120deg) translate(0, -34px); -webkit-animation-delay: -1.3336s;}
div.spinner div.bar6 {-webkit-transform:rotate(150deg) translate(0, -34px); -webkit-animation-delay: -1.167s;}
div.spinner div.bar7 {-webkit-transform:rotate(180deg) translate(0, -34px); -webkit-animation-delay: -1.0004s;}
div.spinner div.bar8 {-webkit-transform:rotate(210deg) translate(0, -34px); -webkit-animation-delay: -0.8338s;}
div.spinner div.bar9 {-webkit-transform:rotate(240deg) translate(0, -34px); -webkit-animation-delay: -0.6672s;}
div.spinner div.bar10 {-webkit-transform:rotate(270deg) translate(0, -34px); -webkit-animation-delay: -0.5006s;}
div.spinner div.bar11 {-webkit-transform:rotate(300deg) translate(0, -34px); -webkit-animation-delay: -0.334s;}
div.spinner div.bar12 {-webkit-transform:rotate(330deg) translate(0, -34px); -webkit-animation-delay: -0.1674s;}
.loading {
    position: fixed;
    z-index: 100000;
	left: 50%;
	top:50%;
    .loader-inner {
        width: px2rem(280px);
        height: px2rem(280px);
        transform: translate(-35%, -50%);
		position: absolute;

        z-index: 100002;
		img{
			padding: 10px;
			background: #000;
		}
        .loader-line-wrap {
		    animation: spin 2000ms cubic-bezier(.175, .885, .32, 1.275) infinite;
		    box-sizing: border-box;
		    height: 50px;
		    left: 0;
		    overflow: hidden;
		    position: absolute;
		    top: 0;
		    transform-origin: 50% 100%;
		    width: 100px;
            &:nth-child(1) {
                animation-delay: -50ms;
                .loader-line {
                    border-color: hsl(0, 80%, 60%);
                    height: 90px;
                    width: 90px;
                    top: 7px;
                }
            }
            &:nth-child(2) {
                animation-delay: -100ms;
                .loader-line {
                    border-color: hsl(60, 80%, 60%);
                    height: 76px;
                    width: 76px;
                    top: 14px;
                }
            }
            &:nth-child(3) {
                animation-delay: -150ms;
                .loader-line {
                    border-color: hsl(120, 80%, 60%);
                    height: 62px;
                    width: 62px;
                    top: 21px;
                }
            }
            &:nth-child(4) {
                animation-delay: -200ms;
                .loader-line {
                    border-color: hsl(180, 80%, 60%);
                    height: 48px;
                    width: 48px;
                    top: 28px;
                }
            }
            &:nth-child(5) {
                animation-delay: -250ms;
                .loader-line {
                    border-color: hsl(240, 80%, 60%);
                    height: 34px;
                    width: 34px;
                    top: 35px;
                }
            }
            .loader-line {
                border: 4px solid transparent;
                border-radius: 100%;
                box-sizing: border-box;
                height: 100px;
                left: 0;
                margin: 0 auto;
                position: absolute;
                right: 0;
                top: 0;
                width: 100px;
            }
		}
	}
    .mask {
        position: fixed;
	    width: 100%;
	    margin: 0 auto;
	    top: 0;
	    left: 0;
	    bottom: 0;
	    right: 0;
	    z-index: 1001;
	    background: rgba(0,0,0,.7);
    }

	@keyframes spin {
		0%, 15% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
}

        /*.loader-line-wrap:nth-child(1) { -webkit-animation-delay: -50ms; animation-delay: -50ms; }
		.loader-line-wrap:nth-child(2) { -webkit-animation-delay: -100ms; animation-delay: -100ms; }
		.loader-line-wrap:nth-child(3) { -webkit-animation-delay: -150ms; animation-delay: -150ms; }
		.loader-line-wrap:nth-child(4) { -webkit-animation-delay: -200ms; animation-delay: -200ms; }
		.loader-line-wrap:nth-child(5) { -webkit-animation-delay: -250ms; animation-delay: -250ms; }*/
/*
		.loader-line-wrap:nth-child(1) .loader-line {
		    border-color: hsl(0, 80%, 60%);
		    height: 90px;
		    width: 90px;
		    top: 7px;
		}
		.loader-line-wrap:nth-child(2) .loader-line {
		    border-color: hsl(60, 80%, 60%);
		    height: 76px;
		    width: 76px;
		    top: 14px;
		}
		.loader-line-wrap:nth-child(3) .loader-line {
		    border-color: hsl(120, 80%, 60%);
		    height: 62px;
		    width: 62px;
		    top: 21px;
		}
		.loader-line-wrap:nth-child(4) .loader-line {
		    border-color: hsl(180, 80%, 60%);
		    height: 48px;
		    width: 48px;
		    top: 28px;
		}
		.loader-line-wrap:nth-child(5) .loader-line {
		    border-color: hsl(240, 80%, 60%);
		    height: 34px;
		    width: 34px;
		    top: 35px;
		}*/

		/*@-webkit-keyframes spin {
		    0%, 15% {
				-webkit-transform: rotate(0);
				        transform: rotate(0);
			}
			100% {
				-webkit-transform: rotate(360deg);
				        transform: rotate(360deg);
			}
		}

		@keyframes spin {
		    0%, 15% {
				-webkit-transform: rotate(0);
				        transform: rotate(0);
			}
			100% {
				-webkit-transform: rotate(360deg);
				        transform: rotate(360deg);
			}
		}*/
</style>