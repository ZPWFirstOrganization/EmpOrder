orderApp.controller('favController',function ($scope,$stateParams,$state,apiCaller,scopeData,scopeMethod,sessionStorage) {
    sessionStorage.put("sourcePageId","3")
    var initData = function(){
        $scope.balance = apiCaller.getBalance();
        $scope.orderCount = apiCaller.getOrderCount();
        $scope.isNotAllowOrder = scopeData.isNotAllowOrder;
        $scope.orderDate = scopeData.orderDate;
        scopeData.discountType = $stateParams.discountType;
        apiCaller.getFavoriteList($scope.currentPage,function(res) {
            $scope.favList = res.favorites;
            console.log('--------------------------',res);
            $scope.pageNumCount = res.pageNumCount;
            for (var i = 0; i < res.pageNumCount; i++) {
                $scope.pages.push(i+1)
            };
            for (index in $scope.favList ) {
                $scope.inputTexts[$scope.favList[index].productCode] = '1'
            };
            if($scope.favList[0]){
                $scope.isFavEmpty = false;
            }else{
                $scope.isFavEmpty = true;
            }
            $("body").hideLoading();
        },function(){
            $scope.isFavEmpty = true;
            $("body").hideLoading();
        });
    }

    $scope.pages = [];
    $scope.inputTexts = [];
    $scope.currentPage = $stateParams.page;
    $scope.pageNumCount = 1;
    $("body").showLoading();
    initData();
    //手机上拉刷新
    if($(window).width()<801)
        Hook.init({
            wrapperId:"#wrapper",
            scrollerId:"#scroller",
            wrapperCss:{
                "position": "absolute",
                "z-index": 1,
                "top": "0px",
                "bottom": "0px",
                "left": "0px",
                "right":"0px",
                overflow: "hidden"
            },
            distance:50,
            callback:function(){
                $("body").showLoading();
                apiCaller.getFavoriteList(++$scope.currentPage,function(res){
                    $scope.favList =
                     ($scope.favList).concat(res.favorites);
                     $("body").hideLoading();
                },function(){
                    $("body").hideLoading();
                    showModal({msg:"没有更多商品了!"});
                })
            }
    });

    $scope.$watch('favList', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            console.log("$watch(favList",newVal)
            for (index in newVal ) {
                $scope.inputTexts[newVal[index].productCode] = '1'
            };
            if(!scopeMethod.isEmptyObject(newVal)) {
                for (index in newVal) {
                   newVal[index].isNotAllowOrder = $scope.isNotAllowOrder;
                };
            }
        }
    }, true);

    $scope.toDetail = function(Product){
        if(Product.onSale){
            $state.go('index.product',{discountType:scopeData.discountType,productCode:Product.productCode});
        }
    }

    $scope.pageNumClicked = function(page){
        switch(page){
            case 'next':
                if($scope.currentPage < $scope.pageNumCount){
                    $(window).scrollTop(0);
                    $scope.currentPage = parseInt($scope.currentPage) + 1;
                }else{
                    return;
                }
            break;

            case 'prev':
                if($scope.currentPage > 1){
                    $(window).scrollTop(0);
                    $scope.currentPage = parseInt($scope.currentPage) - 1;
                }else{
                    return;
                }
            break;

            case 'last':
                if($scope.currentPage == $scope.pageNumCount){
                    return;
                }else{
                    $(window).scrollTop(0);
                    $scope.currentPage = $scope.pageNumCount;
                }
            break;

            case 'first':
                if($scope.currentPage == 1){
                    return;
                }else{
                    $(window).scrollTop(0);
                    $scope.currentPage = 1;
                }
            break;

            default:
                $(window).scrollTop(0);
                $scope.currentPage = page;
            break;
        }
        $state.go('index.favorites',{discountType:scopeData.discountType,page:$scope.currentPage})
    }

    $scope.addCartClicked = function(Product) {
        if (Product.onSale && !Product.isNotAllowOrder){
            $("body").showLoading();
            var result = apiCaller.postOrderedProduct(Product,$scope.inputTexts[Product.productCode],function(){
                showModal({msg:"已加当月订单"});
                $(".cart").find(".number").transition({scale:2});
                setTimeout(function(){
                    $(".cart").find(".number").transition({scale:1});
                },500)
                $scope.balance = apiCaller.getBalance();
                $scope.orderCount = apiCaller.getOrderCount();
                $("body").hideLoading();
            },function(){
                $("body").hideLoading();
                showModal({msg:"剩余额度不足"});
            });
        }
    }

    $scope.numberFocused = function(NumberID){
        $("#"+NumberID).keyup(function(){
            if(!(/(^[0-9]*$)/).test($scope.inputTexts[NumberID])){
                $scope.inputTexts[NumberID] = 1;
            }
        });
    }

    $scope.numberBlured = function(NumberID){
        if($scope.inputTexts[NumberID] == '' || parseInt($scope.inputTexts[NumberID]) <= 0){
            $scope.inputTexts[NumberID] = 1;
        }
    }

    $scope.favoriteClicked = function(Product) {
        
        showConfirm({
            msg:"是否取消收藏？",
            confirmed:function(){
                $("body").showLoading();
                apiCaller.deleteFav(Product,function() {
                    showModal({msg:"已取消收藏"});
                    if($scope.favList[1]){
                        $state.go('index.favorites',{discountType:scopeData.discountType,page:$scope.currentPage});
                        initData();
                    }else{
                        if($scope.currentPage > 1){
                            $state.go('index.favorites',{discountType:scopeData.discountType,page:($scope.currentPage-1)});
                        }else{
                            $state.go('index.favorites',{discountType:scopeData.discountType,page:$scope.currentPage});
                        }
                        initData();
                    }
                    $("body").hideLoading();
                });
            }
        });
        
    }

    $scope.countSubtracted = function(Product){
        var id = Product.productCode;
        if($scope.inputTexts[id] > 1)
            $scope.inputTexts[id] = parseInt($scope.inputTexts[id]) - 1;
    }

    $scope.countAdded = function(Product){
        var id = Product.productCode;
        if($scope.inputTexts[id] < 999)
            $scope.inputTexts[id] = parseInt($scope.inputTexts[id]) + 1;
    }

    $scope.numberClicked = function(Product) {
        var id = Product.productCode;
        $("#"+id).focus();
        $("#"+id).select();
    }

    $scope.nav1Clicked = function () {
        scopeMethod.changeState('1','1','1');
    }

    $scope.cartClicked = function(){
        $state.go('index.currentOrder',{discountType:scopeData.discountType});
    }
})