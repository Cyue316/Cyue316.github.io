var tplMessage = require("../templates/message.string");

SPA.defineView("message",{
  html:tplMessage,

  plugins: ['delegated'],

  bindActions:{
    
  },

  bindEvents:{
    'show':function(){

    }
  }
})
