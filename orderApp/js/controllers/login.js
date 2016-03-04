orderApp.controller('loginCtrl',function($scope,apiCaller,scopeData,scopeMethod,$stateParams,userProfile){
	userProfile.getProfile(function(){
		history.go(-1);
	});
	// setTimeout(function(){
	// 	history.go(-1);
	// },100)
	
})
