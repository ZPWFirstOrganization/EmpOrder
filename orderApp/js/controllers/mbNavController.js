orderApp.controller('mbNavController',function ($scope,$stateParams,apiCaller,scopeMethod) {
	$("body").showLoading();
	$scope.lit2Show=''
	$scope.isDLShow = false;
	$scope.isGLShow = false;
	$scope.categories=apiCaller.getCategories(function (res) {
		for(index in $scope.categories){
			if($stateParams.productClass == 1){
				if($stateParams.productCode == $scope.categories[index].categoryCode){
					$scope.Division = $scope.categories[index];
					$scope.Group = $scope.categories[index].series;
					$scope.DivisionName = $scope.categories[index].categoryName;
					$scope.GroupName = '系列';
					break;
				}
			}
			if($stateParams.productClass == 2){
				for(it in $scope.categories[index].series){
					if($stateParams.productCode == ($scope.categories[index].series)[it].seriesCode){
						$scope.Division = $scope.categories[index];
						$scope.Group = $scope.categories[index].series;
						$scope.DivisionName = $scope.categories[index].categoryName;
						$scope.GroupName = ($scope.categories[index].series)[it].seriesName;
						break;
					}
				}
			}
		}
		$("body").hideLoading();
	},function(){
		$("body").hideLoading();
	});

	$("body").click(function(event){ 
        if(event.target!=$('.select-content')[0] && event.target!=$('.select-arrow')[0] && event.target!=$('.select-content')[1] && event.target!=$('.select-arrow')[1] ){
            if($("#DivisionList").css("display")!="none"){
				$("#DivisionList").slideUp(300);
				$("#DivisionArrow").removeClass("select-arrow-up")
				hideModalBg();
			}
			if($("#GroupList").css("display")!="none"){
				$("#GroupList").slideUp(300);
				$("#GroupArrow").removeClass("select-arrow-up")
				hideModalBg();
			}
        }
    });

	var isBodyClicked = true;
	$scope.divisionClicked = function(){
		isBodyClicked = false
		if($("#DivisionList").css("display")=="none"){
			$("#DivisionList").slideDown(300);
			$("#DivisionArrow").addClass("select-arrow-up")
			$("#GroupArrow").removeClass("select-arrow-up")
			$("#GroupList").slideUp(0);
			hideModalBg();
			showModalBg($("#DivisionList"));
		}else{
			$("#DivisionList").slideUp(300);
			$("#DivisionArrow").removeClass("select-arrow-up")
			hideModalBg();
		}
	}

	$scope.groupClicked = function(){
		isBodyClicked = false
		if($("#GroupList").css("display")=="none"){
			$("#GroupList").slideDown(300);
			$("#DivisionList").slideUp(0);
			$("#GroupArrow").addClass("select-arrow-up")
			$("#DivisionArrow").removeClass("select-arrow-up")
			hideModalBg();
			showModalBg($("#GroupList"));
		}else{
			$("#GroupList").slideUp(300);
			$("#GroupArrow").removeClass("select-arrow-up")
			hideModalBg();
		}
	}

	$scope.divisionItemClicked = function(Division) {
		$scope.DivisionName = Division.categoryName;//显示在大类类列表上的文字
		$scope.Group = Division.series;//显示在小类中各个系列
		$scope.GroupName = '系列';
		if($("#DivisionList").css("display")!="none"){
			$("#DivisionList").slideUp(300);
			$("#DivisionArrow").removeClass("select-arrow-up")
			hideModalBg();
		}
		if($("#GroupList").css("display")!="none"){
			$("#GroupList").slideUp(300);
			$("#GroupArrow").removeClass("select-arrow-up")
			hideModalBg();
		}
		setTimeout(function(){
			scopeMethod.changeState("1",Division.categoryCode,"1");
		},300)
	}
	
	$scope.groupItemClicked = function(Group) {
		$scope.GroupName = Group.seriesName;
		if($("#DivisionList").css("display")!="none"){
			$("#DivisionList").slideUp(300);
			$("#DivisionArrow").removeClass("select-arrow-up")
			hideModalBg();
		}
		if($("#GroupList").css("display")!="none"){
			$("#GroupList").slideUp(300);
			$("#GroupArrow").removeClass("select-arrow-up")
			hideModalBg();
		}
		setTimeout(function(){
			scopeMethod.changeState("2",Group.seriesCode,"1");
		},300)
		
	}
});