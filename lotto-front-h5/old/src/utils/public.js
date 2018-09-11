$(function(){
    /**
     * 号码栏
     */
    var numCart = {
        keyBordShow_qi:function(){
            $(".nowBuy").css({
                visibility: "hidden"
            })
            $(".addNum_keybord").show();
            $(".addTimes_keybord").hide();

            $(".numcart .slide").animate({
                height:"3rem"
            });
            $(".numcart .slid .numList").animate({
                height:"4.5rem"
            });

            $(".up_down").css({
                marginBottom: "3.2rem"
            });
        },
        keyBordShow_bei:function(){
            $(".nowBuy").css({
                visibility: "hidden"
            })
            $(".addNum_keybord").hide();
            $(".addTimes_keybord").show();

            $(".numcart .slide").animate({
                height:"3rem"
            });
            $(".numcart .slid .numList").animate({
                height:"4.5rem"
            });
            $(".up_down").animate({
                marginBottom: "3.2rem"
            })
        },
    }





})