orderApp.controller('currentOrderCtrl',function($q,$scope,$state,$stateParams,scopeData,scopeMethod,currentOrderServ,deleteServ,apiCaller,sessionStorage){
	scopeMethod.setMinHeight()
	$(window).scrollTop(0);
	$scope.secretary = []
	$scope.count = 0
	$scope.isCanShop = false
	$scope.currentOrderData = {};
	$scope.lastData = 1
	$scope.isHaveData = true
	scopeData.discountType = $stateParams.discountType;
	$scope.discountType = scopeData.discountType;
	$scope.resAmount = 0
	$scope.resAmountEx = 0
	//实付金额（currentAmount+donationAmount）
	$scope.payAmount = 0
	//当月订单金额
	$scope.currentAmount = 0
	$scope.donationAmount = 0
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
	// currentOrderServ.getDateGate({kind:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/Order'},function(response){
	//     var arry = response.orderDate.split("-")
    $scope.isCanShop = !scopeData.isNotAllowOrder
    $scope.lastData = scopeData.orderDate[1]
  	// })
  	//初始化余额
  	currentOrderServ.getResAmount({kind:"types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/User',myBalanceUserID:scopeData.userID},function(response){
  		$scope.resAmount = parseFloat(response.myBalance).toFixed(2)
  		$scope.resAmountEx = parseFloat(response.myBalanceEx).toFixed(2)
  		$scope.currentAmount = parseFloat(response.myCurrentRealMount).toFixed(2)
  		$scope.payAmount = parseFloat(response.myTotalMount).toFixed(2)
  		$scope.donationAmount = parseFloat(response.myDonation).toFixed(2)
  	})
  	//初始化产品数量
  	currentOrderServ.getCount({kind: "types/"+scopeData.discountType+"/wap/"+scopeData.isMobile+'/Order',userID:scopeData.userID},function(response){
  		$scope.count = response.productCount
  	})
  	//获取秘书
	apiCaller.getSecretary({userID:scopeData.userID},function(response){
  		$scope.secretary = response
  		},function(response){
	})
  	//获取当月订单详细内容
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
					// console.log(response)
			    	$scope.resAmount = response.myBalance.toFixed(2)
			    	$scope.resAmountEx = response.myBalanceEx.toFixed(2)
			    	$scope.currentAmount = response.realMount.toFixed(2)
  					$scope.payAmount = response.myTotalMount.toFixed(2)
  					$scope.count = response.productCount
  					$("body").hideLoading();
  					$("#text"+index).blur()
  					isFocus = false
		  		},
		  		//error
		  		function(response){
		  			$scope.currentOrderData.product[index].requestQTY = oldCount
		  			if(response.status == -1 || response.status == 412){
		  				showModal({msg:scopeData.timeoutMsg});
		  			}else if (response.status == 404){
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
			},function(response){
				if(response.status == -1 || response.status == 412){
                    showModal({msg:scopeData.timeoutMsg});
                }
			})

		}else{
			deleteServ("Favorite",{userID:scopeData.userID,productCode:$scope.currentOrderData.product[index].productCode},
			function(response){
				$scope.currentOrderData.product[index].isFavorite = !$scope.currentOrderData.product[index].isFavorite
				showModal({msg:"已取消收藏"});
			},
			function(response){
				if(response.status == 0 || response.status == 412){
                    showModal({msg:scopeData.timeoutMsg});
                }
			});

		}

	}
	$scope.deleteProduct = function(index){
		showConfirm({
			msg:"确定从当月订单中删除吗？",
			Ymsg:"确定",
			Nmsg:"取消",
			confirmed:function(){
				$("body").showLoading();
				deleteServ("Order",{userID:scopeData.userID,productCode:$scope.currentOrderData.product[index].productCode},
				function(response){
					$scope.$apply(function () {
						// console.log(response);
						$scope.resAmount = response.myBalance.toFixed(2)
						$scope.resAmountEx = response.myBalanceEx.toFixed(2)
						$scope.currentAmount = response.realMount ? response.realMount.toFixed(2) : 0
  					$scope.payAmount = response.myTotalMount.toFixed(2) ? response.myTotalMount.toFixed(2) : 0
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
					if(response.status == 0 || response.status == 412){
						showModal({msg:scopeData.timeoutMsg});
					}
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
						// console.log(response);
						$scope.resAmount = response.myBalance.toFixed(2)
						$scope.resAmountEx = response.myBalanceEx.toFixed(2)
						$scope.currentAmount = 0
						$scope.payAmount = response.myTotalMount.toFixed(2)
						$scope.count = response.productCount
						$scope.currentOrderData.product = {}
						$scope.isHaveData = false
					});
					$("body").hideLoading();
				},
				function(response){
					// showModal({msg:"删除失败！"});
					$("body").hideLoading();
					if(response.status == 0 || response.status == 412){
						showModal({msg:scopeData.timeoutMsg});
					}
				})
			},
			cancel:function(){

			}
		});

	}

	$scope.nav1Clicked = function () {
		scopeMethod.changeState('1','1','1');
	}

	//新增捐款模块 2017/5
	$scope.isShowDonation = false;
	$scope.isShowDonationContainer = false;
	$scope.isOtherInput = false;
	$scope.otherAmount = '';
	$scope.userDonation = 0;
	$scope.donationOptions = [
		{amount:10,isSelected:false},
		{amount:20,isSelected:false},
		{amount:50,isSelected:false},
		{amount:100,isSelected:false},
	]
	$scope.showDonation = function (){
		if($scope.isCanShop){
			$scope.isShowDonation = true;
			setTimeout(function(){
				$scope.isShowDonationContainer = true;
			},0);
		}
	};

	$scope.hideDonation = function (){
		$scope.isShowDonationContainer = false;
		setTimeout(function(){
			$scope.isShowDonation = false;
		},400);
	}

	$scope.selectDonation = function(idx){
		// $scope.otherAmount = '';
		$scope.userDonation = null;
		// $(".input-amount").val('');
		$scope.isOtherInput = false;
		$.each($scope.donationOptions,function(i,v){
			v.isSelected = false;
		})
		$scope.donationOptions[idx].isSelected = true;
		$scope.userDonation = $scope.donationOptions[idx].amount
		$scope.otherAmount = $scope.donationOptions[idx].amount
	}
	$scope.amountFocused = function(){
		// $scope.userDonation = null;
		$.each($scope.donationOptions,function(i,v){
			v.isSelected = false;
		})
		$scope.isOtherInput = true;
	}
	var oldValue = '';
	var reg = /(^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$)/;
	$scope.amountChange = function(){
		// console.log("change")
		if(reg.test($(".input-amount").val())){
			$scope.userDonation = $(".input-amount").val();
			oldValue = $(".input-amount").val();
		}else{
			if(!$(".input-amount").val()){
				oldValue = '';
				$scope.userDonation = null;
			}
			$scope.otherAmount = oldValue;
			$(".input-amount").val(oldValue);

		}
		//$scope.userDonation = parseFloat($scope.otherAmount);
		//console.log($scope.otherAmount,"---------",oldValue)
		// console.log("change:--------",$scope.otherAmount)
		// console.log(reg.test($scope.otherAmount))
	}
	$scope.submitDonation = function(){
		if(!reg.test($scope.userDonation)){
			alert("请输入有效的金额");
		}else{
			// $("body").showLoading();
			apiCaller.postDonation(parseFloat($scope.userDonation),function(response){
				// $("body").hideLoading();
				console.log(response)
				$scope.hideDonation();
				// alert("捐款成功")
				$scope.donationAmount = response.myDonation.toFixed(2);
				$scope.payAmount = response.myTotalMount.toFixed(2);
			},function(){
				$("body").hideLoading();
				alert("网络不稳定，请稍后再试")
			})
		}
	}
});
