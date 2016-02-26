orderApp.value('baseUrl', 'http://182.92.110.219:8090/MLK/')
//  http://wzdcbdeo01:8090/mlk/
orderApp.controller('currentOrderCtrl',function($q,$scope,$state,$stateParams,$scope,common,scopeData,scopeMethod,currentOrderServ,deleteServ,apiCaller,scopeData,sessionStorage){
	$('html,body').animate({scrollTop: '0px'},0)
	$scope.secretary = {userName:"",userPhone:""}
	$scope.count = 0
	$scope.resAmount = 0
	$scope.payAmount = (common.get('type')==2) ? 5000 : 2000
	$scope.isCanShop = false
	$scope.currentOrderData = {};
	$scope.lastData = 1
	$scope.isHaveData = true
	scopeData.discountType = $stateParams.discountType;
	$scope.discountType = scopeData.discountType;
	sessionStorage.put("sourcePageId","1")
    // scopeData.sourcePageId = 1;
    $scope.isShowFoot = function(){
    	if ($scope.isHaveData && $scope.isCanShop){
    		return true
    	}else{
    		return false
    	}
    }
	//获取下单日期范围
	$("body").showLoading();
	currentOrderServ.getDateGate({kind: 'Order'},function(response){
	    var arry = response.orderDate.split("-")
	    $scope.isCanShop = response.allowOrder
	    $scope.isCanShop = true
	    $scope.lastData = parseInt(arry[1])
  	})
  	//初始化余额
  	currentOrderServ.getResAmount({kind: 'User',myBalanceAccount:'123123'},function(response){
  		$scope.resAmount = parseFloat(response.myBalance).toFixed(2)
  		$scope.payAmount = (common.get('type')==2) ? (5000-$scope.resAmount).toFixed(2) : (2000-$scope.resAmount).toFixed(2)
  	})
  	//初始化商品数量
  	currentOrderServ.getCount({kind: 'Order'},function(response){
  		$scope.count = response.productCount
  	})
  	//获取秘书
  	if (scopeData.secretaryName == '' || scopeData.secretaryPhone == ''){
		apiCaller.getSecretary({},function(response){
			scopeData.secretaryName = response[0].userName
	  		$scope.secretary.userName = scopeData.secretaryName
	  		scopeData.secretaryPhone = response[0].userPhone
	  		$scope.secretary.userPhone = scopeData.secretaryPhone
	  	})
	}else{
		$scope.secretary.userName = scopeData.secretaryName
		$scope.secretary.userPhone = scopeData.secretaryPhone
	}
  	//获取当月订单详细内容
	currentOrderServ.getCurrentOrder({kind:'Order',orderDate:''},function(response){
	    
	    $scope.currentOrderData = response[0];
	    //无商品
	    if (angular.isUndefined($scope.currentOrderData)){
	    	$scope.currentOrderData = {product:[]}
	    }
	    if ($scope.currentOrderData.product.length == 0 ){
	    	$scope.isHaveData = false
		}
	    $("body").hideLoading();
  	},function(response){
  		$("body").hideLoading();
  	})
	var oldCount;
    $scope.countFocus = function(prodCount,id){
		oldCount = parseInt(prodCount)
		$("#"+id).select();
	};
	$scope.countBlur = function(prodCount,index){
		prodCount = String(prodCount)
		prodCount = prodCount.replace(/\D/g,'')
		if (prodCount == "" || parseInt(prodCount) <= 0 ){
			$scope.currentOrderData.product[index].requestQTY = oldCount
			return
		};
		if (parseInt(prodCount) != oldCount){
			$("body").showLoading();
			

			currentOrderServ.putProduct(
				{	
					kind: 'Order',
					productCode:$scope.currentOrderData.product[index].productCode,
					count:parseInt(prodCount)
				},
				//success
				function(response){
			    	$scope.resAmount = response.myBalance.toFixed(2)
  					$scope.payAmount = (common.get('type')==2) ? (5000-$scope.resAmount).toFixed(2) : (2000-$scope.resAmount).toFixed(2)
  					$scope.count = response.productCount
  					$("body").hideLoading();
		  		},
		  		//error
		  		function(response){
		  			$scope.currentOrderData.product[index].requestQTY = oldCount
		  			if (response.status == 404){
		  				showModal({msg:"商品未找到"});
		  			}else if(response.status == 400){
		  				showModal({msg:"剩余额度不足"});
		  			}
		  			$("body").hideLoading();
		  		}
		  	);
		}else{
			return
		};
	};
	$scope.favClick = function(index){
		if ($scope.currentOrderData.product[index].isFavorite == false){
			currentOrderServ.postFav(
			{kind:"Favorite",productCode:$scope.currentOrderData.product[index].productCode}
			 ,function(){

			},function(){

			})
			showModal({msg:"添加到我的收藏"});
		}else{
			deleteServ("Favorite",{userAccount:scopeData.userAccount,productCode:$scope.currentOrderData.product[index].productCode},
			function(response){
			},
			function(response){
			});
			showModal({msg:"已取消收藏"});
		}
		$scope.currentOrderData.product[index].isFavorite = !$scope.currentOrderData.product[index].isFavorite
	}
	$scope.deleteProduct = function(index){
		showConfirm({
			msg:"确定删除该产品？",
			confirmed:function(){
				$("body").showLoading();
				deleteServ("Order",{userAccount:scopeData.userAccount,productCode:$scope.currentOrderData.product[index].productCode},
				function(response){
					$scope.$apply(function () {
						$scope.resAmount = response.myBalance.toFixed(2)
  						$scope.payAmount = (common.get('type')==2) ? (5000-$scope.resAmount).toFixed(2) : (2000-$scope.resAmount).toFixed(2)
  						$scope.count = response.productCount
						$scope.currentOrderData.product.splice(index,1)
						if($scope.currentOrderData.product.length == 0){
							$scope.isHaveData = false
						}
					});
					$("body").hideLoading();
				},
				function(response){
					// showModal({msg:"删除失败！"});
					$("body").hideLoading();
				})
			},
			cancel:function(){

			}
		});
		
	}
	$scope.enter = function(ev) {
		if (ev.keyCode !== 13) return; 
		//input回车事件
	}
	$scope.orderCancel = function(){
		showConfirm({
			msg:"确定取消该订单？",
			confirmed:function(){
				$("body").showLoading();
				deleteServ("Order",{userAccount:scopeData.userAccount},
				function(response){
					$scope.$apply(function () {
						$scope.resAmount = response.myBalance.toFixed(2)
  						$scope.payAmount = (common.get('type')==2) ? (5000-$scope.resAmount).toFixed(2) : (2000-$scope.resAmount).toFixed(2)
  						$scope.count = response.productCount
						$scope.currentOrderData.product = {}
						$scope.isHaveData = false
					});
					$("body").hideLoading();
				},
				function(response){
					// showModal({msg:"删除失败！"});
					$("body").hideLoading();
				})
			},
			cancel:function(){

			}
		});

	}

	$scope.nav1Clicked = function () {
		scopeMethod.changeState('1','1','1');
	}

});

orderApp.factory('currentOrderServ',function($resource,common,baseUrl,scopeData){
	return $resource(
    baseUrl+scopeData.discountType+'/:kind',
    {},
    {
      //获取当月订单
      getCurrentOrder:{
        method:'GET',
        params:{
          userAccount:scopeData.userAccount,
          orderDate:'@orderDate',
        },
        isArray:true
      },
      //修改当月订单产品数量
      putProduct:{
        method:'PUT',
        params:{
          kind:'@kind',
          userAccount:scopeData.userAccount,
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
          userAccount:scopeData.userAccount,
          productCode:'@productCode'
        }
      },
      getSecretary:{
      	method:'GET',
      	params:{
          userAccount:scopeData.userAccount
        },
        isArray:true
      },
      getCount:{
      	method:'GET',
      	params:{
          userAccount:scopeData.userAccount
        }
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
	//初始化type
	this.type = 2
	this.set = function (k,v){
		this[k] = v
	}
	this.get = function (k){
		return this[k]
	}
	return this
})

orderApp.factory('utils',function(){
	return this
})

