orderApp.controller('mbHeaderController',function ($scope,$state) {

    $scope.showSearch = true;
    stateMonitor = setInterval(function () {
        if($state.current.name == 'index.productList'){
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
            $(".my-list").fadeIn(200);  
        }else{
            $(".my-list").fadeOut(200); 
        } 

    });

    $scope.favClicked = function() {
        $state.go('index.favorites')
    }

    $scope.searchClicked = function(){
        $state.go('index.searchResult')
    }
    //闭合我的
    $("body").click(function(event){
        if(event.target!=$('[action="my"]')[0]){
            if($(".my-list").css("display")=="block"){
                $(".my-list").fadeOut(200); 
            }
        }
    });

    //展开优惠价
    $('[action="mobile-select-onsale"]').click(function(){    
        if($(".mobile-onsale-list").css("display")=="none"){
            $(".mobile-onsale-list").fadeIn(200);
        }else{
            $(".mobile-onsale-list").fadeOut(200);  
        }
    });

    //闭合优惠价
    $("body").click(function(event){
        if(event.target!=$('.mobile-onsale-content')[0] && event.target!=$('.mobile-onsale-arrow')[0]){
          if($(".mobile-onsale-list").css("display")=="block"){
                $(".mobile-onsale-list").fadeOut(200);  
            }
        }
    });
});