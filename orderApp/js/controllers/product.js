orderApp.controller('productCtrl',function($q,$scope,$stateParams,baseUrl,common,productServ){
    console.log($stateParams.productCode);
    console.log(common.get("type"));
    $scope.Product = {};
    
	//获取商品详情
	productServ.getProductDetail({kind: 'Product',productCode:$stateParams.productCode},function(response){
	    console.log(response[0]);
        $scope.Product = response[0];
  	})    
    
});   


orderApp.factory('productServ',function($resource,common,baseUrl){
	return $resource(
    baseUrl+common.get("type")+'/:kind',
    {},
    {
      //获取商品详情
      getProductDetail:{
        method:'GET',
        params:{
          productCode:'@productCode'
        },
        isArray:true
      } 
    }
  );
})      