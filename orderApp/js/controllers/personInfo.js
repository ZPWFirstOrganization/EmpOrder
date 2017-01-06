orderApp.controller('personInfoCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData,baseUrl,personServ,scopeMethod){
    scopeMethod.setMinHeight();
    scopeData.discountType = $stateParams.discountType;
    $scope.discountType = scopeData.discountType;
    $scope.Person = {};
	//获取个人信息
	personServ.getPersonInfo({kind:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/User',infoUserID:scopeData.userID},function(response){
        $scope.Person = response;
  	},function(response){
      
    })
})


orderApp.factory('personServ',function($resource,baseUrl){
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