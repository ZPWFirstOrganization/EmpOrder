var controllersModule = angular.module('controllersModule',['httpService']);

controllersModule.factory('scopeData',function() {
	return{
		Production       :{"productName":"玫琳凯臻时粹颜™精华乳1"},
		currentProductCode   :'10000699'          //产品code
	}
});

controllersModule.service('scopeMethod',function($state,scopeData,apiCaller) {
	return{

		changeState:function(ProductCode) {
			scopeData.currentProductCode = ProductCode;
			$state.go('index.product',{productCode:scopeData.currentProductCode});
			apiCaller.getProductByStates();
		}
	}
})

controllersModule.factory('apiCaller',function($stateParams,ApiService,scopeData) {
	return{
		getProductByStates:function(){
			scopeData.Production = ApiService.getProduct(
			{
				code:scopeData.currentProductCode, //产品code
				userAccount:'123123'
			})
		}
	}
});

controllersModule.controller('prductController',function($scope,$stateParams,$state,scopeData,scopeMethod,apiCaller) {

	$scope.product = scopeData.Production;

});
