var orderApp = angular.module('orderApp', [ "ui.router", "ngResource","sessionStorageService"], function($httpProvider) {
	
});

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

orderApp.run(function($state,userProfile,scopeData,scopeMethod){
	scopeData.isMobile = scopeMethod.isMobile();
	// setTimeout(function(){
	// 	$state.go('login',{discountType:$.getUrlParam('discountType')});
	// },100)
	
	// userProfile.getProfile($.getUrlParam('discountType'));
})