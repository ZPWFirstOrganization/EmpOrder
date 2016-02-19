orderApp.factory('scopeData',function() {
	return{
		noticePageRevert     :false,
		ProductionList       :{},
		currentProductClass  :'1',         //当前产品列表显示的是大类为1，小类为2
		homeDivisionName     :'',
		homeDivisionCode     :'',
		divisionCode         :'',
		groupCode            :'',
		sourcePageId         : 0,          //0:代表productList页,1:代表currentOrder页
		currentProductCode   :'',          //当前大类或小类的code
		currentDivisionName  :'护肤',      //当前大类的名称(用于面包屑)
		currenGroupName      :'',          //当前小类的名称，未显示小类时为空(用于面包屑)
		currentPage          :'1',         //当前页数
		secretaryName        :'',		   //秘书姓名		
		secretaryPhone		 :'',          //秘书电话
		currentOrderPage     : 1,		   //当前订单页数
	}
});

orderApp.service('scopeMethod',function($state,scopeData,apiCaller) {
	return{
		changeState:function(ProductClass,ProductCode,Page,suc,err) {
			scopeData.currentProductClass = ProductClass;
			scopeData.currentProductCode = ProductCode;
			scopeData.currentPage = Page;
			$state.go('index.productList',{productClass:scopeData.currentProductClass,productCode:scopeData.currentProductCode,page:scopeData.currentPage});
			apiCaller.getProductListByStates(suc,err);
		},
		getSearchTips:function(){

		},
		getSearchResult:function(){

		},
		isEmptyObject:function(obj){
		    for ( var name in obj ) {
		        return false;
		    }
		    return true;
		}
	}
})

orderApp.factory('apiCaller',function($stateParams,$http,ApiService,ajaxService,scopeData) {
	return{
		getProductListByStates:function(suc,err){
			scopeData.ProductionList = ApiService.getProductList(
			{
				code:scopeData.currentProductCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:scopeData.currentProductClass,//大类为1，小类为2
				pageNum:scopeData.currentPage,
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
				code:scopeData.currentProductCode,//大类传大类的id,小类传小类的CONFIG_VALUE
				productClass:scopeData.currentProductClass,//大类为1，小类为2
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
		}
	}
});