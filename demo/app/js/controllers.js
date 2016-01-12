var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('homeController', ['$scope',function ($scope) {
	$scope.pushPage = function (){
		alert("push")
	};
}]);

demoControllers.controller('page2Controller', ['$scope',function ($scope) {
	
}]);

demoControllers.controller('page3Controller', ['$scope',function ($scope) {
	
}]);