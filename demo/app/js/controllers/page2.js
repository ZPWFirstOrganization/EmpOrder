// var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('page2Controller', ['$scope',function ($scope) {
	$scope.popPage = function(){
		window.history.back(-1);
		// window.location.href="login.jsp?backurl="+window.location.href
	}
}]);
