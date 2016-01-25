var orderApp = angular.module('orderApp', [ "ui.router", "homeModule"]);

orderApp.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.when("","/home/productClass={productClass:[1,2]{0,1}}&productCode={productCode:[0,9]*}&page={page:[0,9]{0,2}}");
	$urlRouterProvider.otherwise("/home/productClass={productClass:[1,2]{0,1}}&productCode={productCode:[0,9]*}&page={page:[0,9]{0,2}}");
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
			url:'/productClass={productClass:[1,2]{0,1}}&productCode={productCode:[0,9]*}&page={page:[0,9]{0,2}}',
			templateUrl: 'tpls/productList.html'
		}).state('index.currentOrder',{
			url:'/currentOrder',
			templateUrl:'tpls/currentOrder.html'
		})
})

