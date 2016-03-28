orderApp.controller('registCtrl',function($scope,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	scopeData.discountType = $stateParams.discountType;
	$scope.regist = function(){
		apiCaller.regist(function(response){
			alert("注册成功！")
			userProfile.getProfile(function(){
				scopeData.isLogin = true;
				scopeMethod.getGate(function(){
					scopeMethod.changeState('1','1','1');
				})
			})
			
		},function(response){
			if (response.data){
				alert(response.data.Message)
			}else{
				alert("网络异常，请刷新页面或重启应用！")
			}
		})
	}
	$scope.giveup = function(){
		
	}
})
