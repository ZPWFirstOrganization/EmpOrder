orderApp.factory('scopeData',function() {
	return{
		noticePageRevert     :false,
		ProductionList       :{},
		currentProductClass  :'1',         //当前产品列表显示的是大类为1，小类为2
		homeDivisionName     :'',
		homeDivisionCode     :'',
		divisionCode         :'',
		groupCode            :'',
		sourcePageId         : 0,          //0:代表productList页,1:代表currentOrder页
		currentProductCode   :'',          //当前大类或小类的code
		currentDivisionName  :'护肤',      //当前大类的名称(用于面包屑)
		currenGroupName      :'',          //当前小类的名称，未显示小类时为空(用于面包屑)
		currentPage          :'1',         //当前页数
		secretaryName        :'',		   //秘书姓名		
		secretaryPhone		 :'',          //秘书电话
		currentOrderPage     : 1		   //当前订单页数
	}
});

orderApp.service('scopeMethod',function($state,scopeData,apiCaller) {
	return{
		changeState:function(ProductClass,ProductCode,Page) {
			scopeData.currentProductClass = ProductClass;
			scopeData.currentProductCode = ProductCode;
			scopeData.currentPage = Page;
			$state.go('index.productList',{productClass:scopeData.currentProductClass,productCode:scopeData.currentProductCode,page:scopeData.currentPage});
			apiCaller.getProductListByStates();
		}
	}
})

