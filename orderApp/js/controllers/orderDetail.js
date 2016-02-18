orderApp.controller('orderDetailCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData){
	$scope.orderData
	apiCaller.getOrderDetailInfo({orderID:"7f845abe-d177-4aaa-bf74-05f94bab0603"},function(res){
		// console.log(res[0])
		$scope.orderData = res[0]
	},function(res){
		$scope.orderData = {product:{}}
	})
	
})