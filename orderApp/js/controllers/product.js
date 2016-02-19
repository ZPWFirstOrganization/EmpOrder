orderApp.controller('productCtrl',function($q,$scope,$stateParams,scopeData,scopeMethod,baseUrl,common,productServ,currentOrderServ,deleteServ,apiCaller){
    //console.log($stateParams.productCode);
    //console.log("scopeData.sourcePageId "+ scopeData.sourcePageId);
    $scope.orderCount = apiCaller.getOrderCount();
    $scope.balance = apiCaller.getBalance();
    $scope.inputTexts = [];
    $scope.Product = {};
	$scope.currentDivisionName;
	$scope.currenGroupName = '';
    $scope.sourcePageNamePC = '';
    $scope.sourcePageNameMB = '';
    $scope.sourcePageLink = '';
    
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

    //判断是从哪个页面跳转到产品详情页面; 0:代表productList页,1:代表currentOrder页,2:代表historyOrder页
    switch (scopeData.sourcePageId) {
    case 0:
        $scope.sourcePageNamePC="返回首页";
        $scope.sourcePageNameMB="首页";
        $scope.sourcePageLink="index.productList";
        break;

    case 1:
        $scope.sourcePageNamePC="返回当月订单";
        $scope.sourcePageNameMB="当月订单";
        $scope.sourcePageLink="index.currentOrder";
        break;

    case 2:
        $scope.sourcePageNamePC="返回历史订单";
        $scope.sourcePageNameMB="历史订单";
        $scope.sourcePageLink="index.historyOrder";
        break;        
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
        if (Product.productStatus == 0){
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
    }
    
    //点击返回首页或当月订单
	$scope.nav1Clicked = function () {
        switch (scopeData.sourcePageId){
		case 0:
            scopeMethod.changeState('1',scopeData.homeDivisionCode,'1');
            scopeData.currentDivisionName = scopeData.homeDivisionName;
            scopeData.currenGroupName = '';
        
            break;
        case 1:
            break;
        }
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
    
	//产品数量得到焦点
	var oldCount;
    $scope.countFocus = function(prodCount,Product){
		var id = Product.productCode;
		oldCount = parseInt(prodCount);
		$("#"+id).select();
	};

	//产品数量失去焦点
	$scope.countBlur = function(prodCount,Product){
		prodCount = prodCount + "";
		prodCount = prodCount.replace(/\D/g,'');
		if (prodCount == "" || parseInt(prodCount) <= 0 ){
			$scope.inputTexts[Product.productCode] = oldCount;
			return
		};
	};

	$scope.enter = function(ev) {
		if (ev.keyCode !== 13) return; 
		//input回车事件
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