orderApp.controller('loginCtrl',function($scope,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	scopeData.discountType = $stateParams.discountType
	userProfile.getProfile(function(){
		scopeData.isLogin = true;
		scopeMethod.getGate(function(){
			history.go(-1);
		})
		
	});
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
			if(response.status == 409){
				alert("您的账户尚未注册到系统中，请点击注册按钮")
				setTimeout(function(){
					$state.go('regist',{discountType:scopeData.discountType})
				},100)
			}else if(response.status == 400 || response.status == 404){
				alert(response.Message? response.Message : "网络异常，请刷新页面或重启应用！")
			}else{
				alert("网络异常，请刷新页面或重启应用！")
			}
		})
	}
	return this
})