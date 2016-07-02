var tplSet = require('../templates/setting.string');

SPA.defineView("setting",{
  html:tplSet,

  plugins: ['delegated'],

  bindActions:{
    'back':function(){
      this.hide();
    }
  }

})
