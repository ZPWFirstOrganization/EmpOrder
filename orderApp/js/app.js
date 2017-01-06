var orderApp = angular.module('orderApp', [ "ui.router", "ngResource","sessionStorageService"]);

orderApp.value('baseUrl',
'http://WJDCBUEO02/h5/emporder/api/v1/'			//		后台服务url
)
orderApp.value('baseAuthUrl',
'http://WJDCBUEO02/Authentication/api/'			//		auth url
)
orderApp.value('baseSysUrl2', 
'http://WJDCBUEO02/admin/Default.aspx'			//		系统管理的2折链接
)
orderApp.value('baseSysUrl6', 
'http://WJDCBUEO02/admin/employee-6/Default.aspx'// 	系统管理的6折链接
)
//TEST			http://114.215.97.19:1133/h5/emporder/api/v1/
//dev  			http://wjdcbdeo01/h5/emporder/api/v1/
//UAT  			http://WJDCBUEO02/h5/emporder/api/v1/
//UAT 管理2折	http://WJDCBUEO02/admin/Default.aspx
//UAT 管理6折	http://WJDCBUEO02/admin/employee-6/Default.aspx
//DEV 管理2折	http://wjdcbdeo01/admin/Default.aspx
//DEV 管理6折	http://wjdcbdeo01/admin/employee-6/Default.aspx

orderApp.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.when("","/login/discountType=2&firstLogin=1");
	$stateProvider.state('index',{
			url:'/home',
			templateUrl:'tpls/home.html',
			views:{
				'':{
					templateUrl:'tpls/home.html'
				},
				'tips@index':{
					templateUrl: 'tpls/tips.html'
				},
	            'pcHeader@index': {
	                templateUrl: 'tpls/pcHeader.html'
	            },
	            'mobileHeader@index': {
	                templateUrl: 'tpls/mobileHeader.html'
	            },
				'container@index':{
					templateUrl: 'tpls/container.html'
				},
	            'foot@index': {
	                templateUrl: 'tpls/foot.html'
	            }
			}
		}).state('index.productList',{
			url:"/discountType={discountType}&productClass={productClass}&productCode={productCode}&page={page}",
			templateUrl: 'tpls/productList.html',
			views:{
				'':{
					templateUrl: 'tpls/productList.html'
				},
	            'mobileNav@index': {
	                templateUrl: 'tpls/mobileNav.html'
	            },
			}
		}).state('index.currentOrder',{
			url:'/currentOrder/discountType={discountType}',
			templateUrl:'tpls/currentOrder.html'
		}).state('index.historyOrder',{
			url:'/historyOrder/discountType={discountType}&page={page}&orderDate={orderDate}',
			templateUrl:'tpls/historyOrder.html',
			params:{
				orderParam:{}
			}
		}).state('index.personInfo',{
			url:'/personInfo/discountType={discountType}',
			templateUrl:'tpls/personInfo.html'
		}).state('index.orderDetail',{
			url:'/orderDetail/discountType={discountType}&orderID={orderID}',
			templateUrl:'tpls/orderDetail.html'
		}).state('index.product',{
			url:'/product/discountType={discountType}&productCode={productCode}',
			templateUrl:'tpls/product.html'
		}).state('index.notice',{
			url:'/notice/discountType={discountType}',
			templateUrl:'tpls/notice.html'
		}).state('index.favorites',{
			url:'/favorites/discountType={discountType}&page={page}',
			templateUrl:'tpls/favorites.html',
			controller:'favController'
		}).state('index.searchResult',{
			url:'/searchResult/discountType={discountType}&key={key}&page={page}',
			templateUrl:'tpls/searchResult.html',
			controller:'searchResultController'
		}).state('regist',{
			url:'/regist/discountType={discountType}',
			templateUrl:'tpls/regist.html',
		}).state('login',{
			url:'/login/discountType={discountType}&firstLogin={firstLogin}',
			templateUrl:'tpls/login.html',
		}).state('index.chart',{
			url:'/chart/discountType={discountType}',
			templateUrl:'tpls/chart.html',
			controller:'chartController'
		})
})

orderApp.run(function($state,$rootScope,$location,userProfile,scopeData,scopeMethod){
	scopeData.isMobile = scopeMethod.isMobile();
	
	//监听路由事件
    $rootScope.$on('$stateChangeStart',
        function(event,toState,toParams,fromState,fromParams){
        	//手机端将ad存到scopeData中
   			if(scopeMethod.isAndOrIosMobile()){
        		scopeData.ad = $.getUrlParam('domainAccount') ? $.getUrlParam('domainAccount'):"";
        	}
        	setTimeout(function(){
        		if($('#main').height()<=($(window).height()-30)){
				  	$('.footer-wrapper').addClass("footer-wrapper-scale")
				}else{
				  	$('.footer-wrapper').removeClass("footer-wrapper-scale")
				}
        	},100);
        	if (toState.name == "index.productList" && toParams.productClass == "1" && toParams.productCode == "1" && toParams.page == "1"){
        		scopeData.isHomePage = true
        	}else{
        		scopeData.isHomePage = false
        	}
    })
    $rootScope.$on('$stateChangeSuccess',
        function(event,toState,toParams,fromState,fromParams){
			//判断是否需要登陆       	
        	if (!scopeData.isLogin && toState.name!="regist" && toState.name!="login"){
        		// setTimeout(function(){
        			// alert("login")
        			// alert($.getUrlParam('discountType'))
        			$state.go('login',{discountType:$.getUrlParam('discountType'),firstLogin:0});
        		// },100);
        		return;
        	}
    })
})
