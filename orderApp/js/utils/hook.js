// JavaScript Document
var myScroll;
var Hook = {
	isRefresh:false,
	isRefreshing:false,
	destroy:function(){
		myScroll.destroy();
		myScroll = null;
	},
	init:function(param){
		//总是能触发下拉刷新，设置滚动区域最小高度
		$('div[name="scrollerView"]').css({"min-height":$(window).height()-($('div[name="scrollerView"]').offset().top-1)});
		var wrapperId = param.wrapperId;
		var scrollerId = param.scrollerId;
		var dis = typeof(param.distance) == "undefined"? 50:param.distance;
		var callback = typeof(param.callback)=="function"?param.callback:function(){};
		if($(wrapperId).length == 0){
			return;
		}
		if($(scrollerId).length == 0){
			return;
		}else{
			$(scrollerId).append($('<div id="scroller-pullUp" class="scroller-pullUp mobile-only">'+
				'<span id="up-icon" class="icon-double-angle-up pull-up-icon">»  </span>'+
				'<span id="pullUp-msg" class="pull-up-msg">上拉可以加载更多</span>'+
        	'</div>'));
		}
		$(scrollerId).addClass("scroller");
		$(wrapperId).css(param.wrapperCss);

		var upIcon = $("#up-icon");

	myScroll = new IScroll(wrapperId, { probeType: 3, mouseWheel: true,click:true });
	var wrapperDomId = wrapperId.replace(/#/g,"");
	document.getElementById(wrapperDomId).addEventListener('touchmove', function(event) {
	    // 判断默认行为是否可以被禁用
	    if (event.cancelable) {
	        // 判断默认行为是否已经被禁用
	        if (!event.defaultPrevented) {
	            event.preventDefault();
	        }
	    }
	},{passive:false});
	myScroll.on("beforeScrollStart",function(){
		myScroll.refresh();

	});
	myScroll.on("scroll",function(){
		if(this.y!=0){
			$("#scroller-pullUp").css({"display":"block"});
		}
		var y = this.y,
			maxY = this.maxScrollY - y,

			upHasClass = upIcon.hasClass("reverse_icon");

		if(maxY >= dis && !Hook.isRefreshing){
			$("#pullUp-msg").text("松开后加载");
			Hook.isRefresh = true;
			!upHasClass && upIcon.addClass("reverse_icon");
			return "";
		}else if(maxY < dis && maxY >=0 && !Hook.isRefreshing){
			$("#pullUp-msg").text("上拉可以加载更多");
			Hook.isRefresh = false;
			upHasClass && upIcon.removeClass("reverse_icon");
			return "";
		}
	});

	myScroll.on("slideUp",function(){

		if(this.maxScrollY - this.y > dis){
			Hook.isRefreshing = true
			$("#scroller-pullUp").css({"bottom":"0px"});
			$("#pullUp-msg").text("加载中...");
			$("#up-icon").text("")
		}
	});
	myScroll.on("scrollEnd",function(){
		// $("#pullUp-msg").text("上拉可以加载更多");
		if(Hook.isRefresh){
			callback();
			Hook.isRefresh = false;
			myScroll.refresh();
		}
	});

	var clickEventType=((document.ontouchstart!==null)?'click':'touchstart');
	$(wrapperId).bind(clickEventType, function(e){
		$("#mbSeach").blur();
	});

	window.onresize = function(){
		$(wrapperId).height($(window).height())
	}

	$("#mbSeach").focus();
	$("#mbSeach").blur();
	$(wrapperId).width($(window).width());
	$(wrapperId).height($(window).height());
	},
	loadDown:function(){
		Hook.isRefreshing = false
		$("#scroller-pullUp").css({"display":"none"});
		$("#scroller-pullUp").css({"bottom":"-50px"});
		$("#up-icon").text("»  ")
		$("#pullUp-msg").text("上拉可以加载更多");
	}
}
