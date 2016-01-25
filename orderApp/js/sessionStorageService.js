'use strict';
/* httpService */

var sessionStorageService = angular.module("sessionStorageService",[]);

// httpService config
sessionStorageService.run(function($http) {
 // $http.defaults.headers.common.Authorization = 'Basic a2lkMT=='
});

//session storage api
sessionStorageService.factory("sessionStorage",["$window",function($window){
									var put = function(key,value){
										var json = JSON.stringify(value);
										$window.sessionStorage.setItem(key,json);
										};
									var get = function(key){
										var value = $window.sessionStorage.getItem(key);
										if(value!=null&&value!='undefined'){
											return JSON.parse(value);
											}else{
											return null;	
											}
										
										};
									var remove = function(key){
										$window.sessionStorage.removeItem(key);
										}; 
									var removeAll = function(){
										$window.sessionStorage.clear();
										};
									return {
										put:function(key,value){
											return put(key,value);
											},
										get:function(key){
											return get(key);
											},
										remove:function(key){
											return remove(key);
											},
										removeAll:function(){
											return removeAll();
											}
										};
									}]);

