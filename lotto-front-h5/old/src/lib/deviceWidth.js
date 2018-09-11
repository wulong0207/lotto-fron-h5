(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            //获取电气概念页面的宽度
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            //最大750最小300
            if(clientWidth>750){
            	clientWidth=750;
            }
            if(clientWidth<300){
            	clientWidth=300;
            }
            //fontsize的大小等于：当前屏幕的宽度除以750得到比例再与100相乘得出
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        };
    //判断是否支持addEvent绑定事件
    if (!doc.addEventListener) return;
    //给window和document绑定屏幕缩放的事件，执行recalc函数
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);