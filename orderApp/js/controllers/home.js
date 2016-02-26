orderApp.factory('scopeData',function() {
	return{
		userAccount          :'123123',
		discountType         :'2',
		noticePageRevert     :false,
		categories           :[],
		groupCode            :'',
		isMobile             :0,
		sourcePageId         : 0,          //0:代表productList页,1:代表currentOrder页
		currentProductCode   :'',          //当前大类或小类的code
		currentDivisionName  :'护肤',      //当前大类的名称(用于面包屑)
		currenGroupName      :'',          //当前小类的名称，未显示小类时为空(用于面包屑)
		currentPage          :'1',         //当前页数
		secretaryName        :'',		   //秘书姓名		
		secretaryPhone		 :'',          //秘书电话
		currentOrderPage     : 1,		   //当前订单页数
		isNotAllowOrder      : true,       //当前是否为不可下单日期内
		orderDate            :[],          //可下单日期范围
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
			console.log(sessionStorage.get('discountType'))
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
			return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)?"0":"1";
		}
	}
})

orderApp.factory('apiCaller',function($stateParams,$http,ApiService,ajaxService,scopeData) {
	return{
		getProductListByStates:function(suc,err){
			scopeData.ProductionList = ApiService.getProductList(
			{
				Type:scopeData.discountType+"/Product",
				code:$stateParams.productCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:$stateParams.productClass,//大类为1，小类为2
				pageNum:$stateParams.page,
				userAccount:scopeData.userAccount
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
				Type:scopeData.discountType+"/Product",
				code:$stateParams.productCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:$stateParams.productClass,//大类为1，小类为2
				pageNum:page,
				userAccount:scopeData.userAccount
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
					Type:scopeData.discountType+"/Product",
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
				Type:scopeData.discountType+"/Order"
			},
			{
				userAccount:scopeData.userAccount,
				productCode:Product.productCode,
				count:count
			},
			function(response){
				if (suc) {
					suc();
				}
			},
			function(response){
				if (err) {
					err();
				}
			});
		},
		getOrderCount:function(successFn) {
			return ApiService.getOrderCount({
				Type:scopeData.discountType+"/Order",
				userAccount:scopeData.userAccount
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
				Type:scopeData.discountType+"/Favorite"
			},
			{
				userAccount:scopeData.userAccount,
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
					Type:scopeData.discountType+"/User",
					myBalanceAccount:scopeData.userAccount
				},
				function(response){
					if (callbackFn) {
						callbackFn();
					}
			});
		},
		getSearchTips:function(keyWord,suc,err){
			return ApiService.getSearchTips({
					Type:scopeData.discountType+"/Product",
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
				Type:scopeData.discountType+"/Order",
				userAccount:param.userAccount,
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
				Type:scopeData.discountType+"/Product",
				userAccount:param.userAccount
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
				Type:scopeData.discountType+"/Order",
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
				Type:scopeData.discountType+"/Favorite",
				pageNum:Page,
				userAccount:scopeData.userAccount
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
				Type:scopeData.discountType+"/Product",
				key:searchKey,
				pageNum:Page,
				userAccount:scopeData.userAccount
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
					Type:scopeData.discountType+"/Order",
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
		getUserProfile:function(type,suc,err){
			return ApiService.postUserProfile(
				{
					Type:type+"/User",
					loginMode:scopeData.isMobile
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
					Type:scopeData.discountType+"/User",
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
		}
	}
});

orderApp.factory('userProfile',function($state,apiCaller,scopeData){
	this.getProfile = function(type){
		if (type == null || angular.isUndefined(type)){
			type = 2
		}
		apiCaller.getUserProfile(type,function(response){
			// alert(response.userAccount)
			scopeData.userAccount = response.userAccount
		},function(response){
			// alert(JSON.stringify(response))
			// $state.go('regist',{discountType:type})
		})
	}
	return this
})