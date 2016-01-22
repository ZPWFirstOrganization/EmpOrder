var demo = angular.module('order_app', [
	// "ngRoute",
	"ui.router",
	"demoControllers",
	"demoServices"
]);
demo.config(function($stateProvider,$urlRouterProvider){
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
				'toolbar@index': {
	                templateUrl: 'tpls/header.html'
	            },
	            'main@index': {
	                templateUrl: 'tpls/container.html'
	            }
			}
		})
		// .state('index',{
		// 	url:'/home',
		// 	templateUrl:'tpls/header.html',
		// })
		.state('index.fragment1',{
			url:'/fragment1',
			templateUrl:'tpls/fragment1.html'
		})
		.state('index.fragment2',{
			url:'/fragment2',
			templateUrl:'tpls/fragment2.html'
		})
		.state('index.fragment3',{
			url:'/fragment3',
			templateUrl:'tpls/fragment3.html'
		})
		.state('page1',{
			url:'/page1',
			templateUrl:'tpls/page1.html'
		})
		.state('page2',{
			url:'/page2',
			templateUrl:'tpls/page2.html'
		})
		.state('page3',{
			url:'/page3',
			templateUrl:'tpls/page3.html'
		})
		// .state('home',{
		// 	url:'/home',
		// 	templateUrl:'tpls/home.html'
		// })
})
