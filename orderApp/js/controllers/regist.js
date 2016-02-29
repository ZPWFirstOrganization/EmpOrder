orderApp.controller('registCtrl',function($scope,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	scopeData.discountType = $stateParams.discountType;
	$scope.regist = function(){
		apiCaller.regist(function(response){
			alert("注册成功:"+JSON.stringify(response))
			userProfile.getProfile(scopeData.discountType,function(){
				scopeMethod.changeState('1','1','1');
			})
			
		},function(response){
			alert("注册失败:"+JSON.stringify(response))
		})
	}
	$scope.giveup = function(){
		
	}
})
