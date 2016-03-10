orderApp.controller('chartController',function($scope,$state,$stateParams,scopeData,scopeMethod,apiCaller){
	$scope.discountType = $stateParams.discountType;
	$scope.col_width = null;
	scopeData.discountType = $stateParams.discountType;
	apiCaller.getChartData(function(res){
		$scope.years = getYears(res.report)
		$scope.col_width = ($scope.years.length>2)? null:30;//需要多少像素宽在这里配置就可以了
		$scope.amount = getAmount(res.report)
		$scope.userName = res.reportuserid;

		$('#col-chart').highcharts({
	        chart: {
	            type: 'column',
	        },
	        title: {
	            text: '消费趋势'
	        },
	        xAxis: {
	            categories: $scope.years,
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: '消费总额'
	            }
	        },
	        tooltip : {
	            enabled : false
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0,
	                pointWidth : $scope.col_width//如果是null，就是原先的效果
	            },
	            series: {
	                dataLabels: {
	                    enabled: true,
	                }
	            }
	        },
	        series: [{
	            color : '#EE3D11',
	            name  : $scope.userName,
	            data  : $scope.amount,
	        }],
	        credits : {
	            enabled : false
	        }
	    });
	},function(res){
		
	});
	function getYears(data){
		var years = [];
		$.each(data, function(k,v){
			if (v>0){
				years.push(String(k));
			}
		})
		years.push('Grand Total');
		return years;
	}
	function getAmount(data){		
		var amount = [];
		var total = 0
		$.each(data, function(k,v){
			if (v>0){
				amount.push(v)
				total += v
			}
		})
		amount.push(total)
		return amount;
	}
	// $scope.years = [ '2008', '2009', '2010', '2011', '2012', '2013',
 //                '2014', '2015', '2016', 'Grand Total' ];
	//     $scope.amount = [928, 1184, 2671, 4937, 1100, 3104, 737, 1704, 1513, 17898];
	//     $scope.userName = '李震';
	//     $('#col-chart').highcharts({
	//         chart: {
	//             type: 'column'
	//         },
	//         title: {
	//             text: '消费趋势'
	//         },
	//         xAxis: {
	//             categories: $scope.years,
	//             crosshair: true
	//         },
	//         yAxis: {
	//             min: 0,
	//             title: {
	//                 text: '消费总额'
	//             }
	//         },
	//         tooltip : {
	//             enabled : false
	//         },
	//         plotOptions: {
	//             column: {
	//                 pointPadding: 0.2,
	//                 borderWidth: 0
	//             }
	//         },
	//         series: [{
	//             color : '#EE3D11',
	//             name  : $scope.userName,
	//             data  : $scope.amount

	//         }],
	//         credits : {
	//             enabled : false
	//         }
	//     });

	$scope.nav1Clicked = function () {
		scopeMethod.changeState('1','1','1');
	}

	
});