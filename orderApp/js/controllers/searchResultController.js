orderApp.controller('searchResultController',function ($scope,apiCaller,scopeData,scopeMethod) {
    
    $scope.balance = apiCaller.getBalance();
    $scope.orderCount = apiCaller.getOrderCount();

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

    $scope.nav1Clicked = function () {
        scopeMethod.changeState('1',scopeData.homeDivisionCode,'1');
        scopeData.currentDivisionName = scopeData.homeDivisionName;
        scopeData.currenGroupName = '';
    }
})