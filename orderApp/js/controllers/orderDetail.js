orderApp.controller('orderDetailCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData,sessionStorage){
	$('html,body').animate({scrollTop: '0px'},0)
	scopeData.discountType = $stateParams.discountType;
	$scope.discountType = scopeData.discountType;
	sessionStorage.put("sourcePageId","2")
	$scope.orderData
	apiCaller.getOrderDetailInfo({orderID:$stateParams.orderID},function(res){
		$scope.orderData = res[0]
	},function(res){
		$scope.orderData = {product:{}}
	})
	$scope.prodClick = function(prodState,prodCode){
		if (prodState){
			$state.go('index.product',{discountType:scopeData.discountType,productCode:prodCode})
		}
	}
	
})