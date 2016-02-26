orderApp.controller('personInfoCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData,baseUrl,common,personServ){
    //console.log("personInfoCtrl");	
    scopeData.discountType = $stateParams.discountType;
    $scope.discountType = scopeData.discountType;
    $scope.Person = {};
    
	//获取个人信息
	personServ.getPersonInfo({kind: 'User',infoAccount:'123123'},function(response){
	    console.log(response);
        $scope.Person = response;
  	})        
})


orderApp.factory('personServ',function($resource,common,baseUrl){
	return $resource(
    baseUrl+common.get("type")+'/:kind',
    {},
    {
      //获取个人信息
      getPersonInfo:{
        method:'GET',
        params:{
          infoAccount:'@infoAccount'
        }
      } 
    }
  );
})     