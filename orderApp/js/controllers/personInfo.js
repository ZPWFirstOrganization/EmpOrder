orderApp.controller('personInfoCtrl',function($scope,$state,ApiService,apiCaller,scopeData,baseUrl,common,personServ){
    //console.log("personInfoCtrl");	
    
    $scope.Person = {};
    	// alert(scopeData.userAccount)
	//获取个人信息
	personServ.getPersonInfo({kind: 'User',infoAccount:scopeData.userAccount},function(response){
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