orderApp.controller('mbNavController',function($scope,apiCaller,scopeMethod) {
	$("body").showLoading(-150);
	$scope.lit2Show=''
	$scope.categories=apiCaller.getCategories(function () {
		$scope.Division = $scope.categories[0];//显示在大类类列表中的系列
		$scope.Group = $scope.categories[0].series;//显示在小类中各个系列
		$scope.DivisionName = $scope.categories[0].categoryName;//显示在大类选择上的文字
		$scope.GroupName = '系列';
		$("body").hideLoading();
	});

	$scope.divisionItemClicked = function(Division) {
		$scope.DivisionName = Division.categoryName;//显示在大类类列表上的文字
		$scope.Group = Division.series;//显示在小类中各个系列
		$scope.GroupName = '系列';
		scopeMethod.changeState("1",Division.categoryCode,"1");
	}
	$scope.groupItemClicked = function(Group) {
		$scope.GroupName = Group.seriesName;
		scopeMethod.changeState("2",Group.seriesCode,"1");
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