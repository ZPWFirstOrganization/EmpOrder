orderApp.controller('historyOrderCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData){
	$("body").showLoading(-150);
	$("body").showLoading(-150);
	$scope.isHaveData = true;
	$scope.orderList = [];
	$scope.pages = [];
	$scope.pageCount = 0
	$scope.currentPage = $stateParams.page;
	if (angular.isUndefined($stateParams.page)){
		$stateParams.page = 1
	}
	scopeData.currentOrderPage = $stateParams.page
	$scope.secretary = {userName:"",userPhone:""}
	//获取订单信息
	apiCaller.getOrderListByPage({userAccount:'456456',orderDate:"2016-01",pageNum:1},function(res){
		console.log(res)
		if(res.order.length == 0){
			$scope.isHaveData = false;
		}else{
			$scope.pageCount = res.pageCount
			for (var i = 0; i < res.pageCount; i++) {
				$scope.pages.push(i+1)
			};
			// $scope.orderList = res.order;

		}
		$scope.pageCount = 5
		$scope.pages = [1,2,3,4,5];
		$("body").hideLoading();
		$scope.orderList = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
	})
	$scope.pageNumClicked = function(page){
		if($scope.currentPage == page){
			return;
		}
		if('next' == page){
			if($scope.currentPage < $scope.pageCount){
				scopeData.currentOrderPage = parseInt($stateParams.page) + 1
				$state.go('index.historyOrder',{page:scopeData.currentOrderPage});
			}else{
				showModal({msg:"已经是最后一页了"});
				return;
			}
		}else{
			// $scope.currentPage = page;
			$state.go('index.historyOrder',{page:page});
		}
	}
	//获取秘书
  	if (scopeData.secretaryName == '' || scopeData.secretaryPhone == ''){
		apiCaller.getSecretary({userAccount:'123123'},function(response){
			scopeData.secretaryName = response[0].userName
	  		$scope.secretary.userName = scopeData.secretaryName
	  		scopeData.secretaryPhone = response[0].userPhone
	  		$scope.secretary.userPhone = scopeData.secretaryPhone
	  	})
	}else{
		$scope.secretary.userName = scopeData.secretaryName
		$scope.secretary.userPhone = scopeData.secretaryPhone
	}
})

 orderApp.filter('stateFilter',function(){
 	return function (input) {
 		var map = {0:"未确认",1:"已确认",2:"已处理",3:"已打包",4:"作废"} 
           return map[parseInt(input)+""]
        }
 })