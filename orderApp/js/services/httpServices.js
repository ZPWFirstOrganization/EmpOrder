orderApp.factory('ajaxService',function(baseUrl){
	return{
		deleteFav:function(Product,suc,err){
			return 	$.ajax({
			    type: "delete",
			    url: baseUrl + '2/Favorite',
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

orderApp.factory('ApiService',function($resource,baseUrl){
	return $resource(
		baseUrl,
		{},
		{
			getCategories:{
				url:baseUrl+'2/Product',
				method:'GET',
				isArray:true
			},
			getProductList:{
				url:baseUrl+'2/Product',
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
				url:baseUrl+'2/User',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				}
			},
			getFavoriteList:{
				url:baseUrl+'2/Favorite',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				}
			},
			getBalance:{
				url:baseUrl+'2/User',
				method:'GET',
				params:{
					myBalanceAccount:'@myBalanceAccount'
				}
			},
			getOrderCount:{
				url:baseUrl+'2/Order',
				method:'GET',
				params:{
					userAccount:'@userAccount'
				}
			},
			getOrderDate:{
				url:baseUrl+'2/Order',
				method:'GET',
				isArray:true
			},
			postOrderedProduct:{
				url:baseUrl+'2/Order',
				method:'POST',
				data:{
					userAccount:'@userAccount',
					productCode:'@productCode',
					count:'@count'
				}
			},
			postFav:{
				url:baseUrl+'2/Favorite',
		      	method:'POST',
		      	data:{
		          userAccount:'@userAccount',
		          productCode:'@productCode'
		        }
		    }
		}
	);
});