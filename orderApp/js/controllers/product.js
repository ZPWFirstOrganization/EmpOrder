orderApp.controller('productCtrl',function($q,$scope,$stateParams,baseUrl,common,productServ,currentOrderServ,deleteServ){
    console.log($stateParams.productCode);
    console.log(common.get("type"));
    $scope.Product = {};
    
	//获取商品详情
	productServ.getProductDetail({kind: 'Product',userAccount:'123123',productCode:$stateParams.productCode},function(response){
	    console.log(response[0]);
        $scope.Product = response[0];
  	})    

    //添加取消收藏
	$scope.favoriteClicked = function(Product){
		if (!Product.isFavorite){
			currentOrderServ.postFav(
			{kind:"Favorite",userAccount:'123123',productCode:Product.productCode}
			 ,function(){
                showModal({msg:"添加到我的收藏"});
                Product.isFavorite = true;
			},function(){

			})
			
		}else{
			deleteServ("Favorite",{userAccount:123123,productCode:Product.productCode},
			function(response){
			   showModal({msg:"已取消收藏"});
               Product.isFavorite = false;
            },
			function(response){
			});
			
		}
	}
   
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
          userAccount:'@userAccount',  
          productCode:'@productCode'
        },
        isArray:true
      } 
    }
  );
})      