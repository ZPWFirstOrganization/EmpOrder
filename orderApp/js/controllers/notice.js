orderApp.controller('noticeCtrl',function($q,$scope,$stateParams,$http,scopeData){
    //console.log("noticeCtrl start");
    $scope.noticeList = {}
   
    $http.get('././cfg/notice.json').success(function(data)
    {
        $scope.noticeList = data;
        //console.log($scope.noticeList);
    });    
    
});   

