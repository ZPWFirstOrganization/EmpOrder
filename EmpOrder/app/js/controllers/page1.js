// var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('page1Controller',['$scope','$http','commoditylist',function ($scope,$http,commoditylist) {
	$scope.popPage = function(){
		window.history.back(-1);
		// window.location.href="login.jsp?backurl="+window.location.href
	};
	$scope.getList = function(){
		commoditylist.getList().success(function(response) {
			alert(JSON.stringify(response))
		});
	};
	// $http.get("http://182.92.110.219:8090/api/Product?type=2")
	// 		.success(function(response) {
	// 			alert(JSON.stringify(response))
	// });
}]);
