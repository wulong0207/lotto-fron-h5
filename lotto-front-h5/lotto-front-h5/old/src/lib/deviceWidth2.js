(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            //��ȡ��������ҳ���Ŀ���
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            //����750��С300
            if(clientWidth>750){
            	clientWidth=750;
            }
            if(clientWidth<300){
            	clientWidth=300;
            }
            //fontsize�Ĵ�С���ڣ���ǰ��Ļ�Ŀ��ȳ���750�õ���������100���˵ó�
            docEl.style.fontSize = 100 * (clientWidth / 750/2.5) + 'px';
        };
    //�ж��Ƿ�֧��addEvent�����¼�
    if (!doc.addEventListener) return;
    //��window��document������Ļ���ŵ��¼���ִ��recalc����
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);