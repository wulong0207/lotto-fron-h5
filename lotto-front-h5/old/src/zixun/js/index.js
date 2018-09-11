var swiper1 = null;
var tabsSwiper,timer,timer2;

// 获取本地存储的用户信息
var userinfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
if (userinfo){
    $('.h_person').attr('href','/sc.html');
}else{
    // $('.h_person').attr('href','/login/login.html');
    $('.h_person').attr('href','/account.html#/login');
}

//显示全部导航事件
$('.nav_select').on('touchstart',function(){
        $('#channel').show();
})

$('.zx_index_close').on('click',function(){
        $('#channel').hide();
})

//首页欧洲杯点击状态
$('.ozb_pk > a').on('touchstart',function(){
        $(this).addClass('ozb_on').find('em').show().end().siblings().removeClass('ozb_on').find('em').hide();
        $(this).parent().siblings().find('.zx_num').html('2');
})

//首页欧洲杯计数
function ozbPlus(id){
    var ozbOn = $('#'+id).parent().siblings('p').find('.ozb_on');
    if(ozbOn[0]){
        var zx_num = document.getElementById(id).innerHTML;
        zx_num=parseInt(zx_num)+2;
        document.getElementById(id).innerHTML = zx_num;
    }else{
         alert('请先选择赛方');
    }
}
function ozbReduce(id){
    if(ozbOn == true){
        var zx_num = document.getElementById(id).innerHTML;
        if(zx_num > 2){
        zx_num=parseInt(zx_num)-2;
        }
        document.getElementById(id).innerHTML = zx_num;
    }else{
        alert('请先选择赛方');
    }
}

//视频页展开事件
$('.vide_nr_show').toggle(function(){
        $('.video_none').show();
        $(this).css({'transform':'translateY(0.3rem) rotate(180deg)'})
},function(){
        $('.video_none').hide();
        $(this).css('transform','rotate(0deg)')
})



//获取url参数
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
var typeindex = getQueryString('typeindex')



//查询所有栏目
column();
var sumWidths = [];var sumWidth;
var tindex,menuData,clums;
function column(){
        $.ajax({
            beforeSend: function(){
                    $('#login_loading').show();
                    $('#login_loading > em').css('-webkit-animation-play-state','running')
            },
            complete: function (){
                    $('#login_loading').hide();
                    $('#login_loading > em').css('-webkit-animation-play-state','paused')
            },
            type:"GET",
            url:URI+"/pc/news/newtype",
            data: Object.assign(utils.getSpread(), {}),
            dataType:"json",
            success:function(data){
                if(data.success == 1){
                      
                      for(var i=0;i<data.data[0].childNode.length;i++){
                        var columnTypename = data.data[0].childNode[i].typeName;
                        $('.tabs').append('<a href="#" data-index="'+i+'" data-typeCode="'+data.data[0].childNode[i].typeCode+'">'+data.data[0].childNode[i].typeName+'</a>');
                        $('.swiper-wrapper').append('<div class="swiper-slide swiperout swiper-slide-next" id="swiper_zx'+(i+1)+'" style="width: 750px;"></div>');                        
                        $('#swiper_zx'+(i+1)).append('<div class="zx_page page'+(i+1)+'"><a href="javascript:;" class="break"></a>点击查看更多内容</div>')
                        $('#allChannel').append('<a href="javascript:;">'+data.data[0].childNode[i].typeName+'</a>');
                        $('.all_channel').css('margin-top','0');
                        sumWidth = $('.tabs a').eq(i).width();
                        sumWidths.push(sumWidth);  
                        if(typeindex == data.data[0].childNode[i].typeCode){
                            tindex = i;
                            $('.tabs a').eq(tindex).addClass('active').attr('data-zx','false');
                            //zxAd('#swiper_zx'+(tindex+1),data.data[0].childNode[i].typeCode);
                        }
               
                      }
                      
                      
                      var getindex = getsum();
                      function getsum(){
                        var sumw = 0;
                        var sumst;
                        var summar = parseInt($('.tabs a').css('margin-left'));
                        for(var t=0;t<sumWidths.length;t++){
                            sumw += parseInt(sumWidths[t]);
                            if(sumw < $('.nav_tabs').width()-30){
                                var sums = t-1;
                                var sumt = sumw;
                            }
                        }
                        $('.tabs').css('width',sumw+summar*2*(sumWidths.length+2))
                        var sumst = {
                            sums : sums,
                            sumt : sumt
                        }
                        return sumst;
                      }

                      if(!typeindex || typeindex == "2.3"){
                          $('.tabs > a').first().addClass('active').attr('data-zx','false');
                          zxAd('#swiper_zx1','2.3');
                          columnArticle('#swiper_zx1','2.3',0,5,1);
                          more('#swiper_zx1','2.3',0,10,1);
                          zxVote('#swiper_zx1');
                      }else{
                          zxAd('#swiper_zx'+(tindex+1),typeindex);
                          columnArticle('#swiper_zx'+(tindex+1),typeindex,tindex,5,1);
                          more('#swiper_zx'+(tindex+1),typeindex,tindex,10,1);
                      }
                      
                      loadSwiper(tindex,typeindex,getindex);
               }
            }
        });
}

//将多维数组转成一维数组
function plattenArray(arr) {
  return arr.reduce(function(acc, a) {
    var data = acc.concat();
    var item = Object.assign({}, a);
    var children = item.childNode ? item.childNode.concat() : [];
    delete item.childNode;
    data.push(item)
    if (children.length) {
      var chidrenData = plattenArray(children);
      data = data.concat(chidrenData);
    }
    return data;
  }, []);
}


