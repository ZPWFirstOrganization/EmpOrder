'use strict';
var demoServices = angular.module('demoServices', []);

demoServices.run(function($http) {
 // $http.defaults.headers.common.Authorization = 'Basic a2lkMT=='
});

// demoServices.service('commoditylistServ',['$http',function($http){
//     this.get = function($http) {
//     	alert("开始请求数据")
//     	alert(typeof($http))
// 	    $http.get("http://182.92.110.219:8090/api/Product?type=2")
// 			.success(function(response) {
// 				alert(JSON.stringify(response))
// 		});
//     };
// }]);
demoServices.service('commoditylist', function($http) { // injectables go here

  this.getList = function() {
    return $http.get("http://182.92.110.219:8090/api/Product?type=2")
  }
});