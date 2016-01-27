orderApp.value('baseUrl', 'http://182.92.110.219:8090/MLK/')
orderApp.controller('currentOrderCtrl',function($q,$scope,$rootScope,common,currentOrderServ,deleteServ){
	$rootScope.userName = "Tom"
	$rootScope.userPhone = "11012012315"
	$rootScope.resAmount = 0
	$rootScope.payAmount = (common.get('type')==2) ? 5000 : 2000
	$scope.isCanShop = true
	$scope.currentOrderData = {};
	$scope.lastData = 1
	//获取下单日期范围
	currentOrderServ.getDateGate({kind: 'Order'},function(response){
	    var arry = response.orderDate.split("-")
	    $scope.lastData = parseInt(arry[1])
		if(parseInt(arry[1]) > new Date().getDate()){
			//可下单范围
			$scope.isCanShop = true
		}else{
			//不可下单范围
			$scope.isCanShop = true
		}
  	})
  	//初始化余额
  	currentOrderServ.getResAmount({kind: 'User',myBalanceAccount:'123123'},function(response){
  		console.log(response)
  		$rootScope.resAmount = 1111
  		$rootScope.payAmount = (common.get('type')==2) ? (5000-$rootScope.resAmount) : (2000-$rootScope.resAmount)
  	})
  	//获取秘书
	currentOrderServ.getSecretary({kind: 'User',userAccount:'123123'},function(response){
  		console.log(response)
  	})
  	//获取当月订单详细内容
	currentOrderServ.getCurrentOrder({kind:'Order',userAccount:'123123',orderDate:'2016-01'},function(response){
	    $scope.currentOrderData = response[0];
	    console.log($scope.currentOrderData.product[1]);
  	})
	var oldCount;
    $scope.countFocus = function(prodCount){
		oldCount = parseInt(prodCount)
	};
	$scope.countBlur = function(prodCount,index){
		if (prodCount == "" || parseInt(prodCount) <= 0){
			$scope.currentOrderData.product[index].requestQTY = oldCount
			return
		};
		if (parseInt(prodCount) != oldCount){
			currentOrderServ.putProduct(
				{	
					kind: 'Order',
					userAccount:'123123',
					productCode:$scope.currentOrderData.product[index].productCode,
					count:parseInt(prodCount)
				},
				//success
				function(response){
			    	console.log("put count success!");
		  		},
		  		//error
		  		function(response){
		  			console.log("put count error!");
		  			$scope.currentOrderData.product[index].requestQTY = oldCount
		  			if (response.status == 404){
		  				alert("商品未找到！")
		  			}
		  		}
		  	);
		}else{
			return
		};
	};
	$scope.favClick = function(index){
		if ($scope.currentOrderData.product[index].isFavorite == false){
			currentOrderServ.postFav(
			{kind:"Favorite",userAccount:'123123',productCode:$scope.currentOrderData.product[index].productCode}
			 ,function(){

			},function(){

			})
		}else{
			deleteServ("Favorite",{userAccount:123123,productCode:$scope.currentOrderData.product[index].productCode},
			function(response){
			},
			function(response){
			});
		}
		$scope.currentOrderData.product[index].isFavorite = !$scope.currentOrderData.product[index].isFavorite
	}
	$scope.deleteProduct = function(index){
		// var self=$(this);
		function del(scope){
			// this = scope
			console.log(scope)
			// $scope = angular.copy(scope)
			scope.currentOrderData.product.splice(index,1)
		}
		showConfirm({
			msg:"确定删除该产品？",
			confirmed:function(){
				deleteServ("Order",{userAccount:123123,productCode:$scope.currentOrderData.product[index].productCode},
				function(response){
					console.log(response)
					$scope.$apply(function () {
						$scope.currentOrderData.product.splice(index,1)
					});
				},
				function(response){
					console.log(response)
					alert("删除失败！")
				})
				// deleteServ.deleteOneProd(2,"Order",123123,10008679,
				// function(response){
				// 	console.log(response)
				// 	$scope.$apply(function () {
				// 		$scope.currentOrderData.product.splice(index,1)
				// 	});
				// },
				// function(response){
				// 	console.log(response)
				// 	alert("删除失败！")
				// });
			},
			cancel:function(){

			}
		});
		
	}
	$scope.enter = function(ev) { if (ev.keyCode !== 13) return; 
		//input回车事件
	}
	$scope.orderCancel = function(){
		showConfirm({
			msg:"确定取消该订单？",
			confirmed:function(){
				deleteServ("Order",{userAccount:123123},
				function(response){
					console.log(response)
					$scope.$apply(function () {
						$scope.currentOrderData.product = {}
					});
				},
				function(response){
					console.log(response)
					alert("删除失败！")
				})
			},
			cancel:function(){

			}
		});
	}
	$scope.countinueShop = function(){
		
	}
});

orderApp.factory('currentOrderServ',function($resource,common,baseUrl){
	return $resource(
    baseUrl+common.get("type")+'/:kind',
    {},
    {
      //获取当月订单
      getCurrentOrder:{
        method:'GET',
        params:{
          userAccount:'@userAccount',
          orderDate:'@orderDate',
        },
        isArray:true
      },
      //修改当月订单产品数量
      putProduct:{
        method:'PUT',
        params:{
          kind:'@kind',
          userAccount:'@userAccount',
          productCode:'@productCode',
          count:'@count'
        }
      },
      //获取下单日期范围
      getDateGate:{
        method:'GET'
      },
      getResAmount:{
        method:'GET',
        params:{
        	myBalanceAccount:'@myBalanceAccount'
        }
      },
      postFav:{
      	method:'POST',
      	params:{
      	  kind:'@kind',
          userAccount:'@userAccount',
          productCode:'@productCode'
        }
      },
      getSecretary:{
      	method:'GET',
      	params:{
          userAccount:'@userAccount'
        },
        isArray:true
      }
    }
  );
})

orderApp.factory('deleteServ',function(baseUrl,common){
	function del(kind,data,suc,err){	
		return 	$.ajax({
		    type: "delete",
		    url: baseUrl+common.get("type")+"/"+kind,
		    data: data,
		    success:suc,
		    error:err
  		});
	}
	return function(kind,data,suc,err){
		del(kind,data,suc,err)
	}
	// return {
	// 	deleteOneProd : function(type,kind,user,prodCode,suc,err){
	// 	return $.ajax({
	// 		    type: "delete",
	// 		    url: "http://182.92.110.219:8090/MLK/"+type+"/"+kind,
	// 		    data: {
	// 		        userAccount:user,
	// 		        productCode:prodCode
	// 		    },
	// 		    success:suc,
	// 		    error:err
	// 	  	});
	// 	},
	// 	deleteOrder : function(type,kind,user,suc,err){
	// 	return $.ajax({
	// 		    type: "delete",
	// 		    url: "http://182.92.110.219:8090/MLK/"+type+"/"+kind,
	// 		    data: {
	// 		        userAccount:user
	// 		    },
	// 		    success:suc,
	// 		    error:err
	// 	  	});
	// 	},
	// 	deleteFav : function(type,kind,user,prodCode,suc,err){
	// 	return $.ajax({
	// 		    type: "delete",
	// 		    url: "http://182.92.110.219:8090/MLK/"+type+"/"+kind,
	// 		    data: {
	// 		        userAccount:user,
	// 		        productCode:prodCode
	// 		    },
	// 		    success:suc,
	// 		    error:err
	// 	  	});
	// 	}
	// }
})

orderApp.factory('common', function(){
	this.type = 2
	this.set = function (k,v){
		this[k] = v
	}
	this.get = function (k){
		return this[k]
	}
	return this
})
