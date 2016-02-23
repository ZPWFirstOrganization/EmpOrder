orderApp.controller('searchResultController',function ($scope,$state,$stateParams,apiCaller,scopeData,scopeMethod,sessionStorage) {
    $("body").showLoading(-150);
    $scope.pages = [];
    $scope.inputTexts = [];
    $scope.currentPage = $stateParams.page;
    $scope.pageNumCount = 1;
    $scope.totalCount = 0;
    $scope.searchKey = $stateParams.key;
    sessionStorage.put("sourcePageId","4")
    // scopeData.sourcePageId = 4;
    var initData = function(){
        $scope.balance = apiCaller.getBalance();
        $scope.orderCount = apiCaller.getOrderCount();
        $scope.isNotAllowOrder = scopeData.isNotAllowOrder;
        $scope.orderDate = scopeData.orderDate;
        apiCaller.getSearchResult($stateParams.key,$stateParams.page,function(res){
            $scope.searchResult = res.products;
            $scope.totalCount = res.totalCount;
            $scope.pageNumCount = res.pageNumCount;
            for (var i = 0; i < res.pageNumCount; i++) {
                $scope.pages.push(i+1)
            };
            var i = 0;
            var tmpArr = [];
            for (Product in $scope.searchResult ) {
                $scope.inputTexts[$scope.searchResult[i].productCode] = '1'
                i++;
            };
            if($scope.searchResult[0]){
                $scope.isResultEmpty = false;
            }else{
                $scope.isResultEmpty = true;
            }
            $("body").hideLoading();
        },function(){
            $("body").hideLoading();
            $scope.isResultEmpty = true;
        });
    }

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
                apiCaller.getSearchResult($stateParams.key,++$scope.currentPage,function(res){
                    $scope.searchResult =
                     ($scope.searchResult).concat(res.products);
                     $("body").hideLoading();
                },function(){
                    $("body").hideLoading();
                    showModal({msg:"没有更多产品了!"});
                })
            }
    });

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
        $state.go('index.searchResult',{key:$stateParams.key,page:$scope.currentPage})
    }

    $scope.addCartClicked = function(Product) {
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

    $scope.favoriteClicked = function(Product) {
        $("body").showLoading(-150);
        if(!Product.isFavorite){
            apiCaller.postFav(Product,function() {
                showModal({msg:"添加到我的收藏"});
                Product.isFavorite = true
                $("body").hideLoading();
            })
        }else{
            Product.isFavorite = false;
            apiCaller.deleteFav(Product,function() {
                showModal({msg:"已取消收藏"});
                $("body").hideLoading();
            })
        }
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