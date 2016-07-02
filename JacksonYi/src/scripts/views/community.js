var tplCommunity = require("../templates/community.string");

SPA.defineView("community",{
  html:tplCommunity,

  bindEvents:{
    'show':function(){
      //下拉刷新，上拉加载
         var scrollSize = 30;
         var myScroll = this.widgets.communityScroll;
         myScroll.scrollBy(0, -scrollSize);

         var head = $('.head img'),
             topImgHasClass = head.hasClass('up');
         var foot = $('.foot img'),
             bottomImgHasClass = head.hasClass('down');
         myScroll.on('scroll', function () {
           $('h4.fixed').remove();
             var y = this.y,
                 maxY = this.maxScrollY - y;
             if (y >= 0) {
                 !topImgHasClass && head.addClass('up');
                 return '';
             }
             if (maxY >= 0) {
                 !bottomImgHasClass && foot.addClass('down');
                 return '';
             }
         });

         myScroll.on('scrollEnd', function () {

             if (this.y >= -scrollSize && this.y < 0) {
                 myScroll.scrollTo(0, -scrollSize);
                 head.removeClass('up');
             } else if (this.y >= 0) {
                 head.attr('src', '/JacksonYi/images/ajax-loader.gif');
                 // ajax下拉刷新数据
                 setTimeout(function () {
                     myScroll.scrollTo(0, -scrollSize);
                     head.removeClass('up');
                     head.attr('src', '/JacksonYi/images/arrow.png');
                 }, 1000);
             }
             var maxY = this.maxScrollY - this.y;
             var self = this;
             if (maxY > -scrollSize && maxY < 0) {
                 myScroll.scrollTo(0, self.maxScrollY + scrollSize);
                 foot.removeClass('down');
             } else if (maxY >= 0) {
                 foot.attr('src', '/JacksonYi/images/ajax-loader.gif');
                 // ajax上拉加载数据


             }
           });
           //停靠菜单
           var communityScroll = this.widgets.communityScroll;
           communityScroll.on('scroll', function () {
//            console.log(this.y);
            if(this.y<0 && this.y>-195){
                if($('section').siblings(' h4').length > 0){
                  ;
                } else {
                  $('section').after($('.dynamic h4').clone(true).addClass('fixed'));
                }
              }else if(this.y <= -195 && this.y > -428) {
                  if($('section').siblings(' h4').length > 1){
                    ;
                  } else {
                    $('section').after($('.walking h4').clone(true).addClass('fixed'));
                  }
                }else if(this.y <= -428 && this.y > -596 ) {
                    if($('section').siblings(' h4').length > 2){
                      ;
                    } else {
                      $('section').after($('.source h4').clone(true).addClass('fixed'));
                    }
                  }else if(this.y <= -596 && this.y > -694) {
                      if($('section').siblings(' h4').length > 3){
                        ;
                      } else {
                        $('section').after($('.seaworld h4').clone(true).addClass('fixed'));
                      }
                    }else if(this.y <= -694) {
                        if($('section').siblings(' h4').length > 4){
                          ;
                        } else {
                          $('section').after($('.alley h4').clone(true).addClass('fixed'));
                        }
                      }else {
               $('h4.fixed').remove();
             };
//            console.log($('.walking').offset().top);

     });

    }



  }

})
