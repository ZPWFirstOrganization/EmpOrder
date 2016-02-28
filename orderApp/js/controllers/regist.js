orderApp.controller('registCtrl',function($q,$scope,$state,$scope,apiCaller,scopeData,scopeMethod){
	scopeData.discountType = $stateParams.discountType;
	$scope.regist = function(){
		apiCaller.regist(function(response){
			alert("注册成功:"+response.status)
			scopeMethod.changeState('1','1','1');
		},function(response){
			alert("注册失败:"+response.status)
		})
	}
	$scope.giveup = function(){
		
	}
})
