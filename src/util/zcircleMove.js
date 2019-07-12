// JavaScript Document
export function run(settings){
    var defaultSetting = {
        url: 'static/images/i14.png', //飞机小图地址
        obj: '', //场景添加的canvas id 名
        percent: 1, //圆环转动的百分比  0-1
        circleBottomColor: "rgba(116,30,150,0.5)", //圆环底色
        innerColorStart: '#f8c068', //内部圆环 渐变色
        innerColorEnd: '#e52556'
    };
    var option = $.extend({}, defaultSetting, settings);
    var imageUrl = option.url;
    var obj = option.obj;
    var percent = option.percent;
    var innerColorStart = option.innerColorStart;
    var innerColorEnd = option.innerColorEnd;
    var circleBottomColor = option.circleBottomColor;

    var preA = Math.PI / 180;

    var canvasC = document.getElementById(obj);
    /*控制运动*/
    var context = canvasC.getContext('2d');
    var windowW = parseInt($(canvasC).width());
    var lineW1 = 40;
    var lineW0 = 5;
    if (windowW > 500) {
        lineW1 = 36;
        lineW0 = 10;
    }
    var canvasW = windowW * 2;
    var R1 = parseInt(canvasW / 2 - lineW1 - lineW0 - 10);
    var ra = parseInt(canvasW / 2 - lineW1 - lineW0 - 9);
    var canvasH = canvasW;
    var rotateAngle = percent * 360;
    var anotherA = 0;
    if (percent > 0.5) {
        anotherA = (percent - 0.5) * 360 * preA;
    }
    var rotataRadians = preA * rotateAngle;
    canvasC.width = canvasW;
    canvasC.height = canvasH;

    var x = canvasC.width / 2;
    var y = canvasC.height / 2;
    var startAa = -Math.PI / 2;
    var startA = 0;
    var Timer;
    var imageAir = new Image();
    imageAir.src = imageUrl;
    function CanvasApp() {
        var loading = 0;
        canvasC.setAttribute("data-run", "1")
        var imgWidth = 36;
        var imgHeight = 36;
        var imgX = -imgWidth / 2 - 2;
        var imgY = -imgHeight / 2;

        function drawScreen() {
            if (startA < rotataRadians) {
                startA += 0.1;
            }
            //

            context.fillStyle = "transparent";
            context.fillRect(0, 0, canvasC.width, canvasC.height);
            //
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.fillStyle = "transparent";
            context.fillRect(0, 0, canvasC.width, canvasC.height);
            context.translate(x, y);
            context.rotate(-Math.PI / 2);
            //中环
            context.beginPath();
            context.strokeStyle = circleBottomColor;
            context.lineWidth = lineW1;
            context.arc(0, 0, R1, 0, Math.PI * 2, false);
            context.stroke();
            context.closePath();
            context.beginPath();
            // Linear gradients
            var gradient2 = context.createLinearGradient(R1, 0, -R1, 0);
            gradient2.addColorStop(0, innerColorStart);
            gradient2.addColorStop(1, innerColorEnd);
            context.lineCap = "round";
            context.strokeStyle = gradient2;
            context.lineWidth = lineW1;
            context.arc(0, 0, R1, 0, startA, false);
            context.stroke();
            context.closePath();

            //文字  进度
            // context.beginPath();
            // context.fillStyle = innerColorEnd;
            // loading += (10 / (Math.PI * 2));
            // var num = loading.toFixed(2);
            // if (num > percent * 100) {
            //     num = percent * 100;
            // };
            // context.fillText(num + "%", 0, 10)
            // context.closePath();

            //画图
            if (startAa < rotataRadians - Math.PI / 2) {
                startAa += 0.1;
                canvasC.setAttribute("data-run", "1")
            } else {
                clearInterval(Timer);
                canvasC.setAttribute("data-run", "0")
            }
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            var ax = ra * Math.cos(startAa);
            var ay = ra * Math.sin(startAa);
            context.translate(x + ax, y + ay);
            context.rotate(startAa);
             context.drawImage(imageAir, imgX, imgY, imgWidth, imgHeight)
            context.restore();


        }
        Timer = setInterval(drawScreen, 20)


    }
    CanvasApp()
}

