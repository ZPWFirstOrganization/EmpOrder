orderApp.controller('pcHeaderController', function($scope,$stateParams,$state,scopeData,scopeMethod,apiCaller) {
	$scope.showList = false;
	$scope.searchKey = "";
	var delayTime;
	var isGroupClicked = false;
	var data = [];
	
	$("#pcSeach").keyup(function(event){
		clearTimeout(delayTime);
		$('#pcSeach').autocompleter('destroy');
		if (event.keyCode == 13){
			if($scope.searchKey != ""){
				$state.go('index.searchResult',{key:$scope.searchKey,page:1})
				$('#pcSeach').autocompleter('close');
			}
		}else{
			delayTime = setTimeout(function() {
				apiCaller.getSearchTips($scope.searchKey,function(res){
					data = [];
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
					};
					$('#pcSeach').blur()
					setTimeout(function(){
						$('#pcSeach').autocompleter({ 
							highlightMatches: true,
					        empty: false,
					        limit: 5,
							source: data
						});
						$('#pcSeach').focus()
					},100)
				})
			},500);
		}
	})

	$scope.categories=apiCaller.getCategories(function(res){
		scopeData.categories = res;
		if($stateParams.productClass == "" || $stateParams.productCode == "" || $stateParams.page == ""){
			scopeMethod.changeState("1",$scope.categories[0].categoryCode,"1");
		}else if($stateParams.productClass && $stateParams.productCode && $stateParams.page){
			scopeMethod.changeState($stateParams.productClass,$stateParams.productCode,$stateParams.page);
		}
		
	},function(){
		$("body").hideLoading();
	});

	$scope.divisionClicked=function(Division) {
		if(!isGroupClicked){
			scopeData.currentDivisionName = Division.categoryName;
			scopeData.divisionCode = Division.categoryCode;
			scopeData.currenGroupName = '';
	        scopeMethod.changeState("1",Division.categoryCode,"1");
	    }else{
	    	isGroupClicked = false;
	    }
	}

	$scope.groupClicked=function(Group,Division) {
		isGroupClicked = true;
        scopeMethod.changeState("2",Group.seriesCode,"1");
		// $scope.showList = false;
	}

	$scope.logoClicked = function() {
		scopeMethod.changeState("1","1","1");
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
