// JavaScript Document
var myScroll;
var Hook = {
	isRefresh:false,
	destroy:function(){
		myScroll.destroy();
		myScroll = null;
	},
	init:function(param){
		//console.log("hook init");
		var wrapperId = param.wrapperId;
		var scrollerId = param.scrollerId;
		var dis = typeof(param.distance) == "undefined"? 50:param.distance;
		var callback = typeof(param.callback)=="function"?param.callback:function(){};
		if($(wrapperId).length == 0){
			console.log("there is no element id named " + wrapperId);
			return;
		}
		if($(scrollerId).length == 0){
			console.log("there is no element id named " + scrollerId);
			return;
		}else{
			$(scrollerId).append($('<div id="scroller-pullUp" class="scroller-pullUp mobile-only">'+
				'<span id="up-icon" class="icon-double-angle-up pull-up-icon">»</span>'+
				'<span id="pullUp-msg" class="pull-up-msg">上拉可以刷新</span>'+		
        	'</div>'));
		}
		$(scrollerId).addClass("scroller");
		$(wrapperId).css(param.wrapperCss);
		
		var upIcon = $("#up-icon");
		
	myScroll = new IScroll(wrapperId, { probeType: 3, mouseWheel: true,click:true });
	
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
		
		if(maxY >= dis){
			$("#pullUp-msg").text("松开后刷新");
			Hook.isRefresh = true;
			!upHasClass && upIcon.addClass("reverse_icon");
			return "";
		}else if(maxY < dis && maxY >=0){
			upHasClass && upIcon.removeClass("reverse_icon");
			return "";
		}
	});
	
	myScroll.on("slideUp",function(){
								  
		if(this.maxScrollY - this.y > dis){
			
			$("#pullUp-msg").text("刷新中...");
			upIcon.removeClass("reverse_icon")
		}
	});
	myScroll.on("scrollEnd",function(){
		$("#pullUp-msg").text("上拉可以刷新");	
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

	$("#mbSeach").focus();
	$("#mbSeach").blur();
	}
}
