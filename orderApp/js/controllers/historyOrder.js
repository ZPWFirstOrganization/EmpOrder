orderApp.controller('historyOrderCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData){
	$('html,body').animate({scrollTop: '0px'},0)
	$("body").showLoading();
	$scope.isHaveData = true;
	$scope.orderList = [];
	$scope.pages = [];
	$scope.currentPage = parseInt($stateParams.page);
	scopeData.discountType = $stateParams.discountType;
	$scope.discountType = scopeData.discountType;
	$scope.pcSelectYear = null
    $scope.pcSelectMonth = null
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
	$scope.secretary = {userName:"",userPhone:""}
	var startYear = 2008
	var currentYear = (new Date()).getFullYear()
	//获取订单信息
	function queryOrderInfo(orderDate){
		apiCaller.getOrderListByPage({userID:scopeData.userID,orderDate:orderDate,pageNum:$scope.currentPage},function(res){
			// console.log(res)
			$scope.pages = []
			$scope.orderList = []
			// console.log("--------------------",res)
			if (res.firstOrderDate) {
				startYear = parseInt(res.firstOrderDate.split("-")[0])
			}
			currentYear = parseInt(res.currentYear)
			if(!res.order){
				$scope.isHaveData = false;
			}else{
				$scope.isHaveData = true;
				for (var i = 0; i < res.pageCount; i++) {
					$scope.pages.push(i+1)
				};
				$scope.orderList = res.order;
			}
			$("body").hideLoading();
			initLizeSelecter()
		},function(res){
			$scope.isHaveData = false;
			$("body").hideLoading();
			initLizeSelecter()
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
				$state.go('index.historyOrder',{page:$scope.currentPage});
			}else{
				return;
			}
		}
		//上一页
		else if('previous' == page){
			if($scope.currentPage > 1){
				$scope.currentPage = parseInt($stateParams.page) - 1
				$state.go('index.historyOrder',{page:$scope.currentPage});
			}else{
				return;
			}
		}
		//首页
		else if('first' == page){
			if($scope.currentPage != 1){
				$scope.currentPage = 1
				$state.go('index.historyOrder',{page:1});
			}else{
				return;
			}
		}
		//尾页
		else if('last' == page){
			if($scope.currentPage != $scope.pages.length){
				$scope.currentPage = $scope.pages.length
				$state.go('index.historyOrder',{page:$scope.pages.length});
			}else{
				return;
			}
		}
		//点击页码
		else{
			$state.go('index.historyOrder',{page:page});
		}
	}
	
	//获取秘书
  	if (scopeData.secretaryName == '' || scopeData.secretaryPhone == ''){
		apiCaller.getSecretary({userID:scopeData.userID},function(response){
			if (response[0]){
				
				scopeData.secretaryName = response[0].userName
		  		$scope.secretary.userName = scopeData.secretaryName
		  		scopeData.secretaryPhone = response[0].userPhone
		  		$scope.secretary.userPhone = scopeData.secretaryPhone
	  		}
	  		
	  	},function(response){
	  		// initLizeSelecter()
	  	})
	}else{
		$scope.secretary.userName = scopeData.secretaryName
		$scope.secretary.userPhone = scopeData.secretaryPhone
		// initLizeSelecter()
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
  		if (angular.isUndefined($stateParams.orderDate)){
  			$stateParams.orderDate = ""
  		}
		var dateArray = $stateParams.orderDate.split("-")
		var yearHolder = "" 
		var monthHolder = "" 
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
    }
    function datePickerChange(){
    	if($scope.pcSelectYear != null && $scope.pcSelectMonth != null){
    		if ($scope.pcSelectYear.value != "" && $scope.pcSelectMonth.value != ""){
	    		var date = $scope.pcSelectYear.value +"-"+ $scope.pcSelectMonth.value
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
     	}else{
     		$scope.pcSelectMonth = data
     	}
		datePickerChange()	
    }
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
		distance:70,
		callback:function(){
			if($scope.currentPage >= $scope.pageCount){
				showModal({msg:"没有更多订单！"});
				return
			}
			//下拉刷新
			$("body").showLoading()
			apiCaller.getOrderListByPage(
				{userID:scopeData.userID,orderDate:$stateParams.orderDate,pageNum:++$scope.currentPage},
				function(res){
					Hook.loadDown()
					$("body").hideLoading()
					if(res.order){
						$scope.orderList.concat(res.order)
						// $.each(res.order, function(i,v){
						// 	$scope.orderList.push(v)
					 	// });
					}else{
						showModal({msg:"没有更多订单！"});
						--$scope.currentPage
					}
				},
				function(res){
					Hook.loadDown()
					$("body").hideLoading()
					showModal({msg:"没有更多订单！"});
					--$scope.currentPage
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