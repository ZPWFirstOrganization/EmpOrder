orderApp.controller('loginCtrl',function($scope,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	userProfile.getProfile($stateParams.discountType,function(){
		history.go(-1);
	});
	setTimeout(function(){
		history.go(-1);
	},100)
	
})
