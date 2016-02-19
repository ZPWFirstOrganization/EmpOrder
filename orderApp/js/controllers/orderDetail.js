orderApp.controller('orderDetailCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData){
	$scope.orderData
	apiCaller.getOrderDetailInfo({orderID:$stateParams.orderID},function(res){
		// console.log(res[0])
		$scope.orderData = res[0]
	},function(res){
		$scope.orderData = {product:{}}
	})
	
})