orderApp.factory('apiCaller',function($stateParams,$http,ApiService,ajaxService,scopeData) {
	return{
		getProductListByStates:function(){
			scopeData.ProductionList = ApiService.getProductList(
			{
				code:scopeData.currentProductCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:scopeData.currentProductClass,//大类为1，小类为2
				pageNum:scopeData.currentPage,
				userAccount:'123123'
			})
		},
		getProductListByDivision:function(Division,callbackFn){
			scopeData.ProductionList = ApiService.getProductList(
			{
				code:Division.code,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:'1',//大类为1，小类为2
				pageNum:'1',
				userAccount:'123123'
			},
			function(response){
				scopeData.noticePageRevert = true;
				scopeData.ProductionList = response;
				scopeData.currentProductCode=Division.code;
				scopeData.currentProductClass='1';
				scopeData.currentPage = 1;
				if (callbackFn) {
					callbackFn();
				}
			});
		},
		getProductListByGroup:function(Group,callbackFn) {
			ApiService.getProductList(
			{
				code:Group.code,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:'2',//大类为1，小类为2
				pageNum:'1',
				userAccount:'123123'
			},
			function(response){
				scopeData.noticePageRevert = true;
				scopeData.ProductionList = response;
				scopeData.currentProductCode = Group.code;
				scopeData.currentProductClass = '2';
				scopeData.currentPage = 1;
				if (callbackFn) {
					callbackFn();
				}
			});
		},
		getProductListByPage:function(page,callbackFn){
			ApiService.getProductList(
			{
				code:scopeData.currentProductCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:scopeData.currentProductClass,//大类为1，小类为2
				pageNum:page,
				userAccount:'123123'
			},
			function(response){
				scopeData.ProductionList = response;
				scopeData.currentPage = page;
				if (callbackFn) {
					callbackFn();
				}
			});
		},
		getCategories:function(callbackFn){
			return ApiService.getCategories(
				function(response){
					if (callbackFn) {
						callbackFn();
					}
			});
		},
		postOrderedProduct:function(Product,count,suc,err) {
			return ApiService.postOrderedProduct({
				userAccount:'123123',
				productCode:Product.productCode,
				count:count
			},
			function(response){
				if (suc) {
					suc();
				}
			},
			function(response){
				if (err) {
					err();
				}
			});
		},
		getOrderCount:function(successFn) {
			return ApiService.getOrderCount({
				userAccount:'123123'
			},
			function (response) {
				if (successFn) {
					successFn();
				}
			}
			);
		},
		postFav:function(Product,callbackFn) {
			return ApiService.postFav({
				userAccount:'123123',
				productCode:Product.productCode
			},
			function(response){
				if (callbackFn) {
					callbackFn();
				}
			});
		},
		deleteFav:function(Product,suc,err) {
			ajaxService.deleteFav(Product,suc,err)
		},
		getBalance:function(callbackFn) {
			return ApiService.getBalance(
				{
					myBalanceAccount:'123123'
				},
				function(response){
					if (callbackFn) {
						callbackFn();
					}
			});
		},
		getOrderListByPage:function(param,suc,err){
			return ApiService.getOrderList({
				userAccount:param.userAccount,
				orderDate:param.orderDate,
				pageNum:param.pageNum
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		},
		getSecretary:function(param,suc,err){
			return ApiService.getSecretary({
				userAccount:param.userAccount
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		},
		getOrderDetailInfo:function(param,suc,err){
			return ApiService.getOrderData({
				orderID:param.orderID
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		},
		getFavoriteList:function(suc,err) {
			return ApiService.getFavoriteList({
				userAccount:'123123'
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		},
		getSearchResult:function(searchKey,suc,err) {
			return ApiService.getSearchResult({
				key:searchKey
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		}
	}
});

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

	var isEmptyObject = function( obj ) {
	    for ( var name in obj ) {
	        return false;
	    }
	    return true;
	}

	var monitorData = setInterval(function() {
		
		if (scopeData.ProductionList != $scope.pdList){
			$scope.pdList = scopeData.ProductionList;
		}
		if(scopeData.noticePageRevert){
			$scope.pages = [];
			scopeData.noticePageRevert=false;
		}
		if(isEmptyObject($scope.pages)){
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
		if(isEmptyObject($scope.inputTexts)){
			var i = 0;
			var tmpArr = [];
			for (Product in scopeData.ProductionList.products) {
				$scope.inputTexts[scopeData.ProductionList.products[i].productCode] = '1'
				i++;
			};
			$scope.$apply();
		}
	},100)

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

orderApp.controller('mbNavController',function($scope,apiCaller,scopeMethod) {
	$("body").showLoading(-150);
	$scope.lit2Show=''
	$scope.categories=apiCaller.getCategories(function () {
		$scope.Division = $scope.categories[0];//显示在大类类列表中的系列
		$scope.Group = $scope.categories[0].class2;//显示在小类中各个系列
		$scope.DivisionName = $scope.categories[0].name;//显示在大类选择上的文字
		$scope.GroupName = '系列';
		$("body").hideLoading();
	});

	$scope.divisionItemClicked = function(Division) {
		$scope.DivisionName = Division.name;//显示在大类类列表上的文字
		$scope.Group = Division.class2;//显示在小类中各个系列
		$scope.GroupName = '系列';
		scopeMethod.changeState("1",Division.code,"1");
	}
	$scope.groupItemClicked = function(Group) {
		$scope.GroupName = Group.name;
		scopeMethod.changeState("2",Group.code,"1");
	}

	//选择大类 小类 
	$('[action="left_select"]').click(function(){
		if($("#DivisionList").css("display")=="none"){
			$("#DivisionList").fadeIn(200);
			$("#GroupList").fadeOut(200);
		}else{
			$("#DivisionList").fadeOut(200);
		}
	});
	$('[action="right_select"]').click(function(){
		if($("#GroupList").css("display")=="none"){
			$("#GroupList").fadeIn(200);
			$("#DivisionList").fadeOut(200);
		}else{
			$("#GroupList").fadeOut(200);
		}
	});
});

orderApp.controller('mbHeaderController',function ($scope,$state) {

	$scope.showSearch = true;
	stateMonitor = setInterval(function () {
		if($state.current.name == 'index.productList'){
			$scope.showSearch = true;
		}else{
			$scope.showSearch = false;
		}
		$scope.$apply()
	},100)

	$scope.$on("$destroy", function() {
    	clearInterval(stateMonitor);
    })

	//展开我的
	$('[action="my"]').click(function(){    
		if($(".my-list").css("display")=="none"){
		  	$(".my-list").fadeIn(200);  
		}else{
		  	$(".my-list").fadeOut(200); 
		} 

	});

	//闭合我的
	$("body").click(function(event){
		if(event.target!=$('[action="my"]')[0]){
		  	if($(".my-list").css("display")=="block"){
		    	$(".my-list").fadeOut(200); 
		  	}
		}
	});

	//展开优惠价
	$('[action="mobile-select-onsale"]').click(function(){    
		if($(".mobile-onsale-list").css("display")=="none"){
		  	$(".mobile-onsale-list").fadeIn(200);
		}else{
		  	$(".mobile-onsale-list").fadeOut(200);  
		}
	});

	//闭合优惠价
	$("body").click(function(event){
		if(event.target!=$('.mobile-onsale-content')[0] && event.target!=$('.mobile-onsale-arrow')[0]){
		  if($(".mobile-onsale-list").css("display")=="block"){
		    	$(".mobile-onsale-list").fadeOut(200);  
		  	}
		}
	});
});