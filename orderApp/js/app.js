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
			url:'/currentOrder',
			templateUrl:'tpls/currentOrder.html'
		}).state('index.historyOrder',{
			url:'/historyOrder/page={page}&orderDate={orderDate}',
			templateUrl:'tpls/historyOrder.html',
			params:{
				orderParam:{}
			}
		}).state('index.personInfo',{
			url:'/personInfo',
			templateUrl:'tpls/personInfo.html'
		}).state('index.orderDetail',{
			url:'/orderDetail/orderID={orderID}',
			templateUrl:'tpls/orderDetail.html'
		}).state('index.product',{
			url:'/product/productCode={productCode}',
			templateUrl:'tpls/product.html'
		}).state('index.notice',{
			url:'/notice',
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
			url:'/regist',
			templateUrl:'tpls/regist.html',
		})
})

