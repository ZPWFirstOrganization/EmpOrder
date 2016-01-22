var homeModule = angular.module('homeModule', ['ngResource'], function($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	var param = function(obj) {
		var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
		for(name in obj) {
			value = obj[name];
		    
			if(value instanceof Array) {
			    for(i=0; i<value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
			    }
			}else if(value instanceof Object) {
			    for(subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
			    }
			}else if(value !== undefined && value !== null){
			    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
			}
		}
		return query.length ? query.substr(0, query.length - 1) : query;
	};

	$httpProvider.defaults.transformRequest = [function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
});

homeModule.factory('scopeData',function() {
	return{
		noticePageRevert:false,
		ProductionList:{},
		nowProductCode:'',
		nowProductClass:''
	}
});

homeModule.factory('apiCaller',['ApiService','scopeData',function(ApiService,scopeData) {
	return{
		getProductListByDivision:function(Division,callbackFn){
			scopeData.ProductionList = ApiService.getProductList(
			{
				code:Division.Code,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:'1',//大类为1，小类为2
				pageNum:'1',
				userAccount:'123123'
			},
			function(response){
				scopeData.noticePageRevert = true;
				scopeData.ProductionList = response;
				scopeData.nowProductCode=Division.Code;
				scopeData.nowProductClass='1';
				if (callbackFn) {
					callbackFn();
				}
			});
		},
		getProductListByGroup:function(Group,callbackFn) {
			ApiService.getProductList(
			{
				code:Group.Code,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:'2',//大类为1，小类为2
				pageNum:'1',
				userAccount:'123123'
			},
			function(response){
				scopeData.noticePageRevert = true;
				scopeData.ProductionList = response;
				scopeData.nowProductCode = Group.Code;
				scopeData.nowProductClass = '2';
				if (callbackFn) {
					callbackFn();
				}
			});
		},
		getProductListByPage:function(page,callbackFn){
			ApiService.getProductList(
			{
				code:scopeData.nowProductCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:scopeData.nowProductClass,//大类为1，小类为2
				pageNum:page,
				userAccount:'123123'
			},
			function(response){
				scopeData.ProductionList = response;
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
		postOrderedProduct:function(Product,count,callbackFn) {
			return ApiService.postOrderedProduct({
				userAccount:'123123',
				productCode:Product.productCode,
				count:count
			},
			function(response){
				if (callbackFn) {
					callbackFn();
				}
			});
		}
	}
}]);

homeModule.factory('ApiService',['$resource',function($resource){
	var baseUrl = 'http://182.92.110.219:8090/MLK/'
	return $resource(
		baseUrl,
		{},
		{
			getCategories:{
				url:baseUrl+'2/Product',
				method:'GET',
				isArray:true
			},
			getProductList:{
				url:baseUrl+'2/Product',
				method:'GET',
				params:{
					code:'@code',//大类传大类的id,小类传小类的CONFIG_VALUE
					productClass:'@productClass',//大类为1，小类为2
					pageNum:'@pageNum',
					userAccount:'@userAccount'
				},
				isArray:false
			},
			getSecretary:{
				url:baseUrl+'2/User',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				}
			},
			getFavoriteList:{
				url:baseUrl+'2/Favorite',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				}
			},
			getBalance:{
				url:baseUrl+'2/Role',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				}
			},
			getOrderDate:{
				url:baseUrl+'2/Order',
				method:'GET',
				isArray:true
			},
			postOrderedProduct:{
				url:baseUrl+'2/Order',
				method:'POST',
				data:{
					userAccount:'@userAccount',
					productCode:'@productCode',
					count:'@count'
				}
			}
		}
	);
}]);

homeModule.controller('prductListController',['$scope','scopeData','apiCaller',function($scope,scopeData,apiCaller) {
	$scope.pdList = {};
	$scope.pages = [];
	$scope.currentPage=1;

	var monitorData = setInterval(function() {
		if (scopeData.ProductionList != $scope.pdList){
			$scope.pdList = scopeData.ProductionList;
		}
		if(scopeData.noticePageRevert){
			$scope.pages = [];
			$scope.currentPage=1;
			scopeData.noticePageRevert=false;
		}
		if(!($scope.pages[0])){
			for (var i = 0; i < $scope.pdList.pageNumCount; i++) {
				$scope.pages.push(i+1)
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
				$scope.currentPage = $scope.currentPage + 1;
			}else{
				showModal({msg:"已经是最后一页了"});
				return;
			}
		}else{
			$scope.currentPage = page;
		}
		apiCaller.getProductListByPage($scope.currentPage,function() {
			$scope.pdList = scopeData.ProductionList;
			console.log('aaaaa','callapisuccess')
		},function() {
			$scope.currentPage = $scope.currentPage - 1;
		});
	}

    $scope.orderBtnClicked = function(Product,count) {
    	var result = apiCaller.postOrderedProduct(Product,count,function(){
    		showModal({msg:"已加当月订单"});
    	});
    	console.log("eeeeee",result)
    }

    $scope.favoriteClicked = function(Product) {
    	if(!Product.isFavorite){
    		Product.isFavorite = true
    		showModal({msg:"添加到我的收藏"});
    	}else{
    		Product.isFavorite = false
    		showModal({msg:"已取消收藏"}); 
    	}
    	// favClass=(isFavorite=='false'?'cancelfavorite':'favorite')
    }

    $scope.addCartClicked = function(Product) {
		showModal({msg:"已加当月订单"});
    }

    $scope.imgClicked = function() {
    	console.log('aaaaa',$scope.pdList)
    }

    $(document).on("click",".list",function(){
	    $(".option-list").fadeOut(200); 
	});
	  
	$('.layout,.mobile-header-wrapper').click(function(){
	    $(".option-list").fadeOut(200); 
	});
}]);

homeModule.controller('pcHeaderController', ['$scope',function ($scope) {
	//pc js-------------------------------------------------- 

	//展开/闭合优惠价
	$('[action="pc-select-onsale"]').mouseenter(function(){   
		if($(".pc-onsale-list-wrapper").css("display")=="none"){
		  $(".pc-onsale-list-wrapper").fadeIn(200); 
		}
	}).mouseleave(function(){   
		if($(".pc-onsale-list-wrapper").css("display")!="none"){
		  $(".pc-onsale-list-wrapper").fadeOut(200);  
		}
	});
}]);

homeModule.controller('pcNavController',['$scope','apiCaller',function($scope,apiCaller) {
	
	$scope.showList=false

	$scope.categories=apiCaller.getCategories(function(){
		apiCaller.getProductListByDivision($scope.categories[0])
	});
	
	$scope.divisionClicked=function(Division) {
		apiCaller.getProductListByDivision(Division);
	}
	$scope.groupClicked=function(Group) {
		apiCaller.getProductListByGroup(Group);
	}
}]);

homeModule.controller('mbNavController',['$scope','apiCaller',function($scope,apiCaller) {
	$scope.lit2Show=''
	$scope.categories = {};
	$scope.categories=apiCaller.getCategories(function () {
		$scope.Division = $scope.categories[0];
		$scope.Group = $scope.categories[0].Class2;
		$scope.DivisionName = $scope.categories[0].Name;
		$scope.GroupName = '系列';
	});

	$scope.divisionItemClicked = function(Division) {
		$scope.DivisionName = Division.Name;
		$scope.Group = Division.Class2;
		$scope.GroupName = '系列';
		apiCaller.getProductListByDivision(Division);
	}
	$scope.groupItemClicked = function(Group) {
		$scope.GroupName = Group.Name;
		apiCaller.getProductListByGroup(Group);
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
}]);

homeModule.controller('mbHeaderController', ['$scope',function ($scope) {
	//mobile js--------------------------------------------------
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
	console.log(event.target)
	if(event.target!=$('.mobile-onsale-content')[0] && event.target!=$('.mobile-onsale-arrow')[0]){
	  
	  if($(".mobile-onsale-list").css("display")=="block"){
	    	$(".mobile-onsale-list").fadeOut(200);  
	  	}
	  }

	});
}]);