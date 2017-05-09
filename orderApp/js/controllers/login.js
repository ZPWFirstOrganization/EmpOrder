orderApp.controller('loginCtrl',function($scope,$state,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	scopeData.discountType = $stateParams.discountType
	if(!scopeData.ad && scopeData.ad == ""){
		apiCaller.getDomainAccount(function(res){
				scopeData.ad = res.user
				userProfile.getProfile(function(){
					scopeData.isLogin = true;
					scopeMethod.getGate(function(){
						if($stateParams.firstLogin == 1){
							scopeMethod.changeState("1","1","1");
						}else{
							history.go(-1);
						}
					})
				});
		},function(res){
			alert("未获取到信息，请稍后再试")
		})
	}else{
		userProfile.getProfile(function(){
			scopeData.isLogin = true;
			scopeMethod.getGate(function(){
				if($stateParams.firstLogin == 1){
					scopeMethod.changeState("1","1","1");
				}else{
					history.go(-1);
				}
			})
		});
	}
	// userProfile.getProfile(function(){
	// 	scopeData.isLogin = true;
	// 	scopeMethod.getGate(function(){
	// 		if($stateParams.firstLogin == 1){
	// 			scopeMethod.changeState("1","1","1");
	// 		}else{
	// 			history.go(-1);
	// 		}
	// 	})

	// });

})

orderApp.factory('userProfile',function($state,apiCaller,scopeData){
	this.getProfile = function(callback){
		apiCaller.getUserProfile(function(response){
			// alert(JSON.stringify(response))
			scopeData.userID = response.user.USER_ID
			scopeData.roleID = response.user.ROLE_ID
			if (typeof(callback) == "function"){
				return callback(response)
			}
		},function(response){
			// alert(JSON.stringify(response))
			if(response.status == 409 || response.status == 400){
				alert("您的账户尚未注册到系统中，请点击注册按钮")
				setTimeout(function(){
					$state.go('regist',{discountType:scopeData.discountType})
				},100)
			}else if(response.status == 404){
				alert(response.data.Message? response.data.Message : "网络异常，请刷新页面或重启应用！")
			}else{
				alert("网络异常，请刷新页面或重启应用！")
			}
		})
	}
	return this
})
