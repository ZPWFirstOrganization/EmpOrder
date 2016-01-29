var orderApp = angular.module('orderApp', [ "ui.router", "homeModule"]);

orderApp.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.when("","/home/productClass={productClass}&productCode={productCode}&page={page}");
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
			url:"/productClass={productClass}&productCode={productCode}&page={page}",
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
		}).state('index.product',{
			url:'/product/productCode={productCode}',
			templateUrl:'tpls/product.html'
		})
})

