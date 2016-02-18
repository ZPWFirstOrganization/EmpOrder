orderApp.controller('personInfoCtrl',function($scope,$state,ApiService,apiCaller,scopeData,baseUrl,common,personServ){
    //console.log("personInfoCtrl");	
    
    $scope.Person = {};
    
	//获取个人信息
	personServ.getPersonInfo({kind: 'User',infoAccount:'123123'},function(response){
	    //console.log(response);
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