var tplHomepage = require('../templates/homepage.string');

SPA.defineView('homepage',{
  html:tplHomepage,

  plugins:['delegated'],

  bindActions:{
    'back':function(){
      this.hide();
    },
    'go_setting':function(){
      SPA.open('setting');
    }
  }
})
