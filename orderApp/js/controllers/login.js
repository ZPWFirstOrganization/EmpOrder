orderApp.controller('loginCtrl',function($scope,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	scopeData.discountType = $stateParams.discountType
	userProfile.getProfile(function(){
		scopeData.isLogin = true;
		scopeMethod.getGate(function(){
			history.go(-1);
		})
		
	});
})
