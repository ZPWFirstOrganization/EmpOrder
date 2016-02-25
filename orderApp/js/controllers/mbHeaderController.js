orderApp.controller('mbHeaderController',function ($scope,$state,$stateParams,scopeData,scopeMethod,apiCaller) {

    if("2"==$stateParams.discountType){
        $scope.currentType = "优惠价";
    }else{
        $scope.currentType = "6折";
    }
    scopeData.discountType = $stateParams.discountType;
    var delayTime;
    $scope.showSearch = true;
    $scope.searchKey = "";
    stateMonitor = setInterval(function () {
        if($state.current.name == 'index.productList' || $state.current.name == 'index.searchResult'){
            $scope.showSearch = true;
        }else{
            $scope.showSearch = false;
        }
        $scope.$apply()
    },100)

    $scope.$on("$destroy", function() {
        clearInterval(stateMonitor);
    })

    //展开我的
    $('[action="my"]').click(function(){        
        if($(".my-list").css("display")=="none"){
            $(".my-list").slideDown(300);
            showModalBg($(".my-list"));
        }else{
            $(".my-list").slideUp(300); 
            hideModalBg();
        }   
    });
    
    //闭合我的
    $("body").click(function(event){
        if(event.target!=$('[action="my"]')[0]){
            if($(".my-list").css("display")=="block"){
                $(".my-list").slideUp(200); 
                hideModalBg();
            }
        }
    });     

    //展开优惠价
    $('[action="mobile-select-onsale"]').click(function(){      
        if($(".mobile-onsale-list").css("display")=="none"){
            $(".mobile-onsale-list").fadeIn(200);   
            showModalBg($(".mobile-onsale-list"));
            $("#typeArrow").addClass("mobile-onsale-arrow-up");
        }else{
            $(".mobile-onsale-list").fadeOut(200);
            $("#typeArrow").removeClass("mobile-onsale-arrow-up");
            hideModalBg();  
        }   
    });
    //闭合优惠价
    $("body").click(function(event){
        if(event.target!=$('.mobile-onsale-content')[0] && event.target!=$('.mobile-onsale-arrow')[0]){
            if($(".mobile-onsale-list").css("display")=="block"){
                $(".mobile-onsale-list").fadeOut(200);
                $("#typeArrow").removeClass("mobile-onsale-arrow-up");
                hideModalBg();      
            }
        }
    });

    $scope.changeDiscountType = function(type){
        if(type == "6"){
            $scope.currentType = "6折";
            scopeData.discountType = "6"
        }
        if(type == "2"){
            $scope.currentType = "优惠价";
            scopeData.discountType = "2"
        }
        $(".mobile-onsale-list").fadeOut(200);
        $("#typeArrow").removeClass("mobile-onsale-arrow-up");
        hideModalBg();  
        scopeMethod.changeState("1","1","1");
    }

    $scope.nav1Clicked = function () {
        scopeMethod.changeState('1','1','1');
    }

    $scope.favClicked = function() {
        $state.go('index.favorites',{discountType:scopeData.discountType,page:1});
    }

    $scope.searchClicked = function(){
        $state.go('index.searchResult',{key:$scope.searchKey,page:1});
    }

    var data = [];
    $("#mbSeach").keyup(function(event){
        clearTimeout(delayTime);
        $('#mbSeach').autocompleter('destroy');
        data = [];
        if (event.keyCode == 13){
            if($scope.searchKey != ""){
                $state.go('index.searchResult',{key:$scope.searchKey,page:1})
                $('#mbSeach').autocompleter('close');
            }
        }else{
            delayTime = setTimeout(function() {
                apiCaller.getSearchTips($scope.searchKey,function(res){
                    data = [];
                    for (var i = 0; i < res.length; i++) {
                        var tmp;
                        if(res[i].productCode){
                            tmp = {"value":res[i].productCode,"label":res[i].productCode}
                            data.push(tmp)
                        }
                        if(res[i].productName){
                            tmp = {"value":res[i].productName,"label":res[i].productName}
                            data.push(tmp)
                        }
                    };
                    $('#mbSeach').blur()
                    setTimeout(function(){
                        $('#mbSeach').autocompleter({ 
                            highlightMatches: true,
                            empty: false,
                            limit: 5,
                            source: data
                        });
                        $('#mbSeach').focus()
                    },100)
                })
            },500);
        }
    })

});