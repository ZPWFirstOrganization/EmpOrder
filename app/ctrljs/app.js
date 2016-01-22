var orderApp = angular.module('orderApp', [
	// "ngRoute",
	"ui.router",
	"homeModule",
]);

orderApp.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.when("","/home");
	$urlRouterProvider.otherwise('/home');
	$stateProvider
		.state('index',{
			url:'/home',
			templateUrl:'tpls/home.html',
			views:{
				'':{
					templateUrl:'tpls/home.html'
				},
				'tips@index':{
					templateUrl: 'tpls/tips.html'
				},
				'productList@index':{
					templateUrl: 'tpls/productList.html'
				},
				'mobileNav@index': {
	                templateUrl: 'tpls/mobileNav.html'
	            },
	            'mobileHeader@index': {
	                templateUrl: 'tpls/mobileHeader.html'
	            },
	            'pcHeader@index': {
	                templateUrl: 'tpls/pcHeader.html'
	            }
			}
		})
})
