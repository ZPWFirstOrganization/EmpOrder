orderApp.controller('pcHeaderController', function($scope,$stateParams,$state,scopeData,scopeMethod,apiCaller) {
	$scope.showList = false;
	$scope.searchKey = "";
	var delayTime;
	$(".search").keyup(function(){
		clearTimeout(delayTime);
		delayTime = setTimeout(function() {
			apiCaller.getSearchResult($scope.searchKey,function(res){
				console.log('searchresult',res)
				var data = [];
				for (var i = 0; i < res.length; i++) {
					var tmp;
					if(res[i].productCode){
						tmp = {"value":res[i].productCode,"label":res[i].productCode}
						data.push(tmp)
					}
					if(res[i].productName){
						tmp = {"value":res[i].productName,"label":res[i].productName}
						data.push(tmp)
					}
					// if(i>=5){
					// 	break;
					// }
				};
				console.log('data',data)
				$('.search').autocompleter({ 
					highlightMatches: true,
			        // abort source if empty field
			        empty: false,
			        // max results
			        limit: 5,
					source: data
				});
			})
		},1000);
	})
	$scope.categories=apiCaller.getCategories(function(){
		scopeData.homeDivisionName = $scope.categories[0].name;
		scopeData.homeDivisionCode = $scope.categories[0].code;
		if($stateParams.productClass == "" || $stateParams.productCode == "" || $stateParams.page == ""){
			scopeMethod.changeState("1",$scope.categories[0].code,"1");
		}else if($stateParams.productClass && $stateParams.productCode && $stateParams.page){
			scopeMethod.changeState($stateParams.productClass,$stateParams.productCode,$stateParams.page);
		}
	});

	$scope.divisionClicked=function(Division) {
		scopeData.currentDivisionName = Division.name;
		scopeData.divisionCode = Division.code;
		scopeData.currenGroupName = '';
        scopeMethod.changeState("1",Division.code,"1");
	}
	$scope.groupClicked=function(Group,Division) {
		scopeData.currentDivisionName = Division.name;
		scopeData.divisionCode = Division.code;
		scopeData.currenGroupName = Group.name;
		scopeData.groupCode = Group.code;
        scopeMethod.changeState("2",Group.code,"1");
	}

	$scope.logoClicked = function() {
		scopeMethod.changeState("1","1","1");
		scopeData.currentDivisionName = $scope.categories[0].name;
		scopeData.currenGroupName = '';
	}

	$scope.favClicked = function() {
		$state.go('index.favorites')
	}

	$scope.searchClicked = function(){
		$state.go('index.searchResult')
	}
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
});
