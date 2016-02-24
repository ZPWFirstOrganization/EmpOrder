orderApp.controller('prductListController',function($scope,$stateParams,$state,$http,scopeData,scopeMethod,apiCaller,sessionStorage) {
	$scope.currentDivisionName = '';
	$scope.currenGroupName = '';
	$scope.currentCategoryCode = '1'
	$scope.isGroupNameShow = false;
	$scope.orderCount = 0;
	$scope.balance = apiCaller.getBalance();
	$scope.orderCount = apiCaller.getOrderCount();
	$scope.pdList = {};
	$scope.inputTexts = [];
	$scope.pages = [];
	$scope.currentPage=$stateParams.page;
    // scopeData.sourcePageId = 0;
    sessionStorage.put("sourcePageId","0")
    apiCaller.getOrderDate(function(res){
    	scopeData.isNotAllowOrder = (res.allowOrder);
    	scopeData.orderDate = res.orderDate.split('-');
    	$scope.isNotAllowOrder = scopeData.isNotAllowOrder;
    	$scope.orderDate = scopeData.orderDate;
    })

    apiCaller.getProductListByStates(function(res){
    	$scope.pdList = res;
    	console.log('scopeData.categories',scopeData.categories)
		for (var i = 0; i < $scope.pdList.pageNumCount; i++) {
			$scope.pages.push(i+1)
		};
		
		if($stateParams.productClass == '1'){
			$scope.isGroupNameShow = false;
			for(index in scopeData.categories){
				if($stateParams.productCode == scopeData.categories[index].categoryCode){
					$scope.currentDivisionName = scopeData.categories[index].categoryName;
					break;
				}
			}
		}else{
			$scope.isGroupNameShow = true;
			var isBreak = false
			for(index in scopeData.categories){
				for(i in scopeData.categories[index].series){
					if($stateParams.productCode == scopeData.categories[index].series[i].seriesCode){
						$scope.currenGroupName = scopeData.categories[index].series[i].seriesName;
						$scope.currentDivisionName = scopeData.categories[index].categoryName;
						$scope.currentCategoryCode = scopeData.categories[index].categoryCode;
						isBreak = true;
						break;
					}
				}
				if(isBreak){
					break;
				}
			}
		}
		$("body").hideLoading();
    },function(){
    	$("body").hideLoading();
    });

	$scope.$watch('pdList', function(newVal, oldVal) {
        if (newVal.products !== oldVal.products) {
            for (index in newVal.products ) {
                $scope.inputTexts[newVal.products[index].productCode] = '1'
            };
            if(!scopeMethod.isEmptyObject(newVal)) {
                for (index in newVal.products) {
                   newVal.products[index].isNotAllowOrder = $scope.isNotAllowOrder;
                };
            }
        }
        
    }, true);

	//手机上拉刷新
	if($(window).width()<801)
		Hook.init({
			wrapperId:"#wrapper",
			scrollerId:"#scroller",
			wrapperCss:{
				"position": "absolute",
				"z-index": 1,
				"top": "0px",
				"bottom": "0px",
				"left": "0px",
				"right":"0px",
				overflow: "hidden"
			},
			distance:50,
			callback:function(){
				$("body").showLoading(-150);
				apiCaller.getProductListByPage(++$scope.currentPage,function(res){
					scopeData.ProductionList.products =
					 (scopeData.ProductionList.products).concat(res.products);
					 $("body").hideLoading();
				},function(){
					$("body").hideLoading();
					showModal({msg:"没有更多产品了!"});
				})
			}
	});

	$scope.pageNumClicked = function(page){
		$(window).scrollTop(0);
		if($scope.currentPage == page){
			return;
		}
		if('next' == page){
			if($scope.currentPage < $scope.pdList.pageNumCount){
				$scope.currentPage = parseInt($scope.currentPage) + 1;
			}else{
				showModal({msg:"已经是最后一页了"});
				return;
			}
		}else{
			$scope.currentPage = page;
		}

		scopeMethod.changeState($stateParams.productClass,$stateParams.productCode,$scope.currentPage);
	}

    $scope.addCartClicked = function(Product) {
    	if (Product.productStatus == 0 && !Product.isNotAllowOrder){
	    	$("body").showLoading(-150);
	    	var result = apiCaller.postOrderedProduct(Product,$scope.inputTexts[Product.productCode],function(){
	    		showModal({msg:"已加当月订单"});
	    		$(".cart").find(".number").transition({scale:2});
				setTimeout(function(){
					$(".cart").find(".number").transition({scale:1});
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

    $scope.favoriteClicked = function(Product) {
    	$("body").showLoading(-150);
    	if(!Product.isFavorite){
    		apiCaller.postFav(Product,function() {
    			showModal({msg:"添加到我的收藏"});
    			Product.isFavorite = true
    			$("body").hideLoading();
    		})
    	}else{
			Product.isFavorite = false;
    		apiCaller.deleteFav(Product,function() {
    			showModal({msg:"已取消收藏"});
    			$("body").hideLoading();
    		})
    	}
    }

    $(document).on("click",".list",function(){
	    $(".option-list").fadeOut(200); 
	});
	  
	$('.layout,.mobile-header-wrapper').click(function(){
	    $(".option-list").fadeOut(200); 
	});

	$scope.toDetail = function(Product){
		if(Product.productStatus == 0){
			$state.go('index.product',{productCode:Product.ProductCode});
		}
	}

	$scope.numberClicked = function(Product) {
		var id = Product.productCode;
		$("#"+id).focus();
		$("#"+id).select();
	}

	$scope.countSubtracted = function(Product){
		var id = Product.productCode;
		if($scope.inputTexts[id] > 1)
			$scope.inputTexts[id] = parseInt($scope.inputTexts[id]) - 1;
	}

	$scope.countAdded = function(Product){
		var id = Product.productCode;
		if($scope.inputTexts[id] < 999)
			$scope.inputTexts[id] = parseInt($scope.inputTexts[id]) + 1;
	}

	$scope.nav1Clicked = function () {
		scopeMethod.changeState('1','1','1');
	}

	$scope.nav2Clicked = function () {
		scopeMethod.changeState('1',$scope.currentCategoryCode,'1');
	}
});