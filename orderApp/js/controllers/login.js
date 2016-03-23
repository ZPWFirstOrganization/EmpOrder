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
			setTimeout(function(){
				$state.go('regist',{discountType:scopeData.discountType})
			},100)
		})
	}
	return this
})