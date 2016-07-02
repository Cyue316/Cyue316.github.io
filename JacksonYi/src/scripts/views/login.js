var tplLogin = require("../templates/login.string");

//SPA.util
var _ = SPA.util;
var _self = null;

SPA.defineView("login",{
  html: tplLogin,

  plugins: ['delegated',{
    name: 'avalon',
    options: function(vm){
      vm.username = "";
      vm.password = "";
      vm.submit = function(){
//        console.log(1);
        $.ajax({
           url:'/JacksonYi/mock/save.json',
           type: 'get',
           data: {
             username:vm.username,//保存的数据
             password:vm.password
           },
           success:function(res){//存储用户名和密码
             _.storage("isLogin",{
               "username":vm.username,
               "password":vm.password
             });
              SPA.getView('index',function(view){
                _self.hide();
                view.modules.content.launch('find');
                $('footer ul li').eq(4).addClass('active').siblings().removeClass('active');
//                console.log(view);
              });
         }
        })
      }
    }
}],

  bindActions:{
    'back':function(){
      this.hide();
    }

},

 bindEvents: {
   'show': function () {
     _self = this;//储存当前视图
   }
 }


})
