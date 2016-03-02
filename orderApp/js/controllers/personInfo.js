orderApp.controller('personInfoCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData,baseUrl,common,personServ){
    //console.log("personInfoCtrl");	
    scopeData.discountType = $stateParams.discountType;
    $scope.discountType = scopeData.discountType;
    $scope.Person = {};
    	// alert(scopeData.userID)
	//获取个人信息
	personServ.getPersonInfo({kind:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/User',infoUserID:scopeData.userID},function(response){
	    console.log(response);
        $scope.Person = response;
  	},function(response){
      
    })        
})


orderApp.factory('personServ',function($resource,common,baseUrl){
	return $resource(
    baseUrl+':kind',
    {},
    {
      //获取个人信息
      getPersonInfo:{
        method:'GET',
        params:{
          infoUserID:'@infoUserID'
        }
      } 
    }
  );
})     