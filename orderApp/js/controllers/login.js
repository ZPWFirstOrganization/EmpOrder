orderApp.controller('loginCtrl',function($scope,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	scopeData.discountType = $stateParams.discountType
	userProfile.getProfile(function(){
		scopeData.isLogin = true;
		history.go(-1);
	});
	// setTimeout(function(){
	// scopeData.isLogin = true;
	// history.go(-1);
	// },100)
})
