orderApp.controller('mbHeaderController',function ($scope,$state,$stateParams,$window,scopeData,scopeMethod,apiCaller,userProfile) {

    function showModalBg(obj){

        top=45;
        height=$(window).height()+100;

        modalBg=$('<div id="modalBg" style="background-color:#000; opacity:0.7; position:static; z-index:10; width:100%; height:'+height+'px; top:'+top+'"></div>');
        obj.after(modalBg);
        modalBg.bind('touchmove', function(e) {
                e.preventDefault();
        });
        modalBg.click(function(){
            $(this).remove();
        })
    }
    //隐藏 黑背景
    function hideModalBg(){

        $("#modalBg").remove();

    }

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
                case 5:
                    $state.go("index.chart",{discountType:scopeData.discountType});
                break;
                case 6:
                    $state.go("index.historyDonation",{discountType:scopeData.discountType,page:1,orderDate:'',orderParam:{}});
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
        scopeData.isLogin = false;
        userProfile.getProfile(function(){
            scopeData.isLogin = true;
            scopeMethod.getGate(function(){
                scopeMethod.changeState("1","1","1");
                // $window.location.reload();
            })
        })
    }

    $scope.nav1Clicked = function () {
        if(!scopeData.isHomePage){
            scopeMethod.changeState("1","1","1");
        }else{
            $state.go('login',{discountType:scopeData.discountType,firstLogin:1})
            // $window.location.reload();
        }
    }

    $scope.favClicked = function() {
        $state.go('index.favorites',{discountType:scopeData.discountType,page:1});
    }

    $scope.searchClicked = function(){
        $('#mbSeach').blur();
        to = setTimeout(function(){
            $state.go('index.searchResult',{discountType:scopeData.discountType,key:$scope.searchKey,page:1});
            $scope.searchKey='';
            $('#mbSeach').autocompleter('close');
            $('#mbSeach').blur();
            $scope.DataForMatch = [];
        },500);

    }

    $scope.DataForMatch = [];

    $("#mbSeach").keyup(function(event){
        if(event.keyCode != 38 && event.keyCode != 40){
            clearTimeout(delayTime);
            if (event.keyCode == 13){
                if($scope.searchKey != ""){
                    setTimeout(function(){
                        $state.go('index.searchResult',{discountType:scopeData.discountType,key:$scope.searchKey,page:1});
                        $scope.searchKey='';
                        $('#mbSeach').autocompleter('close');
                        $('#mbSeach').blur();
                        $scope.DataForMatch = [];
                    },500);
                }
            }else{
                if($scope.searchKey != ''){
                    delayTime = setTimeout(function() {
                        apiCaller.getSearchTips($scope.searchKey,function(res){
                            $scope.DataForMatch = [];
                            for (var i = 0; i < res.length; i++) {
                                var tmp;
                                if(res[i].productName){
                                    tmp = {"value":res[i].productName,"label":res[i].productName}
                                    $scope.DataForMatch.push(tmp)
                                }
                                else if(res[i].productCode){
                                    tmp = {"value":res[i].productCode,"label":res[i].productCode}
                                    $scope.DataForMatch.push(tmp)
                                }
                            };
                        })
                    },500);
                }
            }
        }
    })

    document.getElementById('mbSeach').addEventListener('input', function(e){
        clearTimeout(delayTime);
        if($scope.searchKey != ''){
            delayTime = setTimeout(function() {
                apiCaller.getSearchTips($scope.searchKey,function(res){
                    $scope.DataForMatch = [];
                    for (var i = 0; i < res.length; i++) {
                        var tmp;
                        if(res[i].productName){
                            tmp = {"value":res[i].productName,"label":res[i].productName}
                            $scope.DataForMatch.push(tmp)
                        }
                        else if(res[i].productCode){
                            tmp = {"value":res[i].productCode,"label":res[i].productCode}
                            $scope.DataForMatch.push(tmp)
                        }
                    };
                })
            },500);
        }
    });

    $scope.$watch("DataForMatch",function(newValue,oldValue){
        if(newValue != oldValue){
            $('#mbSeach').autocompleter('destroy');
            // $('#mbSeach').blur()
            setTimeout(function(){
                $('#mbSeach').autocompleter({
                    highlightMatches: true,
                    empty: false,
                    limit: 8,
                    source: $scope.DataForMatch,
                    itemClicked:function(){
                        setTimeout(function(){
                            $state.go('index.searchResult',{discountType:scopeData.discountType,key:$scope.searchKey,page:1})
                            $scope.searchKey='';
                            $('#mbSeach').autocompleter('close');
                            $('#mbSeach').blur();
                            $scope.DataForMatch = [];
                        },100);
                    }
                });
                // showModalBg($("div[name='autocompleter']"))
                $('#mbSeach').focus()
            },200);
        }
    },true);

});
