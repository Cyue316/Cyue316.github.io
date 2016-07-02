var tplHome = require("../templates/home.string");

//引用公共方法
var util = require('../utils/fn.js');

SPA.defineView("home",{
  html:tplHome,

  plugins:['delegated',{//引用插件两种方法--引用avalaon插件
    name:'avalon',//插件名
    options:function(vm){//vm---视图和数据---局部变量
      vm.sourselist = [];//绑定变量初始化定义为空数组---用获取到的json里的list里的数组来渲染数据
      vm.sourselist1 = [];
      vm.sourselist2 = [];
    }

  }],

  init:{
    mySwiper:null
    //一维数组变二维数组---一个ulli有两个li
    // formateDate:function(attr){
    //   var tempArr = [];//一维
    //   for(var i =0; i<Math.ceil(arr.length/2);i++){//两个一组
    //     tempArr[i] = [];//二维
    //     tempArr[i].push(arr[2*i]);
    //     tempArr[i].push(arr[2*i+1]);
    //   }
    //   return tempArr;
    // }
  },

  bindActions: {
    'tap.slide':function(e,data){
      this.mySwiper.slideTo($(e.el).index())
    }
  },

  bindEvents:{
    beforeShow:function(){
      var that =this;//this---指向view
      //如何获取vm对象
      that.vm = that.getVM();//this---当前视图

      $.ajax({
       url:'/JacksonYi/mock/source.json',
        // url:'/api/getLivelist.php',//发线上用.php---network---XHR
        type:'get',//第一次加载数据
        data:{
          rtype:'origin'

        },
        success:function(res){//成功以后返回结果--res即json数据
//          console.log(res);//数据获取成功VM
          that.vm.sourselist = res.page_1_list;//上面拿到vm对象，这儿将获取到的json数据里的page_1_list对象(需要的)
          that.vm.sourselist1 = res.page_2_list;
          that.vm.sourselist2 = res.page_3_list;
        //将获取到的数据处理后在赋值
//       var.sourselist = that.formateDate(res.page_1_list);this---当前指向success方法是ajax对象，不会指向视图
        }

      });
    },



    show:function(){
      var that = this;
      var preindex = 0;
      var mySwiper1 = new Swiper("#banner-swiper",{
         loop:true,
         autoplay:3000,
         pagination: '.swiper-pagination',
         autoplayDisableOnInteraction : false,//循环

         onSlideChangeEnd: function(swiper){
//            alert('事件触发了;');

          preindex = swiper.activeIndex;
          if(preindex == 4){
            preindex =1;
          }
  //         console.log(preindex);
          $("#banner-swiper h3").eq(preindex-1).show().siblings("h3").hide();

          }
      });

      var mySwiper2 = new Swiper("#banner-swiper2",{
         loop:true,
         autoplay:3000,
         pagination: '.swiper-pagination',
         autoplayDisableOnInteraction : false,

         onSlideChangeEnd: function(swiper){

        preindex = swiper.activeIndex;
        if(preindex == 4){
          preindex =1;
        };

        $("#banner-swiper2 h3").eq(preindex-1).show().siblings("h3").hide();

      }
      });

      var mySwiper3 = new Swiper("#banner-swiper3",{
         loop:true,
         autoplay:3000,
         pagination: '.swiper-pagination',
         autoplayDisableOnInteraction : false,
         onSlideChangeEnd: function(swiper){
          preindex = swiper.activeIndex;
          if(preindex == 4){
            preindex =1;
          }

          $("#banner-swiper3 h3").eq(preindex-1).show().siblings("h3").hide();

          }
      });

      that.mySwiper = new Swiper('#home-swiper', {
        loop: false,
//        freeMode : true,
//        freeModeMomentum : false,
        onSlideChangeStart: function (swiper) {
//        console.log(swiper.activeIndex);
          var index = swiper.activeIndex;
          var $lis = $('.myhome nav li');
          util.setFocus($lis.eq(index));
        }
      });

      //page_1下拉刷新，上拉加载
        var scrollSize = 30;
         var myScroll = this.widgets.homeIndexScroll;
         myScroll.scrollBy(0, -scrollSize);

         var head = $('.head img'),
             topImgHasClass = head.hasClass('up');
         var foot = $('.foot img'),
             bottomImgHasClass = head.hasClass('down');
         myScroll.on('scroll', function () {
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

                 $.ajax({
                   url:'/JacksonYi/mock/source_refresh.json',
                   data:{
                     rtype:'refresh'
                   },
                   success:function(res){
                     that.vm.sourselist =
                     res.page_2_list.concat(that.vm.sourselist);
                   }
                 })

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

               $.ajax({
                 url:'/JacksonYi/mock/source_more.json',
                 data:{
                   rtype:'more'
                 },
                 success:function(res){
                 //console.log(res.page_2_list);
                     that.vm.sourselist =
                     that.vm.sourselist.concat(res.page_1_list);
                 }
               })

             }
           })

           //page_2下拉刷新，上拉加载
             var scrollSize = 30;
              var myScroll1 = this.widgets.homeAuthorScroll;
              myScroll1.scrollBy(0, -scrollSize);

              var head = $('.head img'),
                  topImgHasClass = head.hasClass('up');
              var foot = $('.foot img'),
                  bottomImgHasClass = head.hasClass('down');
              myScroll1.on('scroll', function () {
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

              myScroll1.on('scrollEnd', function () {
                  if (this.y >= -scrollSize && this.y < 0) {
                      myScrol1l.scrollTo(0, -scrollSize);
                      head.removeClass('up');
                  } else if (this.y >= 0) {
                      head.attr('src', '/JacksonYi/images/ajax-loader.gif');
                      // ajax下拉刷新数据

                      $.ajax({
                        url:'/JacksonYi/mock/source_refresh.json',
                        data:{
                          rtype:'refresh'
                        },
                        success:function(res){
                          that.vm.sourselist1 =
                          res.page_2_list.concat(that.vm.sourselist1);
                        }
                      })

                      setTimeout(function () {
                          myScroll1.scrollTo(0, -scrollSize);
                          head.removeClass('up');
                          head.attr('src', '/JacksonYi/images/arrow.png');
                      }, 1000);
                  }
                  var maxY = this.maxScrollY - this.y;
                  var self = this;
                  if (maxY > -scrollSize && maxY < 0) {
                      myScroll1.scrollTo(0, self.maxScrollY + scrollSize);
                      foot.removeClass('down');
                  } else if (maxY >= 0) {
                      foot.attr('src', '/JacksonYi/images/ajax-loader.gif');
                      // ajax上拉加载数据

                    $.ajax({
                      url:'/JacksonYi/mock/source_more.json',
                      data:{
                        rtype:'more'
                      },
                      success:function(res){
                      //console.log(res.page_2_list);
                          that.vm.sourselist1 =
                          that.vm.sourselist1.concat(res.page_2_list);
                      }
                    })

                  }
                })

                //page_3下拉刷新，上拉加载
                   var scrollSize = 30;
                   var myScroll2 = this.widgets.homeChatScroll;
                   myScroll2.scrollBy(0, -scrollSize);

                   var head = $('.head img'),
                       topImgHasClass = head.hasClass('up');
                   var foot = $('.foot img'),
                       bottomImgHasClass = head.hasClass('down');
                   myScroll2.on('scroll', function () {
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

                   myScroll2.on('scrollEnd', function () {
                       if (this.y >= -scrollSize && this.y < 0) {
                           myScroll2.scrollTo(0, -scrollSize);
                           head.removeClass('up');
                       } else if (this.y >= 0) {
                           head.attr('src', '/JacksonYi/images/ajax-loader.gif');
                           // ajax下拉刷新数据

                           $.ajax({
                             url:'/JacksonYi/mock/source_refresh.json',
                             data:{
                               rtype:'refresh'
                             },
                             success:function(res){
                               that.vm.sourselist2 =
                               res.page_2_list.concat(that.vm.sourselist2);
                             }
                           })

                           setTimeout(function () {
                               myScroll2.scrollTo(0, -scrollSize);
                               head.removeClass('up');
                               head.attr('src', '/JacksonYi/images/arrow.png');
                           }, 1000);
                       }
                       var maxY = this.maxScrollY - this.y;
                       var self = this;
                       if (maxY > -scrollSize && maxY < 0) {
                           myScroll2.scrollTo(0, self.maxScrollY + scrollSize);
                           foot.removeClass('down');
                       } else if (maxY >= 0) {
                           foot.attr('src', '/JacksonYi/images/ajax-loader.gif');
                           // ajax上拉加载数据

                         $.ajax({
                          url:'/JacksonYi/mock/source_more.json',
                           data:{
                             rtype:'more'
                           },
                           success:function(res){
                           //console.log(res.page_2_list);
                               that.vm.sourselist2 =
                               that.vm.sourselist2.concat(res.page_3_list);
                           }
                         })

                       }
                     })


        }
     }
 });
