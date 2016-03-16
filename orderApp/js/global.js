$(document).ready(function(e) {
	//当月订单响应屏幕位置
	window.onload = window.onresize =  function(){		
	
		  if($(window).width()>1300){
			r=(parseInt($(window).width())-1000)/2 -180;
			$(".cart").css({"right":r})       
		  }else{
			$(".cart").css({"right":10})     
			  
		  }
		  $("#main").width($(window).width());
		  if($('#main').height()<=($(window).height()-30)){
		  	$('.footer-wrapper').addClass("footer-wrapper-scale")
		  }else{
		  	$('.footer-wrapper').removeClass("footer-wrapper-scale")
		  }
	};
	
	//pc js--------------------------------------------------	
	
	//导航菜单	
	$(".menu").mouseenter(function(){
		$(this).find(".submenu-wrapper").fadeIn(200);
	});

	$(".menu").mouseleave(function(){
		$(this).find(".submenu-wrapper").fadeOut(200);
	});	
		
   //ajax全局阻止重复提交
   window.ys={};
   window.ys.ajax={};
   window.ys.ajax.urlMap= new Array();

	$.ajaxSetup({
		beforeSend:function(xhr){
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
	height=$(window).height()+100;
	
	modalBg=$('<div id="modalBg" style="background-color:#000; opacity:0.7; position:absolute; z-index:10; width:100%; height:'+height+'px; top:'+top+'"></div>');
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

		// topPx=this.height()/2;
		// this.find(".loading").css("top",topPx+top);

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




