var platform;
isYiCaiApp()
function  isYiCaiApp(){
    const ua = navigator.userAgent.toLowerCase();
    if(ua.indexOf('yicai') > -1){
        $('.zx_h_title').hide();
        // 判断是否在 App 中
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  //判断iPhone|iPad|iPod|iOS
            //alert(navigator.userAgent);  
            platform = 4;
        } else if (/(Android)/i.test(navigator.userAgent)) {   //判断Android
            //alert(navigator.userAgent); 
            platform = 3;
            //alert(platform);
        } 
        return true;
    }else{
        platform = 2;
        $('.zx_h_title').show()
        return false;
    }
}




//新闻内页获取内容地址
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
var getRequest = {
    src:getQueryString('url'),
    title:getQueryString('title'),
    typeCode:getQueryString('typeCode'),
    articleLabel:getQueryString('articleLabel')
}

/*
var getarticle =/(\w+)\W/gi.exec(getRequest.src);
var getAurl;
if(getarticle[0] == 'https:'){
    getAurl = getRequest.src.replace(/https:/,'');
}else if(getarticle[0] == 'http:'){
    getAurl = getRequest.src.replace(/http:/,'');
}
*/
$('#ifr').attr('src',getRequest.src+'?domain=//'+ location.host);

//$('#ifr').attr('src','http://192.168.69.59:88/article_template.html?domain=http%3A%2F%2F192.168.69.59%3A8080');



//新闻内页广告图
zxAd('.zxNew_bottom',getRequest.typeCode);
function zxAd(id,typeCode){
        $.ajax({
            beforeSend: function(){
                    $('#login_loading').fadeIn();
                    $('#login_loading > em').css('-webkit-animation-play-state','running')
            },
            complete: function (){
                    $('#login_loading').fadeOut();
                    $('#login_loading > em').css('-webkit-animation-play-state','paused')
            },
            type:"GET",
            url:URI+"/pc/operate/ad",
            data: Object.assign(utils.getSpread(), {menu:'11',token:sessionStorage.token,typeCode:typeCode}),
            dataType:"json",
            success:function(data){
                if(data.success == 1){
                    for(var i=0;i<data.data.length;i++){
                        var position = data.data[i].position;
                        if(position == 17){
                             $(id).prepend('<section class="advert"><a href="'+data.data[i].adUrl+'"><img src="'+data.data[i].adImgUrl+'" width="100%"></a></section>');
                        }

                    }

                }

            }
        });
}


//相关文章接口
label('.zxNew_bottom',getRequest.title);
function label(id,arcid){
        $.ajax({
            beforeSend: function(){
                    $('#login_loading').fadeIn();
                    $('#login_loading > em').css('-webkit-animation-play-state','running')
            },
            complete: function (){
                    $('#login_loading').fadeOut();
                    $('#login_loading > em').css('-webkit-animation-play-state','paused')
            },
            type:"GET",
            url:URI+"/pc/news/label",
            data: Object.assign(utils.getSpread(), {articleLabel:getRequest.articleLabel,id:arcid,endRow:'5',startRow:'0',token:sessionStorage.token,typeCode:getRequest.typeCode}),
            dataType:"json",
            success:function(data){
                if(data.success == 1){

                    var articleImg,articleImgs,lanmUrl;
                    for(var i=0;i<data.data.length;i++){
                        try{
                            articleImg = data.data[i].articleImg;
                            articleImgs = data.data[i].articleImg.split(',');
                        }catch(e){}

                        var releaseTime = data.data[i].releaseTime.replace(/-/g,'/');
                        showTime(releaseTime);
                        lanmUrl = 'index2.html?typeCode='+data.data[i].typeCode;
                        if(data.data[i].typeCode == '1.1' || data.data[i].typeCode == '1.2'){
                            lanmUrl = 'javascript:;'
                        }else{
                            lanmUrl = lanmUrl;
                        }
                        if(articleImg == undefined || articleImg == ""){
                            $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><strong class="strong_length oneStrong"><a class="zx_sl_2 gray33 zx_title_r" href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+'</a><span class="zx_content_bottom show1_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                        }else{
                              switch(articleImgs.length){
                                    case 0:
                                        $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><strong class="strong_length oneStrong"><a class="zx_sl_2 gray33 zx_title_r" href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+'</a><span class="zx_content_bottom show1_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                                        break;
                                    case 1:
                                        $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><a href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><img src="'+articleImgs[0]+'"></a><strong class="strong_length"><a class="gray33 zx_title_r zx_sl_2" href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                                        break;
                                    case 2:
                                        $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><a href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><img src="'+articleImgs[0]+'"></a><strong class="strong_length"><a class="gray33 zx_title_r zx_sl_2" href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitlep+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                                        break;
                                    case 3:
                                        $(id).append('<section class="zx_show2 zx_show"><ul><li><a href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p><strong>'+data.data[i].articleTitle+'</strong></p><p class="zx_tp_3"><img src="'+articleImgs[0]+'"><img src="'+articleImgs[1]+'"><img src="'+articleImgs[2]+'"></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'"  class="typeClick blue" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></p></li></ul></section>')
                                        break;
                                    case 4:
                                        $(id).append('<section class="zx_show2 zx_show"><ul><li><a href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p><strong>'+data.data[i].articleTitle+'</strong></p><p class="zx_tp_3"><img src="'+articleImgs[0]+'"><img src="'+articleImgs[1]+'"><img src="'+articleImgs[2]+'"></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'"  class="typeClick blue" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></p></li></ul></section>')
                                        break;

                               }
                           


                        }


                    }

                }

            }
        });
}



//新闻显示信息
var timeDate;
function showTime(releaseTime){
        var how = new Date(releaseTime);
        var today = new Date();
        var time = parseInt(today.getTime()-how.getTime())/1000/60/60;
        var years = releaseTime.substring(0,4);
        var year = today.getFullYear(); 
        if(years == year){
            if(time > 12){
                timeDate = releaseTime.replace(/\//g,'.').substring(5,16);
            }else if(time < 1){
                var timeD = parseInt(time.toFixed(2)*60);
                if(timeD < 2){
                    timeDate = "刚刚"
                }else{
                    timeDate = timeD+'分钟前';
                }
            }else{
                timeDate = parseInt(time)+'小时前';
            }
        }else{
            timeDate = releaseTime.replace(/\//g,'.').substring(0,16);
        }
        
}


// 获取本地存储的用户信息
var userinfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
if (userinfo){
    $('.h_person').attr('href','/sc.html');
}else{
    // $('.h_person').attr('href','/login/login.html');
    $('.h_person').attr('href','/account.html#/login');
}
