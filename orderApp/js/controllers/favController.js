orderApp.controller('favController',function ($scope,$stateParams,$state,apiCaller,scopeData,scopeMethod) {
    scopeData.sourcePageId = 3;
    var initData = function(){
        $scope.balance = apiCaller.getBalance();
        $scope.orderCount = apiCaller.getOrderCount();
        $scope.isNotAllowOrder = scopeData.isNotAllowOrder;
        $scope.orderDate = scopeData.orderDate;
        apiCaller.getFavoriteList($scope.currentPage,function(res) {
            $scope.favList = res.favorites;
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
            console.log(res)
        },function(){
            $scope.isFavEmpty = true;
            $("body").hideLoading();
        });
    }

    $scope.pages = [];
    $scope.inputTexts = [];
    $scope.currentPage = $stateParams.page;
    $scope.pageNumCount = 1;
    $("body").showLoading(-150);
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
                $("body").showLoading(-150);
                apiCaller.getFavoriteList(++$scope.currentPage,function(res){
                    $scope.favList =
                     ($scope.favList).concat(res.favorites);
                     $("body").hideLoading();
                },function(){
                    $("body").hideLoading();
                    showModal({msg:"没有更多产品了!"});
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

    $scope.pageNumClicked = function(page){
        $(window).scrollTop(0);
        if($scope.currentPage == page){
            return;
        }
        if('next' == page){
            if($scope.currentPage < $scope.pageNumCount){
                $scope.currentPage = parseInt($scope.currentPage) + 1;
            }else{
                showModal({msg:"已经是最后一页了"});
                return;
            }
        }else{
            $scope.currentPage = page;
        }
        $state.go('index.favorites',{page:$scope.currentPage})
    }

    $scope.addCartClicked = function(Product) {
        if (Product.productStatus == 0 && !Product.isNotAllowOrder){
            $("body").showLoading(-150);
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

    $scope.favoriteClicked = function(Product) {
        
        showConfirm({
            msg:"是否取消收藏？",
            confirmed:function(){
                $("body").showLoading(-150);
                apiCaller.deleteFav(Product,function() {
                    showModal({msg:"已取消收藏"});
                    if($scope.favList[1]){
                        $state.go('index.favorites',{page:$scope.currentPage});
                        initData();
                    }else{
                        if($scope.currentPage > 1){
                            $state.go('index.favorites',{page:($scope.currentPage-1)});
                        }else{
                            $state.go('index.favorites',{page:$scope.currentPage});
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
})