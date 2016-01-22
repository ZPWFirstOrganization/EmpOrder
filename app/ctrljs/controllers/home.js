var orderControllers = angular.module('demoControllers', ['ngResource']);

orderControllers.factory('scopeData',function() {
	return{ 
		ProductionList:{}
	}
});

orderControllers.factory('apiCaller',['productApiService','scopeData',function(productApiService,scopeData) {
	return{
		getProductListByDivision:function(Division){
			scopeData.ProductionList = productApiService.getProductList({
				code:Division.Code,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:'1',//大类为1，小类为2
				pageNum:'1',
				userAccount:'123123'
			});
		},
		getProductListByGroup:function(Group) {
			scopeData.ProductionList = productApiService.getProductList({
				code:Group.Code,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:'2',//大类为1，小类为2
				pageNum:'1',
				userAccount:'123123'
			});
		},
		getCategories:function(callbackFn){
			return productApiService.getCategories({},function(response){
				// categories = angular.copy(response);
				if (callbackFn) {
					callbackFn();
				}
			});
		}
	}
}]);

orderControllers.factory('productApiService',['$resource',function($resource){
	return $resource(
		'http://182.92.110.219:8090/MLK/2/Product',
		{},
		{
			getCategories:{
				method:'GET',
				isArray:true
			},
			getProductList:{
				method:'GET',
				params:{
					code:'@code',//大类传大类的id,小类传小类的CONFIG_VALUE
					productClass:'@productClass',//大类为1，小类为2
					pageNum:'@pageNum',
					userAccount:'@userAccount'
				},
				isArray:false
			}
		}
	);
}]);

orderControllers.controller('prductListController',['$scope','scopeData',function($scope,scopeData) {
	$scope.pdList = {};
	var coptyData = setInterval(function() {
		if (scopeData.ProductionList != $scope.pdList){
			$scope.pdList = scopeData.ProductionList;
		}
	},100)
	$scope.$on("$destroy", function() {
    	clearInterval(coptyData);
    })

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
}]);

orderControllers.controller('pcHeaderController', ['$scope',function ($scope) {
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

orderControllers.controller('pcNavController',['$scope','apiCaller',function($scope,apiCaller) {
	
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

orderControllers.controller('mbNavController',['$scope','apiCaller',function($scope,apiCaller) {
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
			$("#DivisionList").fadeIn(500); 
			$("#GroupList").fadeOut(500);    
		}else{
			$("#DivisionList").fadeOut(500); 
		}
	});
	$('[action="right_select"]').click(function(){
		if($("#GroupList").css("display")=="none"){
			$("#GroupList").fadeIn(500); 
			$("#DivisionList").fadeOut(500);     
		}else{
			$("#GroupList").fadeOut(500); 
		}
	});
	$(document).on("click",".list",function(){
	    $(".option-list").fadeOut(200); 
	 });
	  
	$('.layout,.mobile-header-wrapper').click(function(){
	    $(".option-list").fadeOut(200); 
	}); 
}]);

orderControllers.controller('mbHeaderController', ['$scope',function ($scope) {
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