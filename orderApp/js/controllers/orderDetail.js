orderApp.controller('orderDetailCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData){
	
	apiCaller.getOrderDetailInfo({orderID:"2f56efcb-ed6c-47cf-94f2-385384208a74"},function(res){
		console.log(res)
	})
	
})