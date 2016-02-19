orderApp.controller('prductListController',
	function($scope,$stateParams,$state,$http,scopeData,scopeMethod,apiCaller) {
	$scope.currentDivisionName;
	$scope.currenGroupName = '';
	$scope.orderCount = 0;
	$scope.balance = apiCaller.getBalance();
	$scope.orderCount = apiCaller.getOrderCount();
	$scope.pdList = {};
	$scope.inputTexts = [];
	$scope.pages = [];
	$scope.currentPage=$stateParams.page;
    scopeData.sourcePageId = 0;

	var monitorData = setInterval(function() {
		
		if (scopeData.ProductionList != $scope.pdList){
			$scope.pdList = scopeData.ProductionList;
		}
		if(scopeData.noticePageRevert){
			$scope.pages = [];
			scopeData.noticePageRevert=false;
		}
		if(scopeMethod.isEmptyObject($scope.pages)){
			for (var i = 0; i < $scope.pdList.pageNumCount; i++) {
				$scope.pages.push(i+1)
			};
			$scope.$apply();
		}
		if($scope.currentDivisionName != scopeData.currentDivisionName){
			$scope.currentDivisionName = scopeData.currentDivisionName;
			$scope.$apply();
		}
		if($scope.currenGroupName != scopeData.currenGroupName){
			$scope.currenGroupName = scopeData.currenGroupName;
			$scope.isGroupNameShow = ($scope.currenGroupName != '');
			$scope.$apply();
		}
		if(scopeMethod.isEmptyObject($scope.inputTexts)){
			var i = 0;
			var tmpArr = [];
			for (Product in scopeData.ProductionList.products) {
				$scope.inputTexts[scopeData.ProductionList.products[i].productCode] = '1'
				i++;
			};
			$scope.$apply();
		}
	},100)

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

	$scope.$on("$destroy", function() {
    	clearInterval(monitorData);
    })

	$scope.pageNumClicked = function(page){
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

		scopeMethod.changeState(scopeData.currentProductClass,scopeData.currentProductCode,$scope.currentPage);
	}

    $scope.addCartClicked = function(Product) {
    	if (Product.productStatus == 0){
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
		scopeMethod.changeState('1',scopeData.homeDivisionCode,'1');
		scopeData.currentDivisionName = scopeData.homeDivisionName;
		scopeData.currenGroupName = '';
	}

	$scope.nav2Clicked = function () {
		scopeMethod.changeState('1',scopeData.divisionCode,'1');
		scopeData.currenGroupName = '';
	}

	$scope.nav3Clicked = function () {
		scopeMethod.changeState(scopeData.currentProductClass,scopeData.groupCode,'1');
	}

});