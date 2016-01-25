/*!
 * 自定义全局js
 * Copyright 2011-2014 Twitter, Inc.
 *
 */
$(document).ready(function(e) {

	
	
	//pc js--------------------------------------------------	
	
	//导航菜单	
	$(".menu").mouseenter(function(){
		$(this).find(".submenu-wrapper").fadeIn(200);
	});

	$(".menu").mouseleave(function(){
		$(this).find(".submenu-wrapper").fadeOut(200);
	});	
		
	//展开/闭合优惠价
	$('[action="pc-select-onsale"]').mouseenter(function(){		
		if($(".pc-onsale-list-wrapper").css("display")=="none"){
			$(".pc-onsale-list-wrapper").fadeIn(200);	
		}

	}).mouseleave(function(){		
		if($(".pc-onsale-list-wrapper").css("display")!="none"){
			$(".pc-onsale-list-wrapper").fadeOut(200);	
		}

	});
	
	//mobile js--------------------------------------------------
    //展开我的
	$('[action="my"]').click(function(){		
		if($(".my-list").css("display")=="none"){
			$(".my-list").fadeIn(200);	
			
			showModalBg($(".my-list"));
		}else{
			$(".my-list").fadeOut(200);	
			hideModalBg();
		}	

	});
	
	//闭合我的
	$("body").click(function(event){
		
		if(event.target!=$('[action="my"]')[0]){
			if($(".my-list").css("display")=="block"){
				$(".my-list").fadeOut(200);	
				hideModalBg();
			}
	    }

	});		
	//展开优惠价
	$('[action="mobile-select-onsale"]').click(function(){		
		if($(".mobile-onsale-list").css("display")=="none"){
			$(".mobile-onsale-list").fadeIn(200);	
			showModalBg($(".mobile-onsale-list"));
		}else{
			$(".mobile-onsale-list").fadeOut(200);
			hideModalBg();	
		}	

	});
    //闭合优惠价
	$("body").click(function(event){
		//console.log(event.target)
		if(event.target!=$('.mobile-onsale-content')[0] && event.target!=$('.mobile-onsale-arrow')[0]){
			
			if($(".mobile-onsale-list").css("display")=="block"){
				$(".mobile-onsale-list").fadeOut(200);
				hideModalBg();		
			}
	    }

	});	
	
	
   //pc and mobile js--------------------------------------------------
   
   //自动完成搜索api   https://github.com/ArtemFitiskin/jquery-autocompleter
	var data = [
		{ "value": "1", "label": "1" },
		{ "value": "1-1", "label": "1-1" },
		{ "value": "2", "label": "2" },
		{ "value": "3", "label": "3" }
	];

	$('.search').autocompleter({ 
		highlightMatches: true,

        // abort source if empty field
        empty: false,
        // max results
        limit: 5,
		source: data
	 });



   //ajax全局阻止重复提交
   window.ys={};
   window.ys.ajax={};
   window.ys.ajax.urlMap= new Array();

	$.ajaxSetup({
		beforeSend:function(xhr){
			//console.log(this.url);
			if(ys.ajax.urlMap[this.url] && ys.ajax.urlMap[this.url] == 'lock'){
				return false;
			} else {
				ys.ajax.urlMap[this.url] = 'lock';
			}
		},
		complete:function(){
			ys.ajax.urlMap[this.url] = 'unlock';
			delete ys.ajax.urlMap[this.url];
		},
		error: function(xhr, status, err){
			if(xhr.status  == "200" || xhr.status == 200){
				return;
			}
			if(xhr.status  == "510" || xhr.status == 510){
				showModal({
					msg:"请先登录再操作",
					callbackTime:1000,
					end:function(){
						avalon.vmodels.header.showLogin();
					}
				})
			} else if(xhr.status  == "511" || xhr.status == 511){
				showModal({
					msg:"用户还未通过验证"
				})
			} else if(xhr.status  == "512" || xhr.status == 512){
				showModal({
					msg:"用户已经被冻结"
				})
			} else if(xhr.status  == "513" || xhr.status == 513){
				showAlert({
					msg:"您已被列入黑名单!<br/>请联系左木[微信635636]"
				})
			}
			hideLoading();
		}
	});

});
//显示下拉框 黑背景
function showModalBg(obj){
	
	top=45;
	height=$(window).height()-45;
	
	modalBg=$('<div id="modalBg" style="background-color:#000; opacity:0.7; position:absolute; z-index:10; width:100%; height:'+height+'px; top:'+top+'"></div>');
	obj.after(modalBg);
	
	modalBg.click(function(){
		$(this).remove();	
	})
}
//隐藏 黑背景
function hideModalBg(){
	
	$("#modalBg").remove();
	
}	
//显示Toast提示 替换alert
function showModal(obj){
   var fadeInTime = obj.fadeInTime ? obj.fadeInTime : 500; //黑块淡进
   var delayTime = obj.delayTime ? obj.delayTime : 2000; //停留时间
   var fadeOutTime = obj.fadeOutTime ? obj.fadeOutTime : 200; //淡出时间
   var callbackTime  = obj.callbackTime ? obj.callbackTime : 3000; //回调延迟


   if($(".showModal").length==0){
	    $("body").append('<div class="showModal" style="display:none">'+obj.msg+'</div>');
   }

   $(".showModal").fadeIn(fadeInTime).delay(delayTime).animate({"top":"60%","opacity":0},fadeOutTime).fadeOut(0);

   //回调
   if(obj.end){
	   setTimeout(function () {
		obj.end();

	   }, callbackTime);
   }
   //移除黑块
   setTimeout(function () {

	$(".showModal").remove();
   }, fadeInTime+delayTime+fadeOutTime);

}

