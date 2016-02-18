orderApp.controller('historyOrderCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData){
	$("body").showLoading(-150);
	$scope.isHaveData = true;
	$scope.orderList = [];
	$scope.pages = [];
	$scope.pageCount = 0
	$scope.currentPage = $stateParams.page;
	$scope.showYear = "选择年"
	$scope.showMonth = "选择月"
	$scope.years = [{name:"选择年",value:null},
					{name:"2008",value:"2008"},{name:"2009",value:"2009"},
					{name:"2010",value:"2010"},{name:"2011",value:"2011"},
					{name:"2012",value:"2012"},{name:"2013",value:"2013"},
					{name:"2014",value:"2014"},{name:"2015",value:"2015"},
					{name:"2016",value:"2016"}
				   ]

	$scope.months = [{name:"选择月",value:null},
					{name:"1月",value:"01"},{name:"2月",value:"02"},
					{name:"3月",value:"03"},{name:"4月",value:"04"},
					{name:"5月",value:"05"},{name:"6月",value:"06"},
					{name:"7月",value:"07"},{name:"8月",value:"08"},
					{name:"9月",value:"09"},{name:"10月",value:"10"},
					{name:"11月",value:"11"},{name:"12月",value:"12"}
					]

	if (angular.isUndefined($stateParams.page)){
		$stateParams.page = 1
	}
	scopeData.currentOrderPage = $stateParams.page
	$scope.secretary = {userName:"",userPhone:""}
	//获取订单信息
	function queryOrderInfo(){
		var orderDate = ""
		if (!angular.isUndefined($stateParams.orderDate)){
			orderDate = $stateParams.orderDate
		}
		apiCaller.getOrderListByPage({userAccount:'456456',orderDate:orderDate,pageNum:scopeData.currentOrderPage},function(res){
		// console.log(res)
		$scope.pages = []
		$scope.orderList = []
		// if (angular.isUndefined(res.order)){
		// 	$scope.isHaveData = false;
		// 	$("body").hideLoading();
		// 	return
		// }
		if(res.order.length == 0){
			$scope.isHaveData = false;
		}else{
			$scope.isHaveData = true;
			$scope.pageCount = res.pageCount
			for (var i = 0; i < res.pageCount; i++) {
				$scope.pages.push(i+1)
			};
			$scope.orderList = res.order;
		}
			// $scope.pageCount = 5
			// $scope.pages = [1,2,3,4,5];
			$("body").hideLoading();
			// $scope.orderList = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
		},function(res){
			$scope.pages = []
			$scope.orderList = []
			$scope.isHaveData = false;
			$("body").hideLoading();
		})
	}
	queryOrderInfo("")
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

    $("body").click(function(event){ 
        if(event.target!=$('.select-content')[0] && event.target!=$('.select-arrow')[0] && event.target!=$('.select-content')[1] && event.target!=$('.select-arrow')[1] ){
            if($("#yearList").css("display")=="block"){
                $("#yearList").fadeOut(200); 
                hideModalBg();  
            }
            if($("#monthList").css("display")=="block"){
                $("#monthList").fadeOut(200); 
                hideModalBg();  
            }
        }

    });
    // $scope.select = function(flag){
    // 	var y = ["2016","2015","2014"]
    // 	var m = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
    // 	if($(".option-list").css("display")=="none"){
    //         $(".option-list").fadeIn(200);  
    //         showModalBg($(".option-list"));     
            
    //     }else if($(this).attr("cname")==$(".option-list").attr("belong")){
    //         $(".option-list").fadeOut(200);
    //         hideModalBg();  
    //     }
    //     var data = []
    //     if ( flag == 'year' ){
    //     	data = y
    //     }else{
    //     	data = m
    //     }
    //     // data=$(this).attr("data").split(",");
    //     $(".option-list").html("");
    //     $.each( data, function(i, n){
    //       //alert( "Item #" + i + ": " + n );
    //       $(".option-list").append('<a class="list" onclick="selectItem()">'+n+'</a>')
          
    //     });
    //     alert($(this).attr("cname"))
    //     $(".option-list").attr("belong",$(this).attr("cname"));
    // }
    var selectYear = ""
    var selectMonth = ""
    $scope.selectList = function(flag){
     	// alert(flag)
     	if (flag=="year"){
     		if($("#yearList").css("display")=="none"){
				$("#yearList").fadeIn(200);
				$("#monthList").fadeOut(200);
				hideModalBg();
				showModalBg($("#yearList"))
			}else{
				$("#yearList").fadeOut(200);
				hideModalBg();  
			}
     	}else{
	     	if($("#monthList").css("display")=="none"){
				$("#monthList").fadeIn(200);
				$("#yearList").fadeOut(200);
				hideModalBg();
				showModalBg($("#monthList"))
			}else{
				$("#monthList").fadeOut(200);
				hideModalBg();  
			}
		}
		// showModalBg($(".option-list"))
    }
    $scope.selectItem = function(flag,data){
     	if(flag=="year"){
     		$scope.showYear = data.name
     		selectYear = data.value
     	}else{
     		$scope.showMonth = data.name
     		selectMonth = data.value
     	}
 		if (selectYear != "" && selectMonth != ""){
 			var date = selectYear +"-"+ selectMonth
 			$("body").showLoading(-150);
 			// $state.go('index.historyOrder',
 			// 	{
 			// 		page:1,
 			// 		orderParam:{year:$scope.pcSelectYear,month:$scope.pcSelectMonth}
 			// 	})
 			queryOrderInfo(date)
 		}
    }
    $scope.pcSelectYear = null
    $scope.pcSelectMonth = null
    if (!angular.isUndefined($stateParams.orderParam)){
    	$scope.pcSelectYear = $stateParams.orderParam.year
    	$scope.pcSelectMonth = $stateParams.orderParam.month
    }
    console.log($stateParams.orderParam)
    console.log("aaaaaaaaaaaaaaaaaa",$scope.pcSelectYear)
    // $scope.pcSelectYear = null
    // $scope.pcSelectMonth = null
    $scope.pcSelectDate = function(){
    // console.log($scope.pcSelectYear,$scope.pcSelectMonth)
    	if($scope.pcSelectYear != null && $scope.pcSelectMonth != null){
    		var date = $scope.pcSelectYear.value +"-"+ $scope.pcSelectMonth.value
 			$("body").showLoading(-150);
 			// queryOrderInfo(date)
 			$state.go('index.historyOrder',
 				{
 					page:1,
 					orderParam:{year:$scope.pcSelectYear,month:$scope.pcSelectMonth},
 					orderDate:date
 				})
    	}else if($scope.pcSelectYear == null && $scope.pcSelectMonth == null){
    		$state.go('index.historyOrder',
 				{
 					page:1,
 					orderDate:""
 				})
    	}
    }
})

 orderApp.filter('stateFilter',function(){
 	return function (input) {
 		var map = {0:"未确认",1:"已确认",2:"已处理",3:"已打包",4:"作废"} 
           return map[parseInt(input)+""]
        }
 })


 // function selectItem(){
 // 	alert("click")
 // 	$('[cname="'+$(".option-list").attr("belong")+'"]').find('.select-content').html($(this).html())
 //    if($(".option-list").css("display")=="block"){
 //        $(".option-list").fadeOut(200); 
 //        hideModalBg();  
 //    }
 // }