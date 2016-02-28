orderApp.controller('registCtrl',function($q,$scope,$state,$scope,apiCaller,scopeData,scopeMethod,$stateParams){
	scopeData.discountType = $stateParams.discountType;
	$scope.regist = function(){
		apiCaller.regist(function(response){
			// alert("注册成功:"+JSON.stringify(response))
			// scopeMethod.changeState('1','1','1');
		},function(response){
			// alert("注册失败:"+JSON.stringify(response))
		})
	}
	$scope.giveup = function(){
		
	}
})
