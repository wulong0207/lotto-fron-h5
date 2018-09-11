var swiper1 = null;
var tabsSwiper;
//新闻内页获取内容地址
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}

var getUrl = {
    typeCode : getQueryString('typeCode')
}

//显示全部导航事件
$('.nav_select').on('touchstart',function(){
        $('#channel').show();
})

$('.zx_index_close').on('click',function(){
        $('#channel').hide();
})


//查询所有栏目
var tindex,menuData,clums;
column();
function column(){
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
            url:URI+"/pc/news/newtype",
            data: Object.assign(utils.getSpread(), {}),
            dataType:"json",
            success:function(data){
                if(data.success == 1){
                      menuData = plattenArray(data.data);
                      clums = [];
                      for(var i=0;i<data.data[0].childNode.length;i++){
                           var clum = '<a href="javascript:;" data-index="'+i+'" data-typeCode="'+data.data[0].childNode[i].typeCode+'">'+data.data[0].childNode[i].typeName+'</a>';
                           clums.push(clum);
                      }

                      $('#allChannel').append(clums.join(''));
                      switchType(getUrl.typeCode)

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
function loadSwiper(k,dataType,getindex){
    if(tabsSwiper) {
        tabsSwiper.slideTo(k);
    } else {
        tabsSwiper = new Swiper('#tabs-container',{
            speed:500,
            followFinger:false,//值为false时，仅当你释放slide时才会滑动，当你用手指按住滑块它不会动  
            observer: true,//修改swiper自己或子元素时，自动初始化swiper  
            observeParents: true,//修改swiper的父元素时，自动初始化swiper  
            onSlideChangeStart: function(){
            $(".tabs .active").removeClass('active')
            $(".tabs a").eq(tabsSwiper.activeIndex).addClass('active');
            var typeCode = $(".tabs a").eq(tabsSwiper.activeIndex).attr('data-typecode');
            var id = '#swiper_zx'+(tabsSwiper.activeIndex+1);
            var index = tabsSwiper.activeIndex;
            var distance = 0;
            var lmlength = sumWidths.length;
  
            if(index > getindex.sums-2){
                if(lmlength < 10){
                    if(index < lmlength-5){
                    $('.tabs').css('-webkit-transform','translateX(-'+(sumWidths[index]*2*3)+'px)').attr('data-transform', sumWidths[index]*2*3);
                    }else{
                    $('.tabs').css('-webkit-transform','translateX(-'+(sumWidths[index]*2*(index-3))+'px)').attr('data-transform', sumWidths[index]*2*(index-3));
                    }
                }else{
                    if(index > lmlength-5){
                    $('.tabs').css('-webkit-transform','translateX(-'+(sumWidths[index]*2*3)+'px)').attr('data-transform', sumWidths[index]*2*3);
                    }else{
                    $('.tabs').css('-webkit-transform','translateX(-'+(sumWidths[index]*2*(index-3))+'px)').attr('data-transform', sumWidths[index]*2*(index-3));
                    }
                }
            }else{
                $('.tabs').css('-webkit-transform','translateX(-'+0+'px)').attr('data-transform', 0);
            }
            if($(".tabs a").eq(tabsSwiper.activeIndex).attr('data-zx') == 'false'){
                return false;
            }else{
                zxAd(id,typeCode);
                columnArticle(id,typeCode,index,10,1);
                more(id,typeCode,index,10,1);
            }


            }
        });
        tabsSwiper.slideTo(k);
    }

  $(".tabs a ,#childChannel a").on('touchstart',function(e){
        e.preventDefault();
        $(".tabs .active").removeClass('active')
        $(this).addClass('active');
        tabsSwiper.slideTo($(this).index());
  })

  $('#allChannel a').on('touchstart',function(){
      location.href="index.html?typeindex="+$(this).attr('data-typecode');
  })

  $('#childChannel a').on('touchend',function(){
      $('#channel').hide();
  })


}



//栏目切换
var k;
var sumWidths = [];var sumWidth;
function switchType(dataType){
    var dataTypeCode = dataType.split('.');
    var dataLength = dataTypeCode.length;
    var ptype;
    switch(dataLength)
    {
        case 2:
              $('.child_channel').hide();
              $('.all_channel').css('margin-top','0')
              ptype = dataTypeCode[0];
              break;
        case 3:
              ptype = dataTypeCode[0]+'.'+dataTypeCode[1];
              break;
        case 4:
              ptype = dataTypeCode[0]+'.'+dataTypeCode[1]+'.'+dataTypeCode[2];
              break;
    }
    
    var curMenu = menuData.filter(m => m.parentTypeCode == ptype);
    
    $('.tabs').html('');
    $('.swiper-wrapper').html('');
    for(var i=0;i<curMenu.length;i++){
          $('.tabs').append('<a href="#" data-index="'+i+'" data-typeCode="'+curMenu[i].typeCode+'">'+curMenu[i].typeName+'</a>');
          $('.swiper-wrapper').append('<div class="swiper-slide swiperout swiper-slide-next" id="swiper_zx'+(i+1)+'" style="width: 750px;"></div>');
          $('#swiper_zx'+(i+1)).append('<div class="zx_page page'+(i+1)+'"><a href="javascript:;" class="break"></a>点击查看更多内容</div>')
          if(ptype != 2){
               $('.child_channel').show();
               $('#childChannel').append('<a href="javascript:;" data-index="'+i+'" data-typeCode="'+curMenu[i].typeCode+'">'+curMenu[i].typeName+'</a>');
          }
          sumWidth = $('.tabs a').eq(i).width();
          sumWidths.push(sumWidth);  
           
          if(dataType == curMenu[i].typeCode){
              $('.tabs > a').eq(i).addClass('active').attr('data-zx','false').siblings().removeClass('active');
              k = i;
              zxAd('#swiper_zx'+(i+1),curMenu[i].typeCode);
              columnArticle('#swiper_zx'+(i+1),curMenu[i].typeCode,i,10,1);
              more('#swiper_zx'+(i+1),curMenu[i].typeCode,i,10,1);
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
                var sumt = parseInt(sumWidths[t]);
            }
        }
        $('.tabs').css('width',sumw+summar*2*(sumWidths.length+2))
        var sumst = {
            sums : sums,
            sumt : sumt
        }
        return sumst;
    }

    loadSwiper(k,dataType,getindex);

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
}

//广告信息接口
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
                                 var swiperSlid = '<div class="swiper-slide"><a href="'+data.data[i].adUrl+'"><img src="'+data.data[i].adImgUrl+'" width="100%" style="height:8rem;" /><span class="zx_swiper_mask">'+data.data[i].advTitle+'</span></a></div>';
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

//根据栏目类型查询文章
function columnArticle(id,typeCode,index,endRow,startRow){
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
            url:URI+"/pc/news/articletop",
            data: Object.assign(utils.getSpread(), {compleCode:'',endRow:endRow,isComple:'0',startRow:startRow,typeCode:typeCode}),
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
                            $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><strong class="strong_length oneStrong"><a class="gray33 zx_title_r zx_sl_2" href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+isTop+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                        }else{
                              switch(articleImgs.length){
                                    case 0:
                                        $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><strong class="strong_length oneStrong"><a class="gray33 zx_title_r zx_sl_2" href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+isTop+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                                        break;
                                    case 1:
                                        $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><a href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><img src="'+articleImgs[0]+'"></a><strong class="strong_length strong_length_left"><a class="gray33 zx_title_r zx_sl_2" href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+isTop+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                                        break;
                                    case 2:
                                        $(id).append('<section class="zx_show1 zx_show"><ul><li><p class="zx_content_show1"><a href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><img src="'+articleImgs[0]+'"></a><strong class="strong_length strong_length_left"><a class="gray33 zx_title_r zx_sl_2" href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'">'+data.data[i].articleTitle+isTop+'</a><span class="zx_content_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></span></strong></p></li></ul></section>')
                                        break;
                                    case 3:
                                        $(id).append('<section class="zx_show2 zx_show"><ul><li><a href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p class="zdtop"><strong class="show2_img">'+data.data[i].articleTitle+'</strong>'+isTop+'</p><p class="zx_tp_3"><img src="'+articleImgs[0]+'"><img src="'+articleImgs[1]+'"><img src="'+articleImgs[2]+'"></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'"  class="typeClick blue" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></p></li></ul></section>')
                                        break;
                                    case 4:
                                        $(id).append('<section class="zx_show2 zx_show"><ul><li><a href="show.html?url='+data.data[i].articleUrl.match(/:(\S*)/)[1]+'&title='+data.data[i].id+'&typeCode='+data.data[i].typeCode+'&articleLabel='+data.data[i].articleLabel+'"><p class="zdtop"><strong class="show2_img">'+data.data[i].articleTitle+'</strong>'+isTop+'</p><p class="zx_tp_3"><img src="'+articleImgs[0]+'"><img src="'+articleImgs[1]+'"><img src="'+articleImgs[2]+'"></p></a><p class="zx_xian zx_show_bottom"><span class="blue zx_left"><a href="'+lanmUrl+'"  class="typeClick blue" data-typeCode="'+data.data[i].typeCode+'">'+data.data[i].typeName+'</a></span><span class="zx_left gray99">'+data.data[i].createBy+'</span><span class="zx_left gray99">'+timeDate+'</span></p></li></ul></section>')
                                        break;

                               }
                           


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

//loading效果
var login_loading = "<div id='login_loading'><em></em><em></em><em></em><em></em><em></em><em></em><em></em><em></em></div>";
$('body').append(login_loading);

function more(id,typeCode,index,endRow,startRow){
    var counts = 1;
    $('.page'+(index+1)).on('click',function(){
        counts++;
        columnArticle(id,typeCode,index,counts*endRow,(counts*endRow-9));
    })
}

