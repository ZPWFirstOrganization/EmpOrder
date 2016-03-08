orderApp.controller('loginCtrl',function($scope,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	scopeData.discountType = $stateParams.discountType
	// userProfile.getProfile(function(){
		// history.go(-1);
	// });
	setTimeout(function(){
		history.go(-1);
	},100)
})
