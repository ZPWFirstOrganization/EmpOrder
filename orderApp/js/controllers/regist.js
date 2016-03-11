orderApp.controller('registCtrl',function($scope,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	scopeData.discountType = $stateParams.discountType;
	$scope.regist = function(){
		apiCaller.regist(function(response){
			alert("注册成功！")
			userProfile.getProfile(function(){
				scopeData.isLogin = true;
				scopeMethod.changeState('1','1','1');
			})
			
		},function(response){
			alert("注册失败！")
		})
	}
	$scope.giveup = function(){
		
	}
})