var flag = true;
var scroll = false;
function loadSwiper(k,dataType,getindex){
    if(tabsSwiper) {
        tabsSwiper.slideTo(k);
    } else {
        tabsSwiper = new Swiper('#tabs-container',{
            speed:500,
            loop:false, 
            freeMode:false,  //值越大产生的动量弹性（momentum bounce）效果越明显
            //touchRatio:0.5,  //触屏比率.
            //longSwipesRatio:0.1, //Swiper 中到上/下滑块的触发率 
            //threshold:50,  //滑动的临界值，临界值单位为px，如果触屏距离小于该值滑块不会运动
            followFinger:false,//值为false时，仅当你释放slide时才会滑动，当你用手指按住滑块它不会动  
            observer: true,//修改swiper自己或子元素时，自动初始化swiper  
            observeParents: true,//修改swiper的父元素时，自动初始化swiper  
            onSlideChangeStart: function(){
                $(".tabs .active").removeClass('active')
                $(".tabs a").eq(tabsSwiper.activeIndex).addClass('active');
            
                
                var typeCode = $(".tabs a").eq(tabsSwiper.activeIndex).attr('data-typecode');
                var id = '#swiper_zx'+(tabsSwiper.activeIndex+1);
                var index = tabsSwiper.activeIndex;
                var lmlength = sumWidths.length;
                
                if(index > getindex.sums-2){
                    if(index > lmlength-5){
                    $('.tabs').css('-webkit-transform','translateX(-'+(sumWidths[index]*2*3)+'px)').attr('data-transform', sumWidths[index]*2*3);
                    }else{
                    $('.tabs').css('-webkit-transform','translateX(-'+(sumWidths[index]*2*(index-3))+'px)').attr('data-transform', sumWidths[index]*2*(index-3));
                    }
                }else{
                    $('.tabs').css('-webkit-transform','translateX(-'+0+'px)').attr('data-transform', 0);
                }
                
                if($(".tabs a").eq(tabsSwiper.activeIndex).attr('data-zx') == 'false'){
                    return false;
                }else{
                    if(index == 0){
                    zxAd('#swiper_zx1','2.3');
                    columnArticle('#swiper_zx1','2.3',5,1);
                    zxVote('#swiper_zx1');
                    more('#swiper_zx1','2.3',0,10,1);
                    }else{
                    zxAd(id,typeCode);
                    columnArticle(id,typeCode,index,5,1);
                    more(id,typeCode,index,10,1);
                    //$('#tabs-container').css('height','200px');
                    
                    }
                }
            
            }
        });
        tabsSwiper.slideTo(k);
        
    }

  $(".tabs a ,#allChannel a").on('touchend',function(e){
        e.preventDefault();
        $(".tabs .active").removeClass('active')
        $(this).addClass('active');
        tabsSwiper.slideTo($(this).index());
  })
  
  

  $('#allChannel a').on('touchend',function(){
      $('#channel').hide();
  })


}



//广告信息接口
function zxAd(id,typeCode){
        $.ajax({
            beforeSend: function(){
                    $('#login_loading').show();
                    $('#login_loading > em').css('-webkit-animation-play-state','running')
            },
            complete: function (){
                    $('#login_loading').hide();
                    $('#login_loading > em').css('-webkit-animation-play-state','paused')
            },
            type:"GET",
            url:URI+"/pc/operate/ad",
            data: Object.assign(utils.getSpread(), {menu:'9',token:sessionStorage.token,typeCode:typeCode}),
            dataType:"json",
            success:function(data){
                if(data.success == 1){
                    
                    var swiperSlids = [];
                    for(var i=0;i<data.data.length;i++){
                        var position = data.data[i].position;
                        switch(position){
                            case 1:
                                 break;
                            case 2:
                                 break;
                            case 15:
                                 var swiperSlid = '<div class="swiper-slide"><a href="'+data.data[i].adUrl+'"><img src="'+data.data[i].adImgUrl+'" width="100%" style="height:8.53rem;" /><span class="zx_swiper_mask">'+data.data[i].advTitle+'</span></a></div>';
                                 swiperSlids.push(swiperSlid);
                                 break;
                        }

                    }

                   $(id).prepend('<div class="swiper-container swiper1"><div class="swiper-wrapper" id="banderSwiper">'+swiperSlids.join("")+'</div><div class="swiper-pagination swiper-pagination1"></div></div>');
                   lunbo(id);
                  
               }

            }
        });
}

