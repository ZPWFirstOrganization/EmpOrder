﻿orderApp.factory('scopeData',function() {
	return{
		userID         		 	 :'',
		roleID               :'1',
		discountType         :'2',
		noticePageRevert     :false,
		categories           :[],
		groupCode            :'',
		isMobile             :0,
		sourcePageId         : 0,          //0:代表productList页,1:代表currentOrder页
		secretaryName        :'',		   //秘书姓名
		secretaryPhone		 	 :'',          //秘书电话
		currentOrderPage     : 1,		   //当前订单页数
		isNotAllowOrder      : true,       //当前是否为不可下单日期内
		orderDate            :[],          //可下单日期范围
		isHomePage			 		 : true,	   //当前是否处于首页且为最初状态
		isLogin				 			 : false,      //是否登录
		timeoutMsg			 		 : "网络不佳",
		ad                   : "",		   //存储安卓账号
	}
});

orderApp.service('scopeMethod',function($state,$stateParams,scopeData,apiCaller,sessionStorage) {
	return{
		changeState:function(ProductClass,ProductCode,Page) {
			if(!$stateParams.discountType || $stateParams.discountType==""){
				$stateParams.discountType = "2";
				scopeData.discountType = $stateParams.discountType;
			}
			$state.go('index.productList',{discountType:scopeData.discountType,productClass:ProductClass,productCode:ProductCode,page:Page});
		},
		isEmptyObject:function(obj){
		    for ( var name in obj ) {
		        return false;
		    }
		    return true;
		},
		setSessiondiscountType:function(discountType){
			if (parseInt(discountType) != 2 && parseInt(discountType) != 6){
				discountType = 2
			}
			sessionStorage.put('discountType',discountType)
		},
		isMobile:function(){
			var sUserAgent= navigator.userAgent.toLowerCase(),
			bIsIpad= sUserAgent.match(/ipad/i) == "ipad",
			bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os",
			bIsMidp= sUserAgent.match(/midp/i) == "midp",
			bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
			bIsUc= sUserAgent.match(/ucweb/i) == "ucweb",
			bIsAndroid= sUserAgent.match(/android/i) == "android",
			bIsCE= sUserAgent.match(/windows ce/i) == "windows ce",
			bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile",
			bIsWebview = sUserAgent.match(/webview/i) == "webview";
			return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)?"1":"0";
		},
		isAndOrIosMobile:function(){
			var sUserAgent= navigator.userAgent.toLowerCase()
			var bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os",
			bIsAndroid= sUserAgent.match(/android/i) == "android"
			return (bIsAndroid || bIsIphoneOs);
		},
		getGate:function(callback){
			apiCaller.getOrderDate(function(res){
		    	scopeData.isNotAllowOrder = !(res.allowOrder);
		    	scopeData.orderDate = res.orderDate.split('-');
		    	return callback()
    		},function(res){

    		})
		},
		setMinHeight:function(){
			if(scopeData.isMobile == 0){
				//设置left height
				$(".left").css({"min-height":$(window).height()-200})
				//设置当月订单内容 height
				if(!scopeData.isNotAllowOrder){
					$(".order-mid-wrapper").css({"min-height":$(window).height()-210-180})
				}else{
					$(".order-mid-wrapper").css({"min-height":$(window).height()-210-120})
					$(".order-action-wrapper").css({"padding":0})
				}
				//设置历史订单内容 height
				$(".mid-wrapper").css({"min-height":$(window).height()-210-100})
			}
		},
		isPositiveInt:function(input){
			var s= String(input);
            var type = /^[0-9]*[1-9][0-9]*$/;
            var re = new RegExp(type);
            if (s.match(re) == null) {
                return false;
            }else{
            	return true;
            }
		}
	}
})

