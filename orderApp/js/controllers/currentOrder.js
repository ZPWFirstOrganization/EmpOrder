orderApp.controller('currentOrderCtrl',function($q,$scope,$state,$stateParams,common,scopeData,scopeMethod,currentOrderServ,deleteServ,apiCaller,sessionStorage){
	$('html,body').animate({scrollTop: '0px'},0)
	$scope.secretary = {userName:"",userPhone:""}
	$scope.count = 0
	$scope.isCanShop = false
	$scope.currentOrderData = {};
	$scope.lastData = 18
	$scope.isHaveData = true
	scopeData.discountType = $stateParams.discountType;
	$scope.discountType = scopeData.discountType;
	$scope.resAmount = (scopeData.discountType==2) ? 5000 : 2000
	$scope.payAmount = 0
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
	currentOrderServ.getDateGate({kind:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/Order'},function(response){
	    var arry = response.orderDate.split("-")
	    $scope.isCanShop = response.allowOrder
	    $scope.lastData = parseInt(arry[1])
  	})
  	//初始化余额
  	currentOrderServ.getResAmount({kind:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/User',myBalanceUserID:scopeData.userID},function(response){
  		$scope.resAmount = parseFloat(response.myBalance).toFixed(2)
  		$scope.payAmount = parseFloat(response.myCurrentRealMount).toFixed(2)
  	})
  	//初始化产品数量
  	currentOrderServ.getCount({kind: "types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/Order',userID:scopeData.userID},function(response){
  		$scope.count = response.productCount
  	})
  	//获取秘书
  	if (scopeData.secretaryName == '' || scopeData.secretaryPhone == ''){
		apiCaller.getSecretary({userID:scopeData.userID},function(response){
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
  	if (scopeData.userID){
		currentOrderServ.getCurrentOrder({kind:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/Order',userID:scopeData.userID},function(response){
		    
		    $scope.currentOrderData = response[0];
		    //无产品
		    if (!$scope.currentOrderData){
		    	$scope.currentOrderData = {product:[]}
		    	$scope.isHaveData = false
		    }
		    $("body").hideLoading();
	  	},function(response){
	  		$("body").hideLoading();
	  	})
	}

  	$scope.numberClicked = function(id) {
		$("#"+id).focus();
		$("#"+id).select();
	}

	var oldCount;
	var isFocus = false;
    $scope.countFocus = function(prodCount,id,index){
    	isFocus = true
    	$("#"+id).select();
		oldCount = parseInt(prodCount)
		$("#"+id).keyup(function(){
			if(!(/(^[0-9]*$)/).test($scope.currentOrderData.product[index].requestQTY)){
				$scope.currentOrderData.product[index].requestQTY = oldCount;
			}
		});
	};
	function submitCount(prodCount,index){
		if (!(/(^[0-9]*$)/).test($scope.currentOrderData.product[index].requestQTY) || prodCount == "" || parseInt(prodCount) <= 0 ){
			$scope.currentOrderData.product[index].requestQTY = oldCount;
			return
		};
		if (parseInt(prodCount) != oldCount){
			$("body").showLoading();
			

			currentOrderServ.putProduct(
				{	
					kind: "types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/Order',
					userID:scopeData.userID,
					productCode:$scope.currentOrderData.product[index].productCode,
					count:parseInt(prodCount)
				},
				//success
				function(response){
			    	$scope.resAmount = response.myBalance.toFixed(2)
  					$scope.payAmount = response.realMount.toFixed(2)
  					$scope.count = response.productCount
  					$("body").hideLoading();
  					$("#text"+index).blur()
  					isFocus = false
		  		},
		  		//error
		  		function(response){
		  			$scope.currentOrderData.product[index].requestQTY = oldCount
		  			if (response.status == 404){
		  				showModal({msg:"产品未找到"});
		  			}else if(response.status == 400){
		  				showModal({msg:"剩余额度不足"});
		  			}
		  			$("body").hideLoading();
		  		}
		  	);
		}else{
			return
		};
	}
	$scope.countBlur = function(prodCount,index){
		if (!isFocus){
			return;
		}
		submitCount(prodCount,index)
	}
	$scope.countPress = function(ev,prodCount,index){
		//回车事件
		if (ev.keyCode !== 13) return;

		submitCount(prodCount,index)
	}
		
	$scope.favClick = function(index){
		if ($scope.currentOrderData.product[index].isFavorite == false){
			currentOrderServ.postFav(
			{kind:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/Favorite',userID:scopeData.userID,productCode:$scope.currentOrderData.product[index].productCode}
			 ,function(){
			 	$scope.currentOrderData.product[index].isFavorite = !$scope.currentOrderData.product[index].isFavorite
			 	showModal({msg:"添加到我的收藏"});
			},function(){

			})
			
		}else{
			deleteServ("Favorite",{userID:scopeData.userID,productCode:$scope.currentOrderData.product[index].productCode},
			function(response){
				$scope.currentOrderData.product[index].isFavorite = !$scope.currentOrderData.product[index].isFavorite
				showModal({msg:"已取消收藏"});
			},
			function(response){
			});
			
		}
		
	}
	$scope.deleteProduct = function(index){
		showConfirm({
			msg:"确定从购物车中删除吗？",
			Ymsg:"确定",
			Nmsg:"取消",
			confirmed:function(){
				$("body").showLoading();
				deleteServ("Order",{userID:scopeData.userID,productCode:$scope.currentOrderData.product[index].productCode},
				function(response){
					$scope.$apply(function () {
						$scope.resAmount = response.myBalance.toFixed(2)
  						$scope.payAmount = response.realMount ? response.realMount.toFixed(2) : 0
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
	$scope.orderCancel = function(){
		showConfirm({
			msg:"确定取消该订单？",
			confirmed:function(){
				$("body").showLoading();
				deleteServ("Order",{userID:scopeData.userID,productCode:''},
				function(response){
					$scope.$apply(function () {
						$scope.resAmount = response.myBalance.toFixed(2)
  						$scope.payAmount = 0
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
    baseUrl+'/:kind',
    {},
    {
      //获取当月订单
      getCurrentOrder:{
        method:'GET',
        params:{
          userID:'@userID',
          orderDate:'',
        },
        isArray:true
      },
      //修改当月订单产品数量
      putProduct:{
        method:'PUT',
        params:{
          kind:'@kind',
          userID:'@userID',
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
        	myBalanceUserID:'@myBalanceUserID'
        }
      },
      postFav:{
      	method:'POST',
      	params:{
      	  kind:'@kind',
          userID:'@userID',
          productCode:'@productCode'
        }
      },
      getCount:{
      	method:'GET',
      	params:{
          userID:'@userID'
        }
      }
    }
  );
})

orderApp.factory('deleteServ',function(baseUrl,common,scopeData){
	function del(kind,data,suc,err){	
		return 	$.ajax({
		    type: "delete",
		    url: baseUrl+"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+"/"+kind,
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
	// 		        userID:user,
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
	// 		        userID:user
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
	// 		        userID:user,
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

