orderApp.controller('orderDetailCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData,sessionStorage){
	$('html,body').animate({scrollTop: '0px'},0)
	sessionStorage.put("sourcePageId","2")
	$scope.orderData
	apiCaller.getOrderDetailInfo({orderID:$stateParams.orderID},function(res){
		console.log(res[0])
		$scope.orderData = res[0]
	},function(res){
		$scope.orderData = {product:{}}
	})
	$scope.prodClick = function(prodState,prodCode){
		prodState = parseInt(prodState)
		if (prodState == 1){

		}else{
			$state.go('index.product',{productCode:prodCode})
		}
	}
	
})