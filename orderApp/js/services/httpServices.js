orderApp.factory('ajaxService',function(baseUrl,scopeData){
	return{
		deleteFav:function(Product,suc,err){
			return 	$.ajax({
			    type: "delete",
			    url: baseUrl + scopeData.discountType +'/Favorite',
			    data: {
			    	userAccount:'123123',
					productCode:Product.productCode
			    },
			    success:suc,
			    error:err
	  		});
		}
	}
});

orderApp.factory('ApiService',function($resource,baseUrl,scopeData){
	
	return $resource(
		baseUrl+":Type",
		{},
		{
			getCategories:{
				// url:baseUrl+scopeData.discountType+'/Product',
				method:'GET',
				isArray:true
			},
			getProductList:{
				// url:baseUrl+scopeData.discountType+'/Product',
				method:'GET',
				params:{
					code:'@code',//大类传大类的id,小类传小类的CONFIG_VALUE
					productClass:'@productClass',//大类为1，小类为2
					pageNum:'@pageNum',
					userAccount:'@userAccount'
				},
				isArray:false
			},
			getSecretary:{
				// url:baseUrl+scopeData.discountType+'/User',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				},
				isArray:true
			},
			getFavoriteList:{
				// url:baseUrl+scopeData.discountType+'/Favorite',
				method:'GET',
				params:{
					userAccount:'@userAccount',
					pageNum:'@pageNum'
				}
			},
			getBalance:{
				// url:baseUrl+scopeData.discountType+'/User',
				method:'GET',
				params:{
					myBalanceAccount:'@myBalanceAccount'
				}
			},
			getOrderCount:{
				// url:baseUrl+scopeData.discountType+'/Order',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				}
			},
			getOrderDate:{
				// url:baseUrl+scopeData.discountType+'/Order',
				method:'GET',
				isArray:false
			},
			postOrderedProduct:{
				// url:baseUrl+scopeData.discountType+'/Order',
				method:'POST',
				data:{
					userAccount:'@userAccount',
					productCode:'@productCode',
					count:'@count'
				}
			},
			postFav:{
				// url:baseUrl+scopeData.discountType+'/Favorite',
		      	method:'POST',
		      	data:{
		          userAccount:'@userAccount',
		          productCode:'@productCode'
		        }
		    },
		    getOrderList:{
				// url:baseUrl+scopeData.discountType+'/Order',
		      	method:'GET',
		      	params:{
		          userAccount:'@userAccount',
		          orderDate:'@orderDate',
		          pageNum:'@pageNum'
		        }
		    },
		    getOrderData:{
				// url:baseUrl+scopeData.discountType+'/Order',
		      	method:'GET',
		      	params:{
		          orderID:'@orderID',
		        },
		        isArray:true
		    },
		    getSearchTips:{
		    	// url:baseUrl+scopeData.discountType+'/Product',
		    	method:'GET',
		    	params:{
		          key:'@key'
		        },
		        isArray:true
		    },
		    getSearchResult:{
		    	// url:baseUrl+scopeData.discountType+'/Product',
		    	method:'GET',
		    	params:{
		          key:'@key',
		          pageNum:'@pageNum',
		          userAccount:'@userAccount'
		        },
		        isArray:false
		    }
		}
	);
});