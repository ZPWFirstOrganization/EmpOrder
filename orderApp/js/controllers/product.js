orderApp.controller('productCtrl',function($q,$scope,$stateParams,scopeData,scopeMethod,baseUrl,common,productServ,currentOrderServ,deleteServ,apiCaller){
    //console.log($stateParams.productCode);
    $scope.orderCount = apiCaller.getOrderCount();
    $scope.balance = apiCaller.getBalance();
    $scope.inputTexts = [];
    $scope.Product = {};
	$scope.currentDivisionName;
	$scope.currenGroupName = '';
    
    //判断是否为空
	var isEmptyObject = function( obj ) {
	    for ( var name in obj ) {
	        return false;
	    }
	    return true;
	}
    
    if(isEmptyObject($scope.inputTexts)){
        $scope.inputTexts[$stateParams.productCode] = '1';
    }

    //获取大类            
    if($scope.currentDivisionName != scopeData.currentDivisionName){
        $scope.currentDivisionName = scopeData.currentDivisionName;
    }
   
    //获取小类
    if($scope.currenGroupName != scopeData.currenGroupName){
        $scope.currenGroupName = scopeData.currenGroupName;
        $scope.isGroupNameShow = ($scope.currenGroupName != '');
    }
                            
	//获取商品详情
	productServ.getProductDetail({kind: 'Product',userAccount:'123123',productCode:$stateParams.productCode},function(response){
	    //console.log(response[0]);
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
    
    //点击数量输入框
	$scope.numberClicked = function(Product) {
		var id = Product.productCode;
		$("#"+id).focus();
		$("#"+id).select();
	}    

    //数量减一
	$scope.countSubtracted = function(Product){
		var id = Product.productCode;
		if($scope.inputTexts[id] > 1)
			$scope.inputTexts[id] = parseInt($scope.inputTexts[id]) - 1;
	}

    //数量加一
	$scope.countAdded = function(Product){
		var id = Product.productCode;
		if($scope.inputTexts[id] < 999)
			$scope.inputTexts[id] = parseInt($scope.inputTexts[id]) + 1;
	}

    //加入当月订单    
    $scope.addCartClicked = function(Product) {
    	$("body").showLoading(-150);
        var id = Product.productCode;
    	var result = apiCaller.postOrderedProduct(Product,$scope.inputTexts[id],function(){
    		showModal({msg:"已加当月订单"});
    		$(".proddtl-cart").find(".number").transition({scale:2});
			setTimeout(function(){
				$(".proddtl-cart").find(".number").transition({scale:1});
			},500)
			$scope.balance = apiCaller.getBalance();
			$scope.orderCount = apiCaller.getOrderCount();
			$("body").hideLoading();
    	},function(){
    		$("body").hideLoading();
    		showModal({msg:"剩余额度不足"});
    	});

    }
    
    //点击首页
	$scope.nav1Clicked = function () {
		scopeMethod.changeState('1',scopeData.homeDivisionCode,'1');
		scopeData.currentDivisionName = scopeData.homeDivisionName;
		scopeData.currenGroupName = '';
	}

    //点击大类
	$scope.nav2Clicked = function () {
		scopeMethod.changeState('1',scopeData.divisionCode,'1');
		scopeData.currenGroupName = '';
	}

    //点击小类
	$scope.nav3Clicked = function () {
		scopeMethod.changeState(scopeData.currentProductClass,scopeData.groupCode,'1');
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