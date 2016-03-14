1 配置IIS
2 将web工程拷贝到IIS配置目录
3 访问index.html

url配置：
orderApp\js\app.js文件的第6和第9行

orderApp.value('baseUrl',
 'http://WJDCBUEO01/emporder/api/v1/'          //后台服务url
)

orderApp.value('baseSysUrl', 
'http://WJDCBUEO01:8820/UserLogin.aspx'        //系统管理的链接
)