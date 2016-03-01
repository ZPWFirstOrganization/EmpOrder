orderApp.controller('pcHeaderController', function($scope,$stateParams,$state,scopeData,scopeMethod,apiCaller) {
	
	if("2"==$stateParams.discountType){
		$scope.currentType = "优惠价";
		$scope.typeForChnage = "6折";
	}else{
		$scope.currentType = "6折";
		$scope.typeForChnage = "优惠价";
	}
	scopeData.discountType = $stateParams.discountType;
	$scope.showList = false;
	$scope.searchKey = "";
	var delayTime;
	var isGroupClicked = false;
	$scope.DataForMatch = [];
	
	$("#pcSeach").keyup(function(event){
		if(event.keyCode != 38 && event.keyCode != 40){
			clearTimeout(delayTime);
			if (event.keyCode == 13){
				if($scope.searchKey != ""){
					$state.go('index.searchResult',{discountType:scopeData.discountType,key:$scope.searchKey,page:1})
					$scope.searchKey='';
           			$('#pcSeach').autocompleter('close');
           			$('#pcSeach').blur();
           			$scope.DataForMatch = [];
				}
			}else{
				if($scope.searchKey != ''){
					delayTime = setTimeout(function() {
						apiCaller.getSearchTips($scope.searchKey,function(res){
							$scope.DataForMatch = [];
							for (var i = 0; i < res.length; i++) {
								var tmp;
								if(res[i].productCode){
									tmp = {"value":res[i].productCode,"label":res[i].productCode}
									$scope.DataForMatch.push(tmp)
								}
								if(res[i].productName){
									tmp = {"value":res[i].productName,"label":res[i].productName}
									$scope.DataForMatch.push(tmp)
								}
							};
						})
					},500);
				}
			}
		}
	})

	$scope.$watch("DataForMatch",function(newValue,oldValue){
		if(newValue != oldValue){
			$('#pcSeach').autocompleter('destroy');
			$('#pcSeach').blur()
			setTimeout(function(){
				$('#pcSeach').autocompleter({ 
					highlightMatches: true,
			        empty: false,
			        limit: 10,
					source: $scope.DataForMatch,
					itemClicked:function(){
						setTimeout(function(){
							$state.go('index.searchResult',{discountType:scopeData.discountType,key:$scope.searchKey,page:1})
							$scope.searchKey='';
		           			$('#pcSeach').autocompleter('close');
		           			$('#pcSeach').blur();
		           			$scope.DataForMatch = [];
		           		},100);
					}
				});
				$('#pcSeach').focus()
			},200);
		}
	},true);

	$scope.categories=apiCaller.getCategories(function(res){
		//加一个系统管理，要做权限判断是否添加
		if(scopeData.roleID == '1'){
			res.push({categoryName: '系统管理'});
		}
		scopeData.categories = res;
		if($stateParams.productClass == "" || $stateParams.productCode == "" || $stateParams.page == ""){
			scopeData.discountType = "2";
			scopeMethod.changeState("1",$scope.categories[0].categoryCode,"1");
		}else if($stateParams.productClass && $stateParams.productCode && $stateParams.page){
			scopeData.discountType = $stateParams.discountType;
			scopeMethod.changeState($stateParams.productClass,$stateParams.productCode,$stateParams.page);
		}
		$("body").hideLoading();
	},function(){
		$("body").hideLoading();
	});

	$scope.divisionClicked=function(Division) {
		if(!isGroupClicked){
			if(Division.categoryCode){
				scopeData.currentDivisionName = Division.categoryName;
				scopeData.divisionCode = Division.categoryCode;
				scopeData.currenGroupName = '';
				scopeData.discountType = $stateParams.discountType;
		        scopeMethod.changeState("1",Division.categoryCode,"1");
		    }else{
		    	alert("链接到系统管理！")
		    }
	    }else{
	    	isGroupClicked = false;
	    }
	}

	$scope.groupClicked=function(Group,Division) {
		isGroupClicked = true;
		scopeData.currentDivisionName = Division.categoryName;
		scopeData.divisionCode = Division.categoryCode;
		scopeData.groupCode = Group.seriesCode;
		scopeData.currenGroupName = Group.seriesName;
		scopeData.discountType = $stateParams.discountType;
        scopeMethod.changeState("2",Group.seriesCode,"1");
	}

	$scope.logoClicked = function() {
		scopeData.discountType = $stateParams.discountType;
		scopeMethod.changeState("1","1","1");
	}

	$scope.favClicked = function() {
		$state.go('index.favorites',{discountType:scopeData.discountType,page:1});
	}

	$scope.myBtnClicked = function(){
		$state.go('index.currentOrder',{discountType:scopeData.discountType});
	}

	$scope.searchClicked = function(){
		if($scope.searchKey != ""){
			$state.go('index.searchResult',{discountType:scopeData.discountType,key:$scope.searchKey,page:1})
			$scope.searchKey='';
           	$('#pcSeach').autocompleter('close');
   			$('#pcSeach').blur();
   			$scope.DataForMatch = [];
		}
	}
	$scope.noticeClicked = function(){
		$state.go('index.notice',{discountType:scopeData.discountType});
	}

	$scope.changeDiscountType = function(){
		if($stateParams.discountType == "2"){
			$scope.currentType = "6折";
			$scope.typeForChnage = "优惠价";
			scopeData.discountType = "6"
		}else{
			$scope.currentType = "优惠价";
			$scope.typeForChnage = "6折";
			scopeData.discountType = "2"
		}
		$(".pc-onsale-list-wrapper").fadeOut(200);  
		scopeMethod.changeState("1","1","1");
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
