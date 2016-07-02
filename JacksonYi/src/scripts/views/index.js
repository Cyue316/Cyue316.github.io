var tplIndex = require('../templates/index.string');//获取index页面


//SPA.util
var _ = SPA.util;

SPA.defineView('index', {
  html: tplIndex,

   plugins: ['delegated'],

    modules:[{
      name:'content',
      views:['home','community','message','find'],
      defaultTag:'home',
      container:'.container'
    }],

    bindActions: {
        'switch_tab':function(e,data){
//          console.log(e);
           $(e.el).addClass('active').siblings().removeClass('active');
           this.modules.content.launch(data.tag);
        },

        'tap.message':function(){//_.storage():封装好的函数，一个参数取，两个参数设置

          if(_.storage('isLogin') ){
              SPA.getView('index',function(view){
              view.modules.content.launch('message');
              $('footer ul li').eq(3).addClass('active').siblings().removeClass('active');
//                console.log(view);
            });
//                SPA.open('message');
          }else{
            SPA.open('login');
//              console.log(1);
              _.storage('isLogin',true);
          }

        }
    }




});