//显示置顶按钮
function showTopBtn(){

	if($(".to-top").length==0){
		$("body").prepend('<div class="to-top"></div>');
	};

	$('.to-top').on('click',function(){

		$("html,body").animate({ scrollTop: 0 }, 0);
	});
	$(".to-top").fadeIn(200);

}
function hideTopBtn(){
	$(".to-top").fadeOut(200);

}

//显示弹窗 依赖jquery.reveal.js
function showConfirm(obj){
   var msg = obj.msg ? obj.msg : "确定要执行操作嘛？"; //黑块淡进
   

	$("[popup='confirm']").reveal({
		dismissJqObject:$("[popup='confirm']").find("[action=cancel]")	
	});
	$("[popup='confirm']").find("[action=msg]").html(msg);
	$("[popup='confirm']").find("[action=confirm]")[0].onclick=function(){	
		if(obj.confirmed){obj.confirmed()};
		$("[popup='confirm']").closeModal();
		return true;
	};
 	$("[popup='confirm']").find("[action=cancel]")[0].onclick=function(){
		if(obj.cancel){obj.cancel()};
		$("[popup='confirm']").closeModal();
		return false;
	};
}


//显示弹窗alert 依赖jquery.reveal.js
function showAlert(obj){
   var msg = obj.msg ? obj.msg : "弹窗提示！"; //黑块淡进
   

	$("[popup='alert']").reveal({
		closeonbackgroundclick:false
	});
	$("[popup='alert']").find("[action=msg]").html(msg);
	
	if(obj.btn==false){
		$("[popup='alert']").find(".form-row,.split-dot").hide(0);	
	}else{
		$("[popup='alert']").find(".form-row,.split-dot").show(0);
	}	
	
	$("[popup='alert']").find("[action=alert]")[0].onclick=function(){	
		if(obj.alerted){obj.alerted()};
		$("[popup='alert']").closeModal();
		return true;
	};

}



//显示加载菊花
jQuery.fn.showLoading = function(top) {
	    if(!top){top=0}
		if(this.css("position")!="relative"){
			this.css("position","relative");
		};

		w=$(window).width();
		h=$(window).height();

		if(!$(".loading-Bg")[0]){
		    var bg='';

		}else{
			var bg="";
		}


    	if(this.find(".loading").length==0){
			this.prepend('<div class="loading"></div>'+bg);
		};

		$(window).resize(function(e) {
			w=$(window).width();
	    	h=$(window).height();
            $(".loading-Bg").css({"width":w+"px","height":h+"px"});
        });
		//屏幕太长时调整位置

			topPx=this.height()/2;
			this.find(".loading").css("top",topPx+top);

		this.find(".loading").fadeIn(200);

};
//隐藏加载菊花
jQuery.fn.hideLoading = function() {

		this.find(".loading").fadeOut(200);
		this.find(".loading-bg").remove();
		   setTimeout(function () {
		   $(this).remove(".loading");
		}, 200);
};



//判断ajax返回类型 兼容ie7
function ajaxType(val){
	if(typeof(val)=='string'){
		return JSON.parse(val);
	}else{
		return val;
	}
}




