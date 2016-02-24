orderApp.factory('scopeData',function() {
	return{
		noticePageRevert     :false,
		categories           :[],
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

orderApp.service('scopeMethod',function($state,scopeData,apiCaller,sessionStorage) {
	return{
		changeState:function(ProductClass,ProductCode,Page) {
			$state.go('index.productList',{productClass:ProductClass,productCode:ProductCode,page:Page});
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
		}
	}
})

orderApp.factory('apiCaller',function($stateParams,$http,ApiService,ajaxService,scopeData) {
	return{
		getProductListByStates:function(suc,err){
			scopeData.ProductionList = ApiService.getProductList(
			{
				code:$stateParams.productCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:$stateParams.productClass,//大类为1，小类为2
				pageNum:$stateParams.page,
				userAccount:'123123'
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
				code:$stateParams.productCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:$stateParams.productClass,//大类为1，小类为2
				pageNum:page,
				userAccount:'123123'
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
			return ApiService.postOrderedProduct({
				userAccount:'123123',
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
				userAccount:'123123'
			},
			function (response) {
				if (successFn) {
					successFn();
				}
			}
			);
		},
		postFav:function(Product,callbackFn) {
			return ApiService.postFav({
				userAccount:'123123',
				productCode:Product.productCode
			},
			function(response){
				if (callbackFn) {
					callbackFn();
				}
			});
		},
		deleteFav:function(Product,suc,err) {
			ajaxService.deleteFav(Product,suc,err)
		},
		getBalance:function(callbackFn) {
			return ApiService.getBalance(
				{
					myBalanceAccount:'123123'
				},
				function(response){
					if (callbackFn) {
						callbackFn();
					}
			});
		},
		getSearchTips:function(keyWord,suc,err){
			return ApiService.getSearchTips({key:keyWord},
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
				pageNum:Page,
				userAccount:'123123'
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
				key:searchKey,
				pageNum:Page,
				userAccount:'123123'
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