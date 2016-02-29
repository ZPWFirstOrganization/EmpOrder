orderApp.controller('mbHeaderController',function ($scope,$state,$stateParams,scopeData,scopeMethod,apiCaller) {

    if("2"==$stateParams.discountType){
        $scope.currentType = "优惠价";
    }else{
        $scope.currentType = "6折";
    }
    scopeData.discountType = $stateParams.discountType;
    $scope.discountType = scopeData.discountType;
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

    $scope.listItemClicked = function(type){
        $(".my-list").slideUp(200); 
        hideModalBg();
        setTimeout(function(){
            switch(type){
                case 1:
                    $state.go("index.currentOrder",{discountType:scopeData.discountType});
                break;
                case 2:
                    $state.go("index.historyOrder",{discountType:scopeData.discountType,page:1,orderDate:'',orderParam:{}});
                break;
                case 3:
                    $state.go("index.personInfo",{discountType:scopeData.discountType});
                break;
                case 4:
                    $state.go("index.notice",{discountType:scopeData.discountType});
                break;
            }
        },250);
    }

    $scope.changeDiscountType = function(type){
        if(type == 6){
            $scope.currentType = "6折";
            scopeData.discountType = "6"
        }
        if(type == 2){
            $scope.currentType = "优惠价";
            scopeData.discountType = "2"
        }
        $scope.discountType = scopeData.discountType;
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
         $('#mbSeach').blur();
         setTimeout(function(){
            $state.go('index.searchResult',{discountType:scopeData.discountType,key:$scope.searchKey,page:1});
         },500);

    }

    $scope.DataForMatch = [];
    
    $("#mbSeach").keyup(function(event){
        if(event.keyCode != 38 && event.keyCode != 40){
            clearTimeout(delayTime);
            if (event.keyCode == 13){
                if($scope.searchKey != ""){
                     $('#mbSeach').blur();
                     setTimeout(function(){
                        $state.go('index.searchResult',{discountType:scopeData.discountType,key:$scope.searchKey,page:1});
                     },500);
                    $('#mbSeach').autocompleter('close');
                }
            }else{
                if($scope.searchKey != ''){
                    delayTime = setTimeout(function() {
                        apiCaller.getSearchTips($scope.searchKey,function(res){
                            $scope.DataForMatch = [];
                            for (var i = 0; i < res.length; i++) {
                                var tmp;
                                if(res[i].productCode){
                                    tmp = {"value":res[i].productCode,"label":res[i].productCode}
                                    $scope.DataForMatch.push(tmp)
                                }
                                if(res[i].productName){
                                    tmp = {"value":res[i].productName,"label":res[i].productName}
                                    $scope.DataForMatch.push(tmp)
                                }
                            };
                        })
                    },500);
                }
            }
        }
    })

    $scope.$watch("DataForMatch",function(newValue,oldValue){
        if(newValue != oldValue){
            $('#mbSeach').autocompleter('destroy');
            $('#mbSeach').blur()
            setTimeout(function(){
                $('#mbSeach').autocompleter({ 
                    highlightMatches: true,
                    empty: false,
                    limit: 8,
                    source: $scope.DataForMatch
                });
                $('#mbSeach').focus()
            },200);
        }
    },true);

});