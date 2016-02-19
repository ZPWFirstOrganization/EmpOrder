orderApp.controller('pcHeaderController', function($scope,$stateParams,$state,scopeData,scopeMethod,apiCaller) {
	$scope.showList = false;
	$scope.searchKey = "";
	var delayTime;
	
	$(".search").keyup(function(event){
		clearTimeout(delayTime);
		if (event.keyCode == 13){
			console.log("event.keyCode == 13",$scope.searchKey)
			if($scope.searchKey != ""){
				$state.go('index.searchResult',{key:$scope.searchKey,page:1})
			}
		// }else{
		// 	delayTime = setTimeout(function() {
		// 		apiCaller.getSearchResult($scope.searchKey,function(res){
		// 			console.log('searchresult',res)
		// 			var data = [];
		// 			for (var i = 0; i < res.length; i++) {
		// 				var tmp;
		// 				if(res[i].productCode){
		// 					tmp = {"value":res[i].productCode,"label":res[i].productCode}
		// 					data.push(tmp)
		// 				}
		// 				if(res[i].productName){
		// 					tmp = {"value":res[i].productName,"label":res[i].productName}
		// 					data.push(tmp)
		// 				}
		// 			};
		// 			console.log('data',data)
		// 			$('.search').autocompleter({ 
		// 				highlightMatches: true,
		// 		        // abort source if empty field
		// 		        empty: false,
		// 		        // max results
		// 		        limit: 5,
		// 				source: data
		// 			});
		// 		})
		// 	},1000);
		}
	})

	$scope.categories=apiCaller.getCategories(function(){
		scopeData.homeDivisionName = $scope.categories[0].categoryName;
		scopeData.homeDivisionCode = $scope.categories[0].categoryCode;
		if($stateParams.productClass == "" || $stateParams.productCode == "" || $stateParams.page == ""){
			scopeMethod.changeState("1",$scope.categories[0].categoryCode,"1");
		}else if($stateParams.productClass && $stateParams.productCode && $stateParams.page){
			scopeMethod.changeState($stateParams.productClass,$stateParams.productCode,$stateParams.page);
		}
	});

	$scope.divisionClicked=function(Division) {
		scopeData.currentDivisionName = Division.categoryName;
		scopeData.divisionCode = Division.categoryCode;
		scopeData.currenGroupName = '';
        scopeMethod.changeState("1",Division.categoryCode,"1");
	}

	$scope.groupClicked=function(Group,Division) {
		scopeData.currentDivisionName = Division.categoryName;
		scopeData.divisionCode = Division.categoryCode;
		scopeData.currenGroupName = Group.seriesName;
		scopeData.groupCode = Group.seriesCode;
        scopeMethod.changeState("2",Group.seriesCode,"1");
	}

	$scope.logoClicked = function() {
		scopeMethod.changeState("1","1","1");
		scopeData.currentDivisionName = $scope.categories[0].categoryName;
		scopeData.currenGroupName = '';
	}

	$scope.favClicked = function() {
		$state.go('index.favorites',{page:1});
	}

	$scope.searchClicked = function(){
		if($scope.searchKey != ""){
			$state.go('index.searchResult',{key:$scope.searchKey,page:1})
		}
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
