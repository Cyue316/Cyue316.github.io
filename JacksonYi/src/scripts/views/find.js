var tplFind = require("../templates/find.string");

SPA.defineView("find",{
  html:tplFind,

  plugins : ['delegated'],

  bindActions :{
    'go_homepage':function(){
      SPA.open('homepage');
    },
    'go_setting':function(){
      SPA.open('setting');
    }
  },


  bindEvents: {
    show:function(){
      var find_swiper = new Swiper("#find-banner-swiper",{
        loop:true,
        autoplay:3000,
        pagination: '.swiper-pagination',
        autoplayDisableOnInteraction : false
      })

    }
  }
})
