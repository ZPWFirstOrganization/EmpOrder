orderApp.controller('noticeCtrl',function($q,$scope,$stateParams,$http,scopeData,scopeMethod){
    $scope.noticeList = {}
   	scopeData.discountType = $stateParams.discountType;
    $http.get('././cfg/notice.json').success(function(data)
    {
        $scope.noticeList = data;
    });   

    $scope.nav1Clicked = function () {
		scopeMethod.changeState('1','1','1');
	} 
    
});   

