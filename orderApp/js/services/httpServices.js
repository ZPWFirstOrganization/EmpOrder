'use strict';
var httpService = angular.module('httpService', ['ngResource'], function($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	var param = function(obj) {
		var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
		for(name in obj) {
			value = obj[name];
		    
			if(value instanceof Array) {
			    for(i=0; i<value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
			    }
			}else if(value instanceof Object) {
			    for(subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
			    }
			}else if(value !== undefined && value !== null){
			    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
			}
		}
		return query.length ? query.substr(0, query.length - 1) : query;
	};

	$httpProvider.defaults.transformRequest = [function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
});

httpService.factory('ApiService',['$resource',function($resource){
	var baseUrl = 'http://182.92.110.219:8090/MLK/'
	return $resource(
		baseUrl,
		{},
		{
			getCategories:{
				url:baseUrl+'2/Product',
				method:'GET',
				isArray:true
			},
			getProductList:{
				url:baseUrl+'2/Product',
				method:'GET',
				params:{
					code:'@code',//大类传大类的id,小类传小类的CONFIG_VALUE
					productClass:'@productClass',//大类为1，小类为2
					pageNum:'@pageNum',
					userAccount:'@userAccount'
				},
				isArray:false
			},
			getSecretary:{
				url:baseUrl+'2/User',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				}
			},
			getFavoriteList:{
				url:baseUrl+'2/Favorite',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				}
			},
			getBalance:{
				url:baseUrl+'2/Role',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				}
			},
			getOrderDate:{
				url:baseUrl+'2/Order',
				method:'GET',
				isArray:true
			},
			postOrderedProduct:{
				url:baseUrl+'2/Order',
				method:'POST',
				data:{
					userAccount:'@userAccount',
					productCode:'@productCode',
					count:'@count'
				}
			}
		}
	);
}]);