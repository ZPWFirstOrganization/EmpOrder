orderApp.controller('productCtrl',function($q,$scope,$state,$stateParams,scopeData,scopeMethod,baseUrl,productServ,currentOrderServ,deleteServ,apiCaller,sessionStorage){
    if($(window).width()>1300){
        r=(parseInt($(window).width())-1000)/2 -180;
        $(".cart").css({"right":r})       
    }else{
        $(".cart").css({"right":10})     
    }
    $(window).scrollTop(0);
    $scope.orderCount = apiCaller.getOrderCount();
    $scope.balance = apiCaller.getBalance();
    $scope.inputTexts = [];
    $scope.Product = {};
    $scope.sourcePageNamePC = '';
    $scope.sourcePageNameMB = '';
    $scope.isNotAllowOrder = scopeData.isNotAllowOrder;
    scopeData.discountType = $stateParams.discountType;
    $scope.discountType = scopeData.discountType;
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
    switch (parseInt(sessionStorage.get("sourcePageId"))) {
    case 0:
        $scope.sourcePageNamePC="返回首页";
        $scope.sourcePageNameMB="首页";
        break;

    case 1:
        $scope.sourcePageNamePC="返回当月订单";
        $scope.sourcePageNameMB="当月订单";
        break;

    case 2:
        $scope.sourcePageNamePC="返回订单详情";
        $scope.sourcePageNameMB="订单详情";
        break;

    case 3:
        $scope.sourcePageNamePC="返回收藏";
        $scope.sourcePageNameMB="收藏";
        break;
    case 4:
        $scope.sourcePageNamePC="返回搜索";
        $scope.sourcePageNameMB="搜索";
        break;

    default:
        $scope.sourcePageNamePC="返回首页";
        $scope.sourcePageNameMB="首页";
        break;
    }
                        
	//获取产品详情
	productServ.getProductDetail({kind: "types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/Product',userID:scopeData.userID,productCode:$stateParams.productCode},function(response){
        $scope.Product = response[0];
        $scope.currenGroupName = $scope.Product.seriesName;
        $scope.currentDivisionName = $scope.Product.categoryName;
        response[0].productDescribe ? $("#prodContent").html(response[0].productDescribe) : $("#prodContent").html("无");
  	})    

    //添加取消收藏
	$scope.favoriteClicked = function(Product){
		if (!Product.isFavorite){
			currentOrderServ.postFav(
			{kind:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/Favorite',userID:scopeData.userID,productCode:Product.productCode}
			 ,function(){
                showModal({msg:"添加到我的收藏"});
                Product.isFavorite = true;
			},function(response){
                if(response.status == -1 || response.status == 412){
                    showModal({msg:scopeData.timeoutMsg});
                }
			})
			
		}else{
			deleteServ("Favorite",{userID:scopeData.userID,productCode:Product.productCode},
			function(response){
			   showModal({msg:"已取消收藏"});
               Product.isFavorite = false;
            },
			function(response){
                if(response.status == 0 || response.status == 412){
                    showModal({msg:scopeData.timeoutMsg});
                }
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
    var isCanShop = true;
    //加入当月订单    
    $scope.addCartClicked = function(Product) {
        //上次添加没完成，不会再次发起请求
        if (!isCanShop) {
            return;
        }
        if(!scopeMethod.isPositiveInt($scope.inputTexts[Product.productCode])){
            showModal({msg:"请输入正确数量"});
            return;
        }
        if (!$scope.isNotAllowOrder){
            isCanShop = false;
            $("body").showLoading();
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
                isCanShop = true;
            },function(response){
                $("body").hideLoading();
                if(response.status == -1 || response.status == 412){
                    showModal({msg:scopeData.timeoutMsg});
                }else if(response.status == 400){
                    showModal({msg:"剩余额度不足"});
                }
                isCanShop = true;
            });
        }
    }
     $scope.nav1Clicked = function(){
        if (sessionStorage.get("sourcePageId") == 0){
            scopeMethod.changeState('1','1','1');
        }else{
            history.back();
        }
    }
    //点击大类
	$scope.nav2Clicked = function () {
		scopeMethod.changeState('1',$scope.Product.categoryCode,'1');
	}

    //点击小类
	$scope.nav3Clicked = function () {
		scopeMethod.changeState('2',$scope.Product.seriesCode,'1');
	}    
    

	//产品数量得到焦点
	var oldCount;
    $scope.countFocus = function(prodCount,Product){
 		var id = Product.productCode;
		oldCount = parseInt(prodCount);
        $("#"+id).keyup(function(){
            if(!(/(^[0-9]*$)/).test($scope.inputTexts[id])){
                $scope.inputTexts[id] = oldCount;
            }
        });
	};

	//产品数量失去焦点
	$scope.countBlur = function(prodCount,Product){
		if (!(/(^[0-9]*$)/).test($scope.inputTexts[Product.productCode]) || prodCount == "" || parseInt(prodCount) <= 0 ){
			$scope.inputTexts[Product.productCode] = oldCount;
			return
		};
	};

	$scope.enter = function(ev) {
		if (ev.keyCode !== 13) return; 
		//input回车事件
	}

    $scope.cartClicked = function(){
        $state.go('index.currentOrder',{discountType:scopeData.discountType});
    }	

});   


orderApp.factory('productServ',function($resource,baseUrl){
	return $resource(
    baseUrl+'/:kind',
    {},
    {
      //获取产品详情
      getProductDetail:{
        method:'GET',
        params:{
          userID:'@userID',  
          productCode:'@productCode'
        },
        isArray:true
      } 
    }
  );
})      