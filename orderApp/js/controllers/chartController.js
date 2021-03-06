﻿orderApp.controller('chartController',function($scope,$state,$stateParams,scopeData,scopeMethod,apiCaller){
	scopeMethod.setMinHeight();
	$scope.discountType = $stateParams.discountType;
	$scope.col_width = null;
	scopeData.discountType = $stateParams.discountType;
	apiCaller.getChartData(function(res){
		$scope.years = getYears(res.report)
		$scope.col_width = ($scope.years.length>2)? null:85;//需要多少像素宽在这里配置就可以了
		$scope.amount = getAmount(res.report)
		$scope.userName = res.username;
		$('#col-chart').highcharts({
	        chart: {
	            type: 'column',
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: $scope.years,
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: '消费总额（折后价）'
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
	                    formatter : function(){
	                		return Highcharts.numberFormat(parseFloat(this.y),1,".","")
	            		}
	                }
	            }
	        },
	        series: [{
	            color : '#EE3D11',
	            name  : $scope.userName,
	            data  : $scope.amount
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
		amount.push(fomatFloat(total,1));
		return amount;
	}
	function fomatFloat(src,pos){       
		return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);       
    }
	$scope.nav1Clicked = function () {
		scopeMethod.changeState('1','1','1');
	}

	
});