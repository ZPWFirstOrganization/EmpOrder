orderApp.factory('ajaxService',function(baseUrl,scopeData){
	return{
		deleteFav:function(Product,suc,err){
			return 	$.ajax({
			    type: "delete",
			    url: baseUrl + scopeData.discountType +'/Favorite',
			    data: {
			    	userID:'123123',
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
					userID:'@userID'
				},
				isArray:false
			},
			getSecretary:{
				// url:baseUrl+scopeData.discountType+'/User',
				method:'GET',
				params:{
					userID:'@userID'
				},
				isArray:true
			},
			getFavoriteList:{
				// url:baseUrl+scopeData.discountType+'/Favorite',
				method:'GET',
				params:{
					userID:'@userID',
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
					userID:'@userID'
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
					userID:'@userID',
					productCode:'@productCode',
					count:'@count'
				}
			},
			postFav:{
				// url:baseUrl+scopeData.discountType+'/Favorite',
		      	method:'POST',
		      	data:{
		          userID:'@userID',
		          productCode:'@productCode'
		        }
		    },
		    getOrderList:{
				// url:baseUrl+scopeData.discountType+'/Order',
		      	method:'GET',
		      	params:{
		          userID:'@userID',
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
		          userID:'@userID'
		        },
		        isArray:false
		    },
		    postUserProfile:{
		    	method:'POST',
		    	params:{
		    		loginMode:'@loginMode'
		    	}
		    },
		    postRegist:{
		    	method:'POST',
		    	params:{
		    	}
		    }
		}
	);
});