var pageClick = false;
//根据栏目类型查询文章
function columnArticle(id,typeCode,index,endRow,startRow){
        $.ajax({
            beforeSend: function(){
                    $('#login_loading').show();
                    $('#login_loading > em').css('-webkit-animation-play-state','running')
            },
            complete: function (){
                    $('#login_loading').hide();
                    $('#login_loading > em').css('-webkit-animation-play-state','paused')
            },
            type:"GET",
            url:URI+"/pc/news/articletop",
            data: Object.assign(utils.getSpread(), {compleCode:'2',endRow:endRow,isComple:'0',startRow:startRow,typeCode:typeCode}),
            dataType:"json",
            success:function(data){
                if(data.success == 1){
                    if(data.data.length == 0){
                         $(id+' .zx_page').text('没有更多数据啦');
                         return false;
                    }else{
                      var articleImg,articleImgs,releaseTime,isTop,lanmUrl;
                      $('.tabs a').eq(index).attr('data-zx','false')
                      for(var i=0;i<data.data.length;i++){
                        try{
                            articleImg = data.data[i].articleImg;
                            articleImgs = data.data[i].articleImg.split(',');
                        }catch(e){}
                         
                        releaseTime = data.data[i].releaseTime.replace(/-/g,'/');
                        showTime(releaseTime);
                        isTop = data.data[i].isTop? '<span class="zx_top">置顶</span>':'';
                        lanmUrl = 'index2.html?typeCode='+data.data[i].typeCode;
                        if(data.data[i].typeCode == '1.1' || data.data[i].typeCode == '1.2'){
                            lanmUrl = 'javascript:;'
                        }else{
                            lanmUrl = lanmUrl;
                        }
                        if(articleImg == undefined || articleImg == ""){
                            $(id).append('<section class="zx_show3 zx_show"><ul><li><a  href="/zixun/show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p><strong class="zx_sl_2">'+data.data[i].articleTitle+'</strong></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" class="typeClick"  data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeTopName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99 zx_show_date">'+timeDate+'</span></p></li></ul></section>');
                        }else{
                                switch(articleImgs.length){
                                        case 0:
                                            $(id).append('<section class="zx_show3 zx_show"><ul><li><a href="/zixun/show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p><strong class="zx_sl_2">'+data.data[i].articleTitle+'</strong></p><p class="zx_xian zx_show_bottom"></a><span class="blue zx_left"><a href="'+lanmUrl+'"  class="typeClick" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'&typeCode='+data.data[i].typeCode+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99 zx_show_date">'+timeDate+'</span></p></li></ul></section>');
                                            break;
                                        case 1:
                                            $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><a href="/zixun/show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><img src="'+articleImgs[0]+'"></a><strong class="strong_length strong_length_left"><a class="gray33 zx_title_r zx_sl_2" href="/zixun/show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+isTop+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                                            break;
                                        case 2:
                                            $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><a href="/zixun/show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><img src="'+articleImgs[0]+'"></a><strong class="strong_length strong_length_left"><a class="gray33 zx_title_r zx_sl_2" href="/zixun/show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+isTop+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                                            break;
                                        case 3:
                                            $(id).append('<section class="zx_show2 zx_show"><ul><li><a href="/zixun/show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p class="zdtop"><strong class="show2_img">'+data.data[i].articleTitle+'</strong>'+isTop+'</p><p class="zx_tp_3"><img src="'+articleImgs[0]+'"><img src="'+articleImgs[1]+'"><img src="'+articleImgs[2]+'"></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'"  class="typeClick blue" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></p></li></ul></section>')
                                            break;
                                        case 4:
                                            $(id).append('<section class="zx_show2 zx_show"><ul><li><a href="/zixun/show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p class="zdtop"><strong class="show2_img">'+data.data[i].articleTitle+'</strong>'+isTop+'</p><p class="zx_tp_3"><img src="'+articleImgs[0]+'"><img src="'+articleImgs[1]+'"><img src="'+articleImgs[2]+'"></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'"  class="typeClick blue" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></p></li></ul></section>')
                                            break;

                                }

                        }
                        
                        
                        /*
                        releaseTime = data.data[i].releaseTime.replace(/-/g,'/');
                        showTime(releaseTime);
                        isTop = data.data[i].isTop? '<span class="zx_top">置顶</span>':'';
                        if(articleImg == undefined || articleImg == ""){
                            $(id).append('<section class="zx_show1 zx_show"><ul><li class="showpadd"><p class="zx_content_show1"><strong class="strong_length oneStrong"><a class="gray33 zx_title_r" href="show.html?url='+data.data[i].articleUrl+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+isTop+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="index2.html?typeCode='+data.data[i].typeCode+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                        }else{
                              switch(articleImgs.length){
                                    case 0:
                                        $(id).append('<section class="zx_show3 zx_show"><ul><li><a  href="/zixun/show.html?url='+data.data[i].articleUrl+'&title='+data.data[i].id+'&typeCode='+typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p><strong class="">'+data.data[i].articleTitle+'</strong></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="index2.html?typeCode='+data.data[i].typeCode+'" class="typeClick"  data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeTopName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99 zx_show_date">'+timeDate+'</span></p></li></ul></section>');
                                        break;
                                    case 1:
                                        $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><a class="show1_left" href="show.html?url='+data.data[i].articleUrl+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><img src="'+articleImgs[0]+'"></a><strong class="strong_length"><a class="gray33 zx_title_r" href="show.html?url='+data.data[i].articleUrl+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+isTop+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="index2.html?typeCode='+data.data[i].typeCode+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                                        break;
                                    case 2:
                                        $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><a class="show1_left" href="show.html?url='+data.data[i].articleUrl+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><img src="'+articleImgs[0]+'"></a><strong class="strong_length"><a class="gray33 zx_title_r" href="show.html?url='+data.data[i].articleUrl+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+isTop+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="index2.html?typeCode='+data.data[i].typeCode+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                                        break;
                                    case 3:
                                        $(id).append('<section class="zx_show2 zx_show"><ul><li><a href="/zixun/show.html?url='+data.data[i].articleUrl+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p><strong class="zx_sl">'+data.data[i].articleTitle+'</strong>'+isTop+'</p><p class="zx_tp_3"><img src="'+articleImgs[0]+'"><img src="'+articleImgs[1]+'"><img src="'+articleImgs[2]+'"></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="index2.html?typeCode='+data.data[i].typeCode+'"  class="typeClick blue" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></p></li></ul></section>')

                                        //$(id).append('<section class="zx_show2 zx_show"><ul><li><a href="show.html?url='+data.data[i].articleUrl+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p><strong class="zx_sl">'+data.data[i].articleTitle+'</strong>'+isTop+'</p><p class="zx_tp_3"><img src="'+articleImgs[0]+'"><img src="'+articleImgs[1]+'"><img src="'+articleImgs[2]+'"></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="index2.html?typeCode='+data.data[i].typeCode+'"  class="typeClick blue" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></p></li></ul></section>')
                                        break;
                                    case 4:
                                        $(id).append('<section class="zx_show2 zx_show"><ul><li><a href="/zixun/show.html?url='+data.data[i].articleUrl+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p><strong class="zx_sl">'+data.data[i].articleTitle+'</strong>'+isTop+'</p><p class="zx_tp_3"><img src="'+articleImgs[0]+'"><img src="'+articleImgs[1]+'"><img src="'+articleImgs[2]+'"></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="index2.html?typeCode='+data.data[i].typeCode+'"  class="typeClick blue" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></p></li></ul></section>')

                                        //$(id).append('<section class="zx_show2 zx_show"><ul><li><a href="show.html?url='+data.data[i].articleUrl+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p><strong class="zx_sl">'+data.data[i].articleTitle+'</strong>'+isTop+'</p><p class="zx_tp_3"><img src="'+articleImgs[0]+'"><img src="'+articleImgs[1]+'"><img src="'+articleImgs[2]+'"></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="index2.html?typeCode='+data.data[i].typeCode+'"  class="typeClick blue" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></p></li></ul></section>')
                                        break;

                               }
                           


                        }
                        */
                      
                      }
                      
                      if(id == '#swiper_zx1'){
                          $(id+' .zx_show').last().find('.zx_xian').css('border','none')
                            
                      }
                      

                      var swperHei = $(id).css('height');
                      $(id).attr('data-height',swperHei);
                      /*
                      $(id).css({'border':'solid 1px green','overflow':'hidden'});
                      $('#tabs-container').css('overflow','hidden')
                      $('#tabs-container').css('height',swperHei+100);
                      console.log(swperHei);
                      */
                      
                    }

                    //$(id).css('height',swperHei)

               }
            }
        });
}


function lunbo(id){
        //swiper1 && typeof swiper1.destroy === 'function' ?  swiper1.destroy(): '';
        swiper1 = new Swiper(id + ' .swiper1', {
        pagination: '.swiper-pagination1',
        paginationClickable: true,
        spaceBetween: 30,
        speed: 500,
        autoplay:3000,
        loop: true,
        observer: true,
        observeParents: true,
        onSlideChangeEnd: function(swiper){
            swiper.update();
        }

    });

//   var swiper2 = new Swiper('.swiper2', {
//         pagination: '.swiper-pagination2',
//         paginationClickable: true,
//         spaceBetween: 30,
//         observer: true,
//         observeParents: true,
//         onSlideChangeEnd: function(swiper){
//             swiper.update();
//         }
//   });
}


//快投接口
var endTimessq,endTimesyy;
function zxVote(id){
        $.ajax({
            beforeSend: function(){
                    $('#login_loading').show();
                    $('#login_loading > em').css('-webkit-animation-play-state','running')
            },
            complete: function (){
                    $('#login_loading').hide();
                    $('#login_loading > em').css('-webkit-animation-play-state','paused')
            },
            type:"GET",
            url:URI+"/pc/home/fast",
            data: Object.assign(utils.getSpread(), {position:'2'}),
            dataType:"json",
            success:function(data){
                if(data.success == 1){
                      var categoryName,categoryNamejack,syy_hm,allHtml,sportSps,syynum;
                      for(var i=0;i<data.data.length;i++){
                        var fastTypeId = data.data[i].typeId;
                        var zx_ssq = '';
                        if(fastTypeId == 100){
                            var preDrawCode,preDrawCodes;
                            endTimessq = data.data[i].saleEndTime.replace(/-/g, '/');
                            setTimeout(function(){
                                sessionStorage.endTimesyy = endTimesyy;
                            },1000)
                            preDrawCode = (data.data[i].preDrawCode || '').replace('|',',');
                            preDrawCodes = preDrawCode.split(",");
                            var jackpotAmount = data.data[i].jackpotAmount && data.data[i].jackpotAmount.toString();
                            var ssq_hm = '<em class="kt_red">'+random_redAndBlue(6,1)[0][0]+'</em><em class="kt_red">'+random_redAndBlue(6,1)[0][1]+'</em><em class="kt_red">'+random_redAndBlue(6,1)[0][2]+'</em><em class="kt_red">'+random_redAndBlue(6,1)[0][3]+'</em><em class="kt_red">'+random_redAndBlue(6,1)[0][4]+'</em><em class="kt_red">'+random_redAndBlue(6,1)[0][5]+'</em><em class="kt_blue">'+random_redAndBlue(6,1)[1]+'</em>';
                            if(!$('.zx_kt_ssq').html()){
                                $(id).append('<section class="zx_kt_ssq"><h2 class="zx_show_h2">'+data.data[i].lotteryName+'</h2><p class="kt_smallfont kt_small">'+data.data[i].perIssue+'期开奖结果 <span><em class="red">'+preDrawCodes[0]+'</em><em class="red">'+preDrawCodes[1]+'</em><em class="red">'+preDrawCodes[2]+'</em><em class="red">'+preDrawCodes[3]+'</em><em class="red">'+preDrawCodes[4]+'</em><em class="red">'+preDrawCodes[5]+'</em><em class="blue">'+preDrawCodes[6]+'</em><em class="gray99 grayfont">奖池：</em><em class="red_contrary">'+jackpots(jackpotAmount)+'</em></span> </p><div class="kt_qsdate"><p><span class="kt_small">'+data.data[i].issueCode+'期截止时间还剩 <em id="getTime"></em></span><span class="kt_qh">'+ssq_hm+'<a href="javascript:;" class="break break_ssq"></a></span></p><a href="JavaScript:;" class="zx_bettingssq zx_betting zx_betting_margin">投注</a></div></section>');
                            } 
                            if(sessionStorage.endTimessq == endTimessq){
                                if(!$('.zx_kt_ssq').html()){
                                        $(id).append('<section class="zx_kt_ssq"><h2 class="zx_show_h2">'+data.data[i].lotteryName+'</h2><p class="kt_smallfont kt_small">'+data.data[i].perIssue+'期开奖结果 <span><em class="red">'+preDrawCodes[0]+'</em><em class="red">'+preDrawCodes[1]+'</em><em class="red">'+preDrawCodes[2]+'</em><em class="red">'+preDrawCodes[3]+'</em><em class="red">'+preDrawCodes[4]+'</em><em class="red">'+preDrawCodes[5]+'</em><em class="blue">'+preDrawCodes[6]+'</em><em class="gray99 grayfont">奖池：</em><em class="red_contrary">'+jackpots(jackpotAmount)+'</em></span> </p><div class="kt_qsdate"><p><span class="kt_small">'+data.data[i].issueCode+'期截止时间还剩 <em id="getTime"></em></span><span class="kt_qh">'+ssq_hm+'<a href="javascript:;" class="break break_ssq"></a></span></p><a href="JavaScript:;" class="zx_bettingssq zx_betting zx_betting_margin">投注</a></div></section>');
                                } 
                            }else{
                                setTimeout(function(){
                                    sessionStorage.endTimessq = endTimessq;
                                },1000)
                                allHtml = '<h2 class="zx_show_h2">'+data.data[i].lotteryName+'</h2><p class="kt_smallfont kt_small">'+data.data[i].perIssue+'期开奖结果 <span><em class="red">'+preDrawCodes[0]+'</em><em class="red">'+preDrawCodes[1]+'</em><em class="red">'+preDrawCodes[2]+'</em><em class="red">'+preDrawCodes[3]+'</em><em class="red">'+preDrawCodes[4]+'</em><em class="red">'+preDrawCodes[5]+'</em><em class="blue">'+preDrawCodes[6]+'</em><em class="gray99 grayfont">奖池：</em><em class="red_contrary">'+jackpots(jackpotAmount)+'</em></span> </p><div class="kt_qsdate"><p><span class="kt_small">'+data.data[i].issueCode+'期截止时间还剩 <em id="getTime"></em></span><span class="kt_qh">'+ssq_hm+'<a href="javascript:;" class="break break_ssq"></a></span></p><a href="JavaScript:;" class="zx_bettingssq zx_betting zx_betting_margin">投注</a></div>';
                                $('.zx_kt_ssq').empty().html(allHtml); 
                            }    
                            /*
                            if($('.zx_kt_ssq').html()){
                               allHtml = '<h2 class="zx_show_h2">'+data.data[i].lotteryName+'</h2><p class="kt_smallfont kt_small">'+data.data[i].perIssue+'期开奖结果 <span><em class="red">'+preDrawCodes[0]+'</em><em class="red">'+preDrawCodes[1]+'</em><em class="red">'+preDrawCodes[2]+'</em><em class="red">'+preDrawCodes[3]+'</em><em class="red">'+preDrawCodes[4]+'</em><em class="red">'+preDrawCodes[5]+'</em><em class="blue">'+preDrawCodes[6]+'</em><em class="gray99 grayfont">奖池：</em><em class="red_contrary">'+jackpots(jackpotAmount)+'</em></span> </p><div class="kt_qsdate"><p><span class="kt_small">'+data.data[i].issueCode+'期截止时间还剩 <em id="getTime"></em></span><span class="kt_qh">'+ssq_hm+'<a href="javascript:;" class="break break_ssq"></a></span></p><a href="JavaScript:;" class="zx_bettingssq zx_betting zx_betting_margin">投注</a></div>';
                               $('.zx_kt_ssq').empty().html(allHtml); 
                            }else{
                               $(id).append('<section class="zx_kt_ssq"><h2 class="zx_show_h2">'+data.data[i].lotteryName+'</h2><p class="kt_smallfont kt_small">'+data.data[i].perIssue+'期开奖结果 <span><em class="red">'+preDrawCodes[0]+'</em><em class="red">'+preDrawCodes[1]+'</em><em class="red">'+preDrawCodes[2]+'</em><em class="red">'+preDrawCodes[3]+'</em><em class="red">'+preDrawCodes[4]+'</em><em class="red">'+preDrawCodes[5]+'</em><em class="blue">'+preDrawCodes[6]+'</em><em class="gray99 grayfont">奖池：</em><em class="red_contrary">'+jackpots(jackpotAmount)+'</em></span> </p><div class="kt_qsdate"><p><span class="kt_small">'+data.data[i].issueCode+'期截止时间还剩 <em id="getTime"></em></span><span class="kt_qh">'+ssq_hm+'<a href="javascript:;" class="break break_ssq"></a></span></p><a href="JavaScript:;" class="zx_bettingssq zx_betting zx_betting_margin">投注</a></div></section>');
                            }
                            */
                            ktHlq('.break_ssq',6)
                            $(id).on('touchstart','.break_ssq',function(){
                                   ktHlq('.break_ssq',6)
                            })
                            betting('.zx_bettingssq',7,'.zx_kt_ssq','ssq','/ssq/index.html');
                            
                            
                        }else if(fastTypeId == 215){
                            endTimesyy = data.data[i].saleEndTime.replace(/-/g, '/');
                            setTimeout(function(){
                                sessionStorage.endTimesyy = endTimesyy;
                            },1000)
                            
                            var categoryId = data.data[i].categoryId || '';
                            switch(categoryId)
                            {
                                 case 1:
                                      categoryName = "任八";
                                      categoryNamejack = '5';
                                      syynum = 8;
                                      syy_hm = '<em class="kt_red">'+random_redAndBlue(8,0)[0][0]+'</em><em class="kt_red">'+random_redAndBlue(8,0)[0][1]+'</em><em class="kt_red">'+random_redAndBlue(8,0)[0][2]+'</em><em class="kt_red">'+random_redAndBlue(8,0)[0][3]+'</em><em class="kt_red">'+random_redAndBlue(8,0)[0][4]+'</em><em class="kt_red">'+random_redAndBlue(8,0)[0][5]+'</em><em class="kt_red">'+random_redAndBlue(8,0)[0][6]+'</em><em class="kt_red">'+random_redAndBlue(8,0)[0][7]+'</em>';
                                      break;
                                 case 2:
                                      categoryName = "任二";
                                      categoryNamejack = '2';
                                      syynum = 2;
                                      syy_hm = '<em class="kt_red">'+random_redAndBlue(2,0)[0][0]+'</em><em class="kt_red">'+random_redAndBlue(2,0)[0][1]+'</em>';
                                      break;
                                 case 3:
                                      categoryName = "任三";
                                      categoryNamejack = '3';
                                      syynum = 3;
                                      syy_hm = '<em class="kt_red">'+random_redAndBlue(3,0)[0][0]+'</em><em class="kt_red">'+random_redAndBlue(3,0)[0][1]+'</em><em class="kt_red">'+random_redAndBlue(3,0)[0][2]+'</em>';
                                      break;  
                                 case 4:
                                      categoryName = "任四";
                                      categoryNamejack = '4';
                                      syynum = 4;
                                      syy_hm = '<em class="kt_red">'+random_redAndBlue(4,0)[0][0]+'</em><em class="kt_red">'+random_redAndBlue(4,0)[0][1]+'</em><em class="kt_red">'+random_redAndBlue(4,0)[0][2]+'</em><em class="kt_red">'+random_redAndBlue(4,0)[0][3]+'</em>';
                                      break;  
                                 case 5:
                                      categoryName = "任五";
                                      categoryNamejack = '5';
                                      syynum = 5;
                                      syy_hm = '<em class="kt_red">'+random_redAndBlue(5,0)[0][0]+'</em><em class="kt_red">'+random_redAndBlue(5,0)[0][1]+'</em><em class="kt_red">'+random_redAndBlue(5,0)[0][2]+'</em><em class="kt_red">'+random_redAndBlue(5,0)[0][3]+'</em><em class="kt_red">'+random_redAndBlue(5,0)[0][4]+'</em>';
                                      break;  
                                 case 6:
                                      categoryName = "任六";
                                      categoryNamejack = '5';
                                      syynum = 6;
                                      syy_hm = '<em class="kt_red">'+random_redAndBlue(6,0)[0][0]+'</em><em class="kt_red">'+random_redAndBlue(6,0)[0][1]+'</em><em class="kt_red">'+random_redAndBlue(6,0)[0][2]+'</em><em class="kt_red">'+random_redAndBlue(6,0)[0][3]+'</em><em class="kt_red">'+random_redAndBlue(6,0)[0][4]+'</em><em class="kt_red">'+random_redAndBlue(6,0)[0][5]+'</em>';
                                      break;  
                                 case 7:
                                      categoryName = "任七";
                                      categoryNamejack = '5';
                                      syynum = 7;
                                      syy_hm = '<em class="kt_red">'+random_redAndBlue(7,0)[0][0]+'</em><em class="kt_red">'+random_redAndBlue(7,0)[0][1]+'</em><em class="kt_red">'+random_redAndBlue(7,0)[0][2]+'</em><em class="kt_red">'+random_redAndBlue(7,0)[0][3]+'</em><em class="kt_red">'+random_redAndBlue(7,0)[0][4]+'</em><em class="kt_red">'+random_redAndBlue(7,0)[0][5]+'</em><em class="kt_red">'+random_redAndBlue(7,0)[0][6]+'</em>';
                                      break;                 
                                      
                            }
                            if(!$('.zx_kt_syy').html()){
                                 $(id).append('<section class="zx_kt_syy"><h2 class="zx_show_h2">'+data.data[i].lotteryName+'</h2><div class="kt_sydate"><p class="kt_sy"><span class="kt_small">'+data.data[i].issueCode+'期 截止时间还剩 <em id="getTimessy"></em></span><span class="kt_qh"><i class="gray99 wanf" data-wanf="'+syynum+'">'+categoryName+'：</i>'+syy_hm+'<a href="javascript:;" class="break break_syy"></a></span></p><p class="kt_qsdate kt_sy_line"><span class="kt_small_s">任选'+syynum+'个号，所选号中含开出的'+categoryNamejack+'个奖号即中奖</span><a href="JavaScript:;" class="zx_betting zx_bettingsyy">投注</a></p></div></section>');
                            } 
                            if(sessionStorage.endTimesyy == endTimesyy){
                               if(!$('.zx_kt_syy').html()){
                                 $(id).append('<section class="zx_kt_syy"><h2 class="zx_show_h2">'+data.data[i].lotteryName+'</h2><div class="kt_sydate"><p class="kt_sy"><span class="kt_small">'+data.data[i].issueCode+'期 截止时间还剩 <em id="getTimessy"></em></span><span class="kt_qh"><i class="gray99 wanf" data-wanf="'+syynum+'">'+categoryName+'：</i>'+syy_hm+'<a href="javascript:;" class="break break_syy"></a></span></p><p class="kt_qsdate kt_sy_line"><span class="kt_small_s">任选'+syynum+'个号，所选号中含开出的'+categoryNamejack+'个奖号即中奖</span><a href="JavaScript:;" class="zx_betting zx_bettingsyy">投注</a></p></div></section>');
                               } 
                            }else{
                                setTimeout(function(){
                                    sessionStorage.endTimesyy = endTimesyy;
                                },1000)
                                allHtml = '<h2 class="zx_show_h2">'+data.data[i].lotteryName+'</h2><div class="kt_sydate"><p class="kt_sy"><span class="kt_small">'+data.data[i].issueCode+'期 截止时间还剩 <em id="getTimessy"></em></span><span class="kt_qh"><i class="gray99 wanf" data-wanf="'+syynum+'">'+categoryName+'：</i>'+syy_hm+'<a href="javascript:;" class="break break_syy"></a></span></p><p class="kt_qsdate kt_sy_line"><span class="kt_small_s">任选'+categoryName+'个号，所选号中含开出的'+categoryNamejack+'个奖号即中奖</span><a href="JavaScript:;" class="zx_betting zx_bettingsyy">投注</a></p></div>';
                                $('.zx_kt_syy').empty().html(allHtml);
                            /*
                            if($('.zx_kt_syy').html()){
                                   allHtml = '<h2 class="zx_show_h2">'+data.data[i].lotteryName+'</h2><div class="kt_sydate"><p class="kt_sy"><span class="kt_small">'+data.data[i].issueCode+'期 截止时间还剩 <em id="getTimessy"></em></span><span class="kt_qh"><i class="gray99 wanf" data-wanf="'+syynum+'">'+categoryName+'：</i>'+syy_hm+'<a href="javascript:;" class="break break_syy"></a></span></p><p class="kt_qsdate kt_sy_line"><span class="kt_small_s">任选'+categoryName+'个号，所选号中含开出的'+categoryNamejack+'个奖号即中奖</span><a href="JavaScript:;" class="zx_betting zx_bettingsyy">投注</a></p></div>';
                                   $('.zx_kt_syy').empty().html(allHtml);
                            }else{
                                   $(id).append('<section class="zx_kt_syy"><h2 class="zx_show_h2">'+data.data[i].lotteryName+'</h2><div class="kt_sydate"><p class="kt_sy"><span class="kt_small">'+data.data[i].issueCode+'期 截止时间还剩 <em id="getTimessy"></em></span><span class="kt_qh"><i class="gray99 wanf" data-wanf="'+syynum+'">'+categoryName+'：</i>'+syy_hm+'<a href="javascript:;" class="break break_syy"></a></span></p><p class="kt_qsdate kt_sy_line"><span class="kt_small_s">任选'+categoryName+'个号，所选号中含开出的'+categoryNamejack+'个奖号即中奖</span><a href="JavaScript:;" class="zx_betting zx_bettingsyy">投注</a></p></div></section>');

                            }
                            */
                            }
                            ssyktHlq('.break_syy',syynum); 
                            $(id).on('touchstart','.break_syy',function(){
                                   ssyktHlq('.break_syy',syynum);
                            })
                            betting('.zx_bettingsyy',8,'.zx_kt_syy','','/sd11x5/index.html')
                            
                              
                        }else if(fastTypeId == 300){ 
                            
                            try{
                            var sportSp = data.data[i].sportSp[0] || '';
                            if($('.betBox').html()){             
                                   sportSps = '<div class="betBox"><div class="betSwiper"><div class="bet active fl"><a href="'+data.data[i].fastUrl+'"><div class="title">投注</div><div class="message"><span>'+sportSp.officialMatchCode+'</span><span> '+sportSp.matchName+'</span><span>'+sportSp.startTime.substring(5,10)+' '+sportSp.startTime.substring(11,16)+' 开赛</div><div class="competition"><div class="first one fl"><div class="pic fl"></div><span class="player fl">'+sportSp.homeShortName+'</span></div><div class="stopTime fl"><span class="time">'+sportSp.saleEndTime.substring(11,16)+'截止</span><span class="grey"></span></div><div class="first second fl"><span class="player fl">'+sportSp.visitiShortName+'</span><div class="pic"></div></div></div></a></div></div></div>';
                                   $('.betBox').empty().html(sportSps);  
                            }else{
                                   sportSps = '<div class="betBox"><div class="betSwiper"><div class="bet active fl"><a href="'+data.data[i].fastUrl+'"><div class="title">投注</div><div class="message"><span>'+sportSp.officialMatchCode+'</span><span> '+sportSp.matchName+' </span><span>'+sportSp.startTime.substring(5,10)+' '+sportSp.startTime.substring(11,16)+' 开赛</div><div class="competition"><div class="first one fl"><div class="pic fl"></div><span class="player fl">'+sportSp.homeShortName+'</span></div><div class="stopTime fl"><span class="time">'+sportSp.saleEndTime.substring(11,16)+'截止</span><span class="grey"></span></div><div class="first second fl"><div class="pic"></div><span class="player">'+sportSp.visitiShortName+'</span></div></div></a></div></div></div>';
                                   $(id).append(sportSps); 
                            }
                            $('.competition .one .pic').css('background-image','url('+sportSp.homeLogoUrl+')');
                            $('.competition .second .pic').css('background-image','url('+sportSp.visitiLogoUrl+')');
                        }catch(error){}
                        
                        }

                   
                    }

     
               }
            }
        });
}



//奖池显示规则
function jackpots(nber){
   if(nber){
    var jack;
    if(nber >= 100000000){
        var jackw = (nber/100000000).toFixed(1);
        jackw = jackw.split(".");
        if(jackw[1] == 0){
            jack = jackw[0]+'亿 ';
        }else{
            jack = jackw[0]+'亿 '+jackw[1]+'千万';
        }
    }else if(nber >= 10000){
        jack = (nber/10000).toFixed(2)+'万';
    }else{
        jack = nber;
    }
    
   }else{
     jack = '';
   } 
   return jack;
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

//双色球，随机红球
function random_selectBall_red(rednum,exclude){
  var redBallArr = [];
  var tempArr = [];
  exclude = exclude || [];
  var tempArr2 = tempArr.concat(exclude);
  for (var i = 0; i < rednum; i++) {
    var redBall = parseInt( Math.random() * 33 + 1 ); //随机产生一个随机号码
    redBall = redBall > 9? redBall+"" : "0" + redBall;  //是否大于9   1 2 3 -- 01 02 03
    for (var j = 0; j < tempArr2.length; j++) {
      if(tempArr2[j] == redBall){
        if (tempArr2.length > 0){
          tempArr2.splice(j,1);
        }
        i--;
        break;
      }
    }
    tempArr2.push(redBall);  // 保存到临时数组中
  }

  // 是否有已选择的号码.如果有去掉
  if (exclude.length > 0){
    tempArr = tempArr2.filter(function(e) { return exclude.indexOf(e) < 0; });
  }else {
    tempArr = tempArr2;
  }

  redBallArr = tempArr.sort();
  //console.log('随机生成的号码'+ redBallArr.toString());
  //console.log('已有的号码'+ exclude.toString());
  return redBallArr;
};

//十一选五，随机红球
function ssyrandom_selectBall_red(rednum,exclude){
  var redBallArr = [];
  var tempArr = [];
  exclude = exclude || [];
  var tempArr2 = tempArr.concat(exclude);
  for (var i = 0; i < rednum; i++) {
    var redBall = parseInt( Math.random() * 11 + 1 ); //随机产生一个随机号码
    redBall = redBall > 9? redBall+"" : "0" + redBall;  //是否大于9   1 2 3 -- 01 02 03
    for (var j = 0; j < tempArr2.length; j++) {
      if(tempArr2[j] == redBall){
        if (tempArr2.length > 0){
          tempArr2.splice(j,1);
        }
        i--;
        break;
      }
    }
    tempArr2.push(redBall);  // 保存到临时数组中
  }

  // 是否有已选择的号码.如果有去掉
  if (exclude.length > 0){
    tempArr = tempArr2.filter(function(e) { return exclude.indexOf(e) < 0; });
  }else {
    tempArr = tempArr2;
  }

  redBallArr = tempArr.sort();
  //console.log('随机生成的号码'+ redBallArr.toString());
  //console.log('已有的号码'+ exclude.toString());
  return redBallArr;
};

//随机篮球
function random_selectBall_blue(blueNum){
    var blueBallArr = [];
    for (var i = 0; i < blueNum; i++) {
        var blueBall =  parseInt( Math.random() * 16 + 1);
        blueBall = blueBall > 9? blueBall : "0"+blueBall;
        for (var j = 0; j < blueBallArr.length; j++) {
            if(blueBallArr[j] == blueBall){
                blueBallArr.splice(j,1);
                i--;
                break;
            }
        }
        blueBallArr.push(blueBall);
    }
    return blueBallArr;
};

//随机生成红篮球
function random_redAndBlue(redNum,blueNum){
    var tempArr = [];
    tempArr.push(random_selectBall_red(redNum).sort());
    tempArr.push( random_selectBall_blue(blueNum));
    return tempArr;
};
//随机生成红篮球，十一运
function ssyrandom_redAndBlue(redNum,blueNum){
    var tempArr = [];
    tempArr.push(ssyrandom_selectBall_red(redNum).sort());
    tempArr.push( random_selectBall_blue(blueNum));
    return tempArr;
};

//快投点击投注
function betting(tzBetting,numlen,czname,cz,url){
        $(tzBetting).on('touchstart',function(){
            //if (userinfo){
            var arr = [];
            for(var k=0;k<numlen;k++){
                if(k == numlen-1){
                    var blue = $(czname+' .kt_qh em').eq(k).html();
                }else{
                    var red = $(czname+' .kt_qh em').eq(k).html();
                    arr.push(red);
                }

            }
            var ballOrder = {
                blue : blue,
                red : arr.join(','),
                period : '1',
                text : $('.wanf').attr('data-wanf')
            }
            sessionStorage.setItem(cz+'ballOrder', JSON.stringify(ballOrder));
            location.href = url;
            //}else{
            //    location.href = '/login/login.html';
           // }
        })
    
}

//快投点击刷新，双色球
function ktHlq(ktclass,numlen){
    var redBalls = random_redAndBlue(numlen,1)[0].sort();
    var blueBalls = random_redAndBlue(numlen,1)[1];
    for(var y=0;y<numlen;y++){
        $(ktclass).parent().find('em').eq(y).html(redBalls[y]);
    }
    $(ktclass).parent().find('em').eq(numlen).html(blueBalls);
}
//快投点击刷新，十一运
function ssyktHlq(ktclass,numlen){
    var redBalls = ssyrandom_redAndBlue(numlen,1)[0].sort();
    var blueBalls = random_redAndBlue(numlen,1)[1];
    for(var y=0;y<numlen;y++){
        $(ktclass).parent().find('em').eq(y).html(redBalls[y]);
    }
    $(ktclass).parent().find('em').eq(numlen).html(blueBalls);
}



//loading效果
var login_loading = "<div id='login_loading'><em></em><em></em><em></em><em></em><em></em><em></em><em></em><em></em></div>";
$('body').append(login_loading);

//获取服务器时间
function servicetime(){
 $.ajax({
    type:"GET",
    url:URI+"/pc/home/servicetime",
    data: Object.assign(utils.getSpread(), {}),
    dataType:"json",
    success:function(data){
        if(data.success == 1){
             sessionStorage.servicetime = data.data;   
        }
    }
 });
}

//快投截止时间
function GetRTime(time,id,tims){
    // servicetime();
    if(time){
        var EndTime= new Date(time);
        var NowTime =  sessionStorage.servicetime;
        var t =EndTime.getTime() - NowTime;
        var d=0;
        var h=0;
        var m=0;
        var s=0;
        if(t>0){
        d=Math.floor(t/1000/60/60/24);
        h=Math.floor(t/1000/60/60%24);
        m=Math.floor(t/1000/60%60);
        s=Math.floor(t/1000%60);
        
        if(m<10 && m>0){
            m = "0"+m;
        }else{
            m = m;
        }
        if(s<10 && s>0){
            s = "0"+s;
        }else{
            s = s;
        }
        }
        

        var hours = d*24+h;
        if(hours<10 && hours>0){
            hours = "0"+hours; 
        }else{
            hours = hours;
        }
        if(id == "#getTimessy"){
            $(id).text(  m + ": "+ s  );
        }else{
            $(id).text( hours + ": "+ m + ": "+ s  ); 
        }
        
        if( m == 0 && s == 0){
            tims = true;
        }else{
            tims = false;
        }
        return tims;
    }else{
        return false;
    }
}

//十一选五截止倒计时
setInterval(function(){
        var ssy = GetRTime(endTimesyy,'#getTimessy',timer2);
        if(ssy){
            zxVote('#swiper_zx1');
            timer2 = false;
            //GetRTime(endTimesyy,'#getTimessy',timer2);
        }
        
},1000);

//双色球截止倒计时
setInterval(function(){
        var ssq = GetRTime(endTimessq,'#getTime',timer);
        if(ssq){
            zxVote('#swiper_zx1');
            timer = false;
        }
},1000)

function more(id,typeCode,index,endRow,startRow){
    pageClick = true;
    var counts = 1;
    $('.page'+(index+1)).on('click',function(){
        counts++;
        columnArticle(id,typeCode,index,counts*endRow,(counts*endRow-9));
    })
}





