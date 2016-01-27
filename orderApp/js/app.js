var orderApp = angular.module('orderApp', [ "ui.router", "homeModule"]);

orderApp.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.when("","/home/productClass={productClass}&productCode={productCode}&page={page}");
	$urlRouterProvider.otherwise("/home/productClass={productClass}&productCode={productCode}&page={page}");
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
				'mobileHeader@index': {
	                templateUrl: 'tpls/mobileHeader.html'
	            },
	            'mobileNav@index': {
	                templateUrl: 'tpls/mobileNav.html'
	            },
	            'pcHeader@index': {
	                templateUrl: 'tpls/pcHeader.html'
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
			templateUrl: 'tpls/productList.html'
		}).state('index.currentOrder',{
			url:'/currentOrder',
			templateUrl:'tpls/currentOrder.html'
		})
})