orderApp.factory('apiCaller',function($stateParams,$http,ApiService,AuthApiService,ajaxService,scopeData) {
	return{
		getProductListByStates:function(suc,err){
			scopeData.ProductionList = ApiService.getProductList(
			{
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Product",
				code:$stateParams.productCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:$stateParams.productClass,//大类为1，小类为2
				pageNum:$stateParams.page,
				userID:scopeData.userID
			},
			function(res){
				if (suc) {
					suc(res);
				}
			},
			function(res){
				if(err){
					err(res);
				}
			})
		},
		getProductListByPage:function(page,suc,err){
			ApiService.getProductList(
			{
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Product",
				code:$stateParams.productCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:$stateParams.productClass,//大类为1，小类为2
				pageNum:page,
				userID:scopeData.userID
			},
			function(res){
				if (suc) {
					suc(res);
				}
			},
			function(res){
				if(err){
					err(res);
				}
			});
		},
		getCategories:function(suc,err){
			return ApiService.getCategories(
				{
					Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Product",
				},
				function(res){
					if (suc) {
						suc(res);
					}
				},
				function(res){
					if (err) {
						err(res);
					}
				});
		},
		postOrderedProduct:function(Product,count,suc,err) {
			return ApiService.postOrderedProduct(
			{
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Order"
			},
			{
				userID:scopeData.userID,
				productCode:Product.productCode,
				count:count
			},
			function(response){
				if (suc) {
					suc(response);
				}
			},
			function(response){
				if (err) {
					err(response);
				}
			});
		},
		getOrderCount:function(successFn) {
			return ApiService.getOrderCount({
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Order",
				userID:scopeData.userID
			},
			function (response) {
				if (successFn) {
					successFn();
				}
			}
			);
		},
		postFav:function(Product,suc,err) {
			return ApiService.postFav(
			{
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Favorite"
			},
			{
				userID:scopeData.userID,
				productCode:Product.productCode
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			});
		},
		deleteFav:function(Product,suc,err) {
			ajaxService.deleteFav(Product,suc,err)
		},
		getBalance:function(callbackFn) {
			return ApiService.getBalance(
				{
					Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/User",
					myBalanceUserID:scopeData.userID
				},
				function(response){
					if (callbackFn) {
						callbackFn();
					}
			});
		},
		getSearchTips:function(keyWord,suc,err){
			return ApiService.getSearchTips({
					Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Product",
					key:keyWord
				},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			}
				)
		},
		getOrderListByPage:function(param,suc,err){
			return ApiService.getOrderList({
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Order",
				userID:param.userID,
				orderDate:param.orderDate,
				pageNum:param.pageNum
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		},
		getSecretary:function(param,suc,err){
			return ApiService.getSecretary({
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/User",
				userID:param.userID
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		},
		getOrderDetailInfo:function(param,suc,err){
			return ApiService.getOrderData({
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Order",
				orderID:param.orderID
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		},
		getFavoriteList:function(Page,suc,err) {
			return ApiService.getFavoriteList({
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Favorite",
				pageNum:Page,
				userID:scopeData.userID
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		},
		getSearchResult:function(searchKey,Page,suc,err) {
			return ApiService.getSearchResult({
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Product",
				key:searchKey,
				pageNum:Page,
				userID:scopeData.userID
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		},
		getOrderDate:function(suc,err){
			return ApiService.getOrderDate(
				{
					Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Order",
				},
				function(res){
					if(suc){
						return suc(res)
					}
				},
				function(res){
					if(err){
						return err(res)
					}
				}
			)
		},
		getDomainAccount:function(suc,err){
			return AuthApiService.getDomainAccount(
				{
					Type:"user",
				},
				{

				},
				function(res){
					if(suc){
						return suc(res)
					}
				},
				function(res){
					if(err){
						return err(res)
					}
				}
			)
		},
		getUserProfile:function(suc,err){
			return ApiService.postUserProfile(
				{
					Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/User",
					ad:scopeData.ad,
				},
				{

				},
				function(res){
					if(suc){
						return suc(res)
					}
				},
				function(res){
					if(err){
						return err(res)
					}
				}
			)
		},
		regist:function(suc,err){
			return ApiService.postRegist(
				{
					Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/User",
					ad:scopeData.ad,
				},
				{

				},
				function(res){
					if(suc){
						return suc(res)
					}
				},
				function(res){
					if(err){
						return err(res)
					}
				}
			)
		},
		getChartData:function(suc,err){
			return ApiService.getChartData(
			{
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Order",
				reportuserid:scopeData.userID
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		},
		postDonation:function(amount,suc,err){
			return ApiService.postDonation(
			{
				Type:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/Donation",
			},
			{
				userID:scopeData.userID,
				amount:amount,
			},
			function(res){
				if(suc){
					return suc(res)
				}
			},
			function(res){
				if(err){
					return err(res)
				}
			})
		}
	}
});
