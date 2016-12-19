orderApp.controller('registCtrl',function($scope,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	scopeData.discountType = $stateParams.discountType;
	var rgst = function(){
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
				alert("未获取到信息，请稍后再试")
			}
		})
	}
	$scope.regist = function(){
		if(!scopeData.ad && scopeData.ad == ""){
			apiCaller.getDomainAccount(function(res){
				scopeData.ad = res.user
				rgst()
			},function(res){
				alert("未获取到信息，请稍后再试")
			})
		}else{
			rgst()
		}
	}
	$scope.giveup = function(){
		
	}
})
