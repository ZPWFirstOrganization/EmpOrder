orderApp.controller('historyDonationCtrl',function($scope,$state,$stateParams,ApiService,apiCaller,scopeData,scopeMethod){
	scopeMethod.setMinHeight()
	$(window).scrollTop(0);
	$("body").showLoading();
	$scope.isHaveData = true;
	$scope.donationList = [];
	$scope.pages = [];
	$scope.pageCount = 0
	$scope.currentPage = parseInt($stateParams.page);
	scopeData.discountType = $stateParams.discountType;
	$scope.discountType = scopeData.discountType;
	$scope.pcSelectYear = null
    $scope.pcSelectMonth = null
	$scope.years = [{name:"全部",value:""}]
	$scope.months = [{name:"全部",value:""},
					{name:"1月",value:"01"},{name:"2月",value:"02"},
					{name:"3月",value:"03"},{name:"4月",value:"04"},
					{name:"5月",value:"05"},{name:"6月",value:"06"},
					{name:"7月",value:"07"},{name:"8月",value:"08"},
					{name:"9月",value:"09"},{name:"10月",value:"10"},
					{name:"11月",value:"11"},{name:"12月",value:"12"}
					]
	$scope.isShowCertificate = false;
	$scope.isShowCertificateContainer = false;
	if (angular.isUndefined($stateParams.page)){
		$stateParams.page = 1
	}
	$scope.secretary = [];
	$scope.userName = "";
	var startYear = 2008
	var currentYear = (new Date()).getFullYear()
	//获取订单信息
	function queryOrderInfo(orderDate){
		apiCaller.getDonationListByPage({userID:scopeData.userID,donationDate:orderDate,pageNum:$scope.currentPage},function(res){
			$scope.userName = res.userName;
			$scope.pageCount = res.pageCount;
			$scope.pages = []
			$scope.donationList = []
			if (res.firstOrderDate) {
				startYear = parseInt(res.firstOrderDate.split("-")[0])
			}
			currentYear = parseInt(res.currentYear)
			if(!res.donation){
				$scope.isHaveData = false;
			}else{
				$scope.isHaveData = true;
				for (var i = 0; i < res.pageCount; i++) {
					$scope.pages.push(i+1)
				};
				$scope.donationList = res.donation;
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
				$state.go('index.historyDonation',{page:$scope.currentPage});
			}else{
				return;
			}
		}
		//上一页
		else if('previous' == page){
			if($scope.currentPage > 1){
				$scope.currentPage = parseInt($stateParams.page) - 1
				$state.go('index.historyDonation',{page:$scope.currentPage});
			}else{
				return;
			}
		}
		//首页
		else if('first' == page){
			if($scope.currentPage != 1){
				$scope.currentPage = 1
				$state.go('index.historyDonation',{page:1});
			}else{
				return;
			}
		}
		//尾页
		else if('last' == page){
			if($scope.currentPage != $scope.pages.length){
				$scope.currentPage = $scope.pages.length
				$state.go('index.historyDonation',{page:$scope.pages.length});
			}else{
				return;
			}
		}
		//点击页码
		else{
			$state.go('index.historyDonation',{page:page});
		}
	}

	//获取秘书
  	apiCaller.getSecretary({userID:scopeData.userID},function(response){
  		$scope.secretary = response
  	},function(response){

  	})
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
        	yearHolder = "全部"
        }
        if (monthHolder==""){
        	$scope.pcSelectMonth=$scope.months[0];
        	monthHolder = "全部"
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
            	$("#yearArrow").removeClass("select-arrow-up")
                $("#yearList").slideUp(300);
                hideModalBg();
            }
            if($("#monthList").css("display")=="block"){
            	$("#monthArrow").removeClass("select-arrow-up")
                $("#monthList").slideUp(300);
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
    		var date = ""
    		if ($scope.pcSelectYear.value != "" && $scope.pcSelectMonth.value != ""){
	    		date = $scope.pcSelectYear.value +"-"+ $scope.pcSelectMonth.value
	 		//两个都没选择,查询所有订单
 			}else if($scope.pcSelectYear.value == "" && $scope.pcSelectMonth.value == "") {
 			//查询指定年份所有订单
 			}else if($scope.pcSelectYear.value != "" && $scope.pcSelectMonth.value == ""){
 				date = $scope.pcSelectYear.value +"-"
 			//查询指定年份所有订单
 			}else if($scope.pcSelectYear.value == "" && $scope.pcSelectMonth.value != ""){
 				date = "-"+$scope.pcSelectMonth.value
 			}
 			$state.go('index.historyDonation',
			{
				page:1,
				orderDate:date,
				orderParam:{}
			})
			$("body").hideLoading();
    	}
    }
    //mobile 日期选择
    $scope.selectItem = function(flag,data){
     	if(flag=="year"){
     		$("#yearArrow").removeClass("select-arrow-up")
     		$scope.pcSelectYear = data
     	}else{
     		$("#monthArrow").removeClass("select-arrow-up")
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
				Hook.loadDown()
				showModal({msg:"没有更多捐款！"});
				return
			}
			//下拉刷新
			$("body").showLoading()
			apiCaller.getDonationListByPage(
				{userID:scopeData.userID,donationDate:$stateParams.orderDate,pageNum:++$scope.currentPage},
				function(res){
					Hook.loadDown()
					$("body").hideLoading()
					if(res.donation){
						$.each(res.donation, function(i,v){
							$scope.donationList.push(v)
					 	});
					}else{
						showModal({msg:"没有更多捐款！"});
						--$scope.currentPage
					}
				},
				function(res){
					Hook.loadDown()
					$("body").hideLoading()
					showModal({msg:"没有更多捐款！"});
					--$scope.currentPage
				}
			)
		}
	});
	// var isLoading = true;
	// 消失动画结束之前不会再出现。
	$scope.isCanShow = true;
	$scope.isCanHide = false;
	$scope.donationShowName = "";
	$scope.showCertificate = function(donation){
		function show(){
			// isLoading = true;
			$scope.isShowCertificate = true;
			setTimeout(function(){
				$scope.isShowCertificateContainer = true;
			},0);
		}
		if (donation.isEnable && $scope.isCanShow){
			show();
			$scope.isCanShow = false;
			$scope.isCanHide = true;
			// isLoading = true;
			var img = new Image();
			img.src = donation.certificatePath;
			if(img.complete){
				$(".certificate-container").css("background-image","url("+donation.certificatePath+")");
				$scope.donationShowName = $scope.userName;
			  return;
			}else{
				setTimeout(function(){$("body").showLoading()},0)
			}
		  img.onload = function () {
		  	$("body").hideLoading();
		  	$(".certificate-container").css("background-image","url("+donation.certificatePath+")");
		  	$scope.donationShowName = $scope.userName;
			};
			img.onerror = function(){
				// isLoading = false;
				$("body").hideLoading();
				alert("未获取到证书");
			}
		}
	}
	$scope.hideCertificate = function(){

		if ($scope.isCanHide){
			$scope.isCanHide = false;
			$scope.donationShowName = "";
			$(".certificate-container").css("background-image","");
			$("body").hideLoading();
			$scope.isShowCertificateContainer = false;
			setTimeout(function(){
				$scope.isCanShow = true;
				$scope.isShowCertificate && ($scope.isShowCertificate = false);
			},400);
		}
	}
	var pressType = scopeData.isMobile!=0 ? "touchend" : "click";
	$(".certificate-container").on(pressType,function(){
		$scope.hideCertificate();
	})
})

 orderApp.filter('stateFilter',function(){
 	return function (input) {
 		var map = {0:"未确认",1:"已确认",2:"已处理",3:"已打包",4:"作废"}
           return map[input]
        }
 })
