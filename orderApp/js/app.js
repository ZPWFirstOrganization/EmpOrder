var orderApp = angular.module('orderApp', [ "ui.router", "ngResource","sessionStorageService"], function($httpProvider) {
	
});

orderApp.value('baseUrl',
 'http://wzdcbdeo01/emporder/api/v1/'//后台服务url
 )
orderApp.value('baseSysUrl', 
'http://wzdcbdeo01:8820/UserLogin.aspx'//系统管理的链接
)
//阿里云：  http://182.92.110.219:8090/
//dev  		http://wzdcbdeo01/emporder/api/v1/
//UAT  		http://WJDCBUEO02/emporder/api/v1/
//UAT 管理	http://WJDCBUEO02:8820/UserLogin.aspx
//DEV 管理	http://wzdcbdeo02:8820/UserLogin.aspx

orderApp.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.when("","/home/discountType=2&productClass=1&productCode=1&page=1");
	// $urlRouterProvider.otherwise("/home/productClass=1&productCode=1&page=1");
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
			url:'/login/discountType={discountType}',
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
        function(event, toState, toParams, fromState, fromParams){
			//判断是否需要登陆        	
        	if (!scopeData.isLogin && toState.name!="regist"){
        		setTimeout(function(){
        			$state.go('login',{discountType:$.getUrlParam('discountType')});
        		},100);
        		return;
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
})
