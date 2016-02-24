//显示Toast提示 替换alert
function showModal(obj){
   var fadeInTime = obj.fadeInTime ? obj.fadeInTime : 500; //黑块淡进
   var delayTime = obj.delayTime ? obj.delayTime : 1000; //停留时间
   var fadeOutTime = obj.fadeOutTime ? obj.fadeOutTime : 200; //淡出时间
   var callbackTime  = obj.callbackTime ? obj.callbackTime : 3000; //回调延迟


   if($(".showModal").length==0){
      $("body").append('<div class="showModal" style="display:none">'+obj.msg+'</div>');
   }

   $(".showModal").fadeIn(fadeInTime).delay(delayTime).fadeOut(fadeOutTime);

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