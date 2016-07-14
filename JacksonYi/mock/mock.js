//将/JacksonYi/mock/source.json与/api/getlivelist.php做一个映射
module.exports = {
  rules:[
    {
      pattern: /\/api\/getLivelist.php\?rtype=origin$/,//ajax请求的url---普通的点不转义属性值可自定义
      respondwith: './source.json'//真正的本地服务
    },
    {
      pattern: /\/api\/getLivelist.php\?rtype=more$/,
      respondwith: './source_more.json'
    },
    {
      pattern: /\/api\/getLivelist.php\?rtype=refresh$/,
      respondwith: './source_refresh.json'
    },
    {
      pattern: /\/api\/saveData.php$/,
      respondwith: './save.json'
    }
  ]
};
