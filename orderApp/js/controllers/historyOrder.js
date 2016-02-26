orderApp.controller('historyOrderCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData){
	$('html,body').animate({scrollTop: '0px'},0)
	$("body").showLoading();
	$scope.isHaveData = true;
	$scope.orderList = [];
	$scope.pages = [];
	// $scope.pageCount = 0
	$scope.currentPage = parseInt($stateParams.page);
	scopeData.discountType = $stateParams.discountType;
	$scope.discountType = scopeData.discountType;
	// scopeData.sourcePageId = 2;
	// $scope.showYear = "选择年"
	// $scope.showMonth = "选择月"	
	$scope.pcSelectYear = null
    $scope.pcSelectMonth = null
	// $scope.years = [
	// 				{name:"2016",value:"2016"},{name:"2015",value:"2015"},
	// 				{name:"2014",value:"2014"},{name:"2013",value:"2013"},
	// 				{name:"2012",value:"2012"},{name:"2011",value:"2011"},
	// 				{name:"2010",value:"2010"},{name:"2009",value:"2009"},
	// 				{name:"2008",value:"2008"}
	// 			   ]
	$scope.years = [{name:"选择年",value:""}]
	$scope.months = [{name:"选择月",value:""},
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
	// scopeData.currentOrderPage = $stateParams.page
	$scope.secretary = {userName:"",userPhone:""}
	var startYear = 2008
	//获取订单信息
	function queryOrderInfo(orderDate){
		// var orderDate = ""
		// if (!angular.isUndefined($stateParams.orderDate)){
		// 	orderDate = $stateParams.orderDate
		// }
		apiCaller.getOrderListByPage({userAccount:scopeData.userAccount,orderDate:orderDate,pageNum:$scope.currentPage},function(res){
		console.log(res)
		$scope.pages = []
		$scope.orderList = []
		// if (angular.isUndefined(res.order)){
		// 	$scope.isHaveData = false;
		// 	$("body").hideLoading();
		// 	return
		// }
		if (res.firstOrderDate) {
			startYear = parseInt(res.firstOrderDate.split("-")[0])
		}
		
		if(res.order.length == 0){
			$scope.isHaveData = false;
		}else{
			$scope.isHaveData = true;
			// $scope.pageCount = res.pageCount
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
			// $scope.pages = []
			// $scope.orderList = []
			$scope.isHaveData = false;
			$("body").hideLoading();
		})
	}
	queryOrderInfo($stateParams.orderDate)
	$scope.pageNumClicked = function(page){
		if($scope.currentPage == page){
			return;
		}
		//下一页
		if('next' == page){
			if($scope.currentPage < $scope.pages.length){
				$scope.currentPage = parseInt($stateParams.page) + 1
				// $('html,body').animate({scrollTop: '0px'},100)
				$state.go('index.historyOrder',{page:$scope.currentPage});
			}else{
				// showModal({msg:"已经是最后一页"});
				return;
			}
		}
		//上一页
		else if('previous' == page){
			if($scope.currentPage > 1){
				$scope.currentPage = parseInt($stateParams.page) - 1
				// $('html,body').animate({scrollTop: '0px'},100)
				$state.go('index.historyOrder',{page:$scope.currentPage});
			}else{
				// showModal({msg:"已经是最后一页"});
				return;
			}
		}
		//首页
		else if('first' == page){
			if($scope.currentPage != 1){
				$scope.currentPage = 1
				// $('html,body').animate({scrollTop: '0px'},100)
				$state.go('index.historyOrder',{page:1});
			}else{
				// showModal({msg:"已经是最后一页"});
				return;
			}
		}
		//尾页
		else if('last' == page){
			if($scope.currentPage != $scope.pages.length){
				$scope.currentPage = $scope.pages.length
				// $('html,body').animate({scrollTop: '0px'},100)
				$state.go('index.historyOrder',{page:$scope.pages.length});
			}else{
				// showModal({msg:"已经是最后一页"});
				return;
			}
		}
		//点击页码
		else{
			// $scope.currentPage = page;
			// $('html,body').animate({scrollTop: '0px'},100)
			$state.go('index.historyOrder',{page:page});
		}
	}
	var currentYear = (new Date()).getFullYear()
	//获取秘书
  	if (scopeData.secretaryName == '' || scopeData.secretaryPhone == ''){
		apiCaller.getSecretary({userAccount:scopeData.userAccount},function(response){
			if (response[0]){
				currentYear = parseInt(response[0].currentYear)
				scopeData.secretaryName = response[0].userName
		  		$scope.secretary.userName = scopeData.secretaryName
		  		scopeData.secretaryPhone = response[0].userPhone
		  		$scope.secretary.userPhone = scopeData.secretaryPhone
	  		}
	  		initLizeSelecter()
	  	},function(response){
	  		initLizeSelecter()
	  	})
	}else{
		$scope.secretary.userName = scopeData.secretaryName
		$scope.secretary.userPhone = scopeData.secretaryPhone
		initLizeSelecter()
	}
	// var mobileSelectYear = ""
 //    var mobileSelectMonth = ""
	function initLizeSelecter(){
  		//初始化年份
  		var yearObj
  		for (var i = currentYear; i >= startYear; i--) {
  			yearObj = new Object()
  			yearObj.name = String(i)
  			yearObj.value = String(i)
  			$scope.years.push(yearObj)
  		};
  		//初始化日期选择器
		// alert($scope.pcSelectYear)
		// alert($stateParams.orderDate)
		var dateArray = $stateParams.orderDate.split("-")
		var yearHolder = "" //= ($scope.pcSelectYear==null) ? "选择年" : $scope.pcSelectYear.name
		var monthHolder = "" //= ($scope.pcSelectMonth==null) ? "选择月" : $scope.pcSelectMonth.name
		$.each(dateArray, function(i,v){
			if(i==0){
				$.each($scope.years, function(i2,v2){
					if(v==v2.value && v!=""){
						yearHolder = v2.name
						// mobileSelectYear = v2.value
						$scope.pcSelectYear = v2
					}
				})
			}
			if(i==1){
				$.each($scope.months, function(i2,v2){
					if(v==v2.value && v!=""){
						monthHolder = v2.name
						// mobileSelectMonth = v2.value
						$scope.pcSelectMonth = v2
					}
				})
			}
        });
        if (yearHolder==""){
        	$scope.pcSelectYear=$scope.years[0];
        	yearHolder = "选择年"
        }
        if (monthHolder==""){
        	$scope.pcSelectMonth=$scope.months[0];
        	monthHolder = "选择月"
        }
  //       yearHolder = (yearHolder=="")? "选择年" : yearHolder
		// monthHolder= (monthHolder=="")? "选择月" : monthHolder
		$("#pcYearSelecter").select2({
		    width: '100%',
	        minimumResultsForSearch: Infinity,
	        placeholder: yearHolder
		});
		$("#pcMonthSelecter").select2({
		    width: '100%',
	        minimumResultsForSearch: Infinity,
	        placeholder: monthHolder
		});
		// $scope.showYear = yearHolder
		// $scope.showMonth = monthHolder
		// console.log(mobileSelectYear,",",mobileSelectMonth)
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
    $scope.selectList = function(flag){
     	// alert(flag)
     	if (flag=="year"){
     		if($("#yearList").css("display")=="none"){
     			$("#yearArrow").addClass("select-arrow-up")
     			$("#monthArrow").removeClass("select-arrow-up")
				$("#yearList").slideDown(300);
				$("#monthList").slideUp(0);
				hideModalBg();
				showModalBg($("#yearList"))
			}else{
				$("#yearArrow").removeClass("select-arrow-up")
				$("#yearList").slideUp(300);
				hideModalBg();  
			}
     	}else{
	     	if($("#monthList").css("display")=="none"){
	     		$("#monthArrow").addClass("select-arrow-up")
     			$("#yearArrow").removeClass("select-arrow-up")
				$("#monthList").slideDown(300);
				$("#yearList").slideUp(0);
				hideModalBg();
				showModalBg($("#monthList"))
			}else{
				$("#monthArrow").removeClass("select-arrow-up")
				$("#monthList").slideUp(300);
				hideModalBg();  
			}
		}
		// showModalBg($(".option-list"))
    }
    function datePickerChange(){
    	if($scope.pcSelectYear != null && $scope.pcSelectMonth != null){
    		if ($scope.pcSelectYear.value != "" && $scope.pcSelectMonth.value != ""){
	    		var date = $scope.pcSelectYear.value +"-"+ $scope.pcSelectMonth.value
	 			// $("body").showLoading(-150);
	 			// queryOrderInfo(date)
	 			$state.go('index.historyOrder',
	 				{
	 					page:1,
	 					orderParam:{year:$scope.pcSelectYear,month:$scope.pcSelectMonth},
	 					orderDate:date
	 				})
	 			$("body").hideLoading();
	 		//两个都没选择,查询所有订单
 			}else if($scope.pcSelectYear.value == "" && $scope.pcSelectMonth.value == "") {
 				$state.go('index.historyOrder',
 				{
 					page:1,
 					orderDate:"",
 					orderParam:{}
 				})
 			}
    	}
    }
    //mobile 日期选择
    $scope.selectItem = function(flag,data){
     	if(flag=="year"){
     		$scope.pcSelectYear = data
     		// $scope.showYear = data.name
     		// mobileSelectYear = data.value
     	}else{
     		$scope.pcSelectMonth = data
     		// $scope.showMonth = data.name
     		// mobileSelectMonth = data.value
     	}
   //   	if ($scope.pcSelectYear.value != "" && $scope.pcSelectMonth.value != ""){
   //  		var date = $scope.pcSelectYear.value +"-"+ $scope.pcSelectMonth.value
 		// 	// $("body").showLoading(-150);
 		// 	// queryOrderInfo(date)
 		// 	$state.go('index.historyOrder',
 		// 		{
 		// 			page:1,
 		// 			orderParam:{year:$scope.pcSelectYear,month:$scope.pcSelectMonth},
 		// 			orderDate:date
 		// 		})
 		// 	$("body").hideLoading();
	 	// 	//两个都没选择,查询所有订单
			// }else if($scope.pcSelectYear.value == "" && $scope.pcSelectMonth.value == "") {
			// 	$state.go('index.historyOrder',
			// 	{
			// 		page:1,
			// 		orderDate:"",
			// 		orderParam:{}
			// 	})
			// }
			datePickerChange()	
    }
   
    // if (angular.isDefined($stateParams.orderParam.year) && angular.isDefined($stateParams.orderParam.month)){
    // 	// $scope.pcSelectYear = $stateParams.orderParam.year
    // 	$.each($scope.years, function(i,v){
    // 		if (v.value == $stateParams.orderParam.year.value){
    // 			$scope.pcSelectYear = v
    // 		}
    //     });
    //     $.each($scope.months, function(i,v){
    // 		if (v.value == $stateParams.orderParam.month.value){
    // 			$scope.pcSelectMonth = v
    // 		}
    //     });
    // }
    //pc 日期选择change事件
    $scope.pcSelectDate = datePickerChange
    //mobile 下拉刷新
    if($(window).width()<801)
	Hook.init({
		wrapperId:"#wrapper",
		scrollerId:"#scroller",
		wrapperCss:{
			"position": "absolute",
			"z-index": 1,
			"top": "0px",
			// "bottom": "0px",
			"height":$(window).height()+"px",
			"left": "0px",
			"right":"0px",
			overflow: "hidden"
		},
		distance:50,
		callback:function(){
			if($scope.currentPage >= $scope.pageCount){
				showModal({msg:"没有更多历史订单"});
				return
			}
			//下拉刷新
			$("body").showLoading()
			$scope.currentPage = parseInt($scope.currentPage) + 1
			apiCaller.getOrderListByPage(
				{userAccount:'456456',orderDate:$stateParams.orderDate,pageNum:$scope.currentPage},
				function(res){
					$("body").hideLoading()
					if(res.order.length != 0){
						$.each(res.order, function(i,v){
							$scope.orderList.push(v)
					    });
					}
				},
				function(res){
					$("body").hideLoading()
					showModal({msg:"加载失败"});
					$scope.currentPage = parseInt($scope.currentPage) - 1
				}
			)
		}
	});
})

 orderApp.filter('stateFilter',function(){
 	return function (input) {
 		var map = {0:"未确认",1:"已确认",2:"已处理",3:"已打包",4:"作废"} 
           return map[input]
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