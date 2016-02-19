orderApp.controller('mbNavController',function ($scope,$stateParams,apiCaller,scopeMethod) {
	$("body").showLoading(-150);
	$scope.lit2Show=''
	$scope.isDLShow = false;
	$scope.isGLShow = false;
	$scope.categories=apiCaller.getCategories(function () {
		// $scope.Division = $scope.categories[0];//显示在大类类列表中的系列
		// $scope.Group = $scope.categories[0].series;//显示在小类中各个系列
		// $scope.DivisionName = $scope.categories[0].categoryName;//显示在大类选择上的文字
		// $scope.GroupName = '系列';
		for(item in $scope.categories){
			if($stateParams.productClass == 1){
				if($stateParams.productCode == $scope.categories[item].categoryCode){
					$scope.Division = $scope.categories[item];
					$scope.Group = $scope.categories[item].series;
					$scope.DivisionName = $scope.categories[item].categoryName;
					$scope.GroupName = '系列';
					break;
				}
			}
			if($stateParams.productClass == 2){
				for(it in $scope.categories[item].series){
					if($stateParams.productCode == ($scope.categories[item].series)[it].seriesCode){
						$scope.Division = $scope.categories[item];
						$scope.Group = $scope.categories[item].series;
						$scope.DivisionName = $scope.categories[item].categoryName;
						$scope.GroupName = ($scope.categories[item].series)[it].seriesName;
						break;
					}
				}
			}
		}
		$("body").hideLoading();
		console.log('$scope.categories',$scope.categories)
	});

	$scope.divisionClicked = function(){
		if(!$scope.isDLShow){
			console.log('divisionClicked')
			$scope.isDLShow = true;
			$scope.isGLShow = false;
			showModalBg($("#DivisionList"));
		}else{
			$scope.isDLShow = false;
			$scope.isGLShow = false;
			hideModalBg();
		}
	}

	$scope.groupClicked = function(){
		if(!$scope.isGLShow){
			$scope.isDLShow = false;
			$scope.isGLShow = true;
			showModalBg($("#GroupList"));
		}else{
			$scope.isDLShow = false;
			$scope.isGLShow = false;
			hideModalBg();
		}
	}

	$scope.divisionItemClicked = function(Division) {
		$scope.DivisionName = Division.categoryName;//显示在大类类列表上的文字
		$scope.Group = Division.series;//显示在小类中各个系列
		$scope.GroupName = '系列';
		$scope.isDLShow = false;
		hideModalBg();
		scopeMethod.changeState("1",Division.categoryCode,"1");
	}
	$scope.groupItemClicked = function(Group) {
		$scope.GroupName = Group.seriesName;
		$scope.isGLShow = false;
		hideModalBg();
		scopeMethod.changeState("2",Group.seriesCode,"1");
	}

	$("body").click(function(event){
		if($scope.isDLShow){
			$scope.isDLShow = false;
			hideModalBg();
		}
		if($scope.isGLShow){
			$scope.isGLShow = false;
			hideModalBg();
		}
	})
});