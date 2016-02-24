	/*
 * jQuery Reveal Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function($) {

/*---------------------------
 Defaults for Reveal
----------------------------*/

/*---------------------------
 Listener for data-reveal-id attributes
----------------------------*/

	$(document).on('click','[data-reveal-id]', function(e) {
		e.preventDefault();
		var modalLocation = $(this).attr('data-reveal-id');
		$('#'+modalLocation).reveal($(this).data());
	});

/*---------------------------
 Extend and Execute
----------------------------*/

    $.fn.reveal = function(options) {


        var defaults = {
	    	animation: 'none', //fade, fadeAndPop, none
		    animationspeed: 500, //how fast animtions are
		    closeonbackgroundclick: true, //if you click background will modal close?
		    dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
			//dismissJqObject:[$("#cancelbtn"),$("#okbtn")]
    	};

        //Extend dem' options
        var options = $.extend({}, defaults, options);


		

        //$(this).each(function() {

/*---------------------------
 Global Variables
----------------------------*/
        	
        		// $(this).attr("topMeasure",50);				
				$(this).attr("topOffset", $(this).height() + parseInt($(this).attr("topMeasure")));
				$(this).attr("locked",false);
				$(this).attr("animation",options.animation);
				$(this).attr("animationspeed",options.animationspeed);
				$(this).attr("closeonbackgroundclick",options.closeonbackgroundclick);
				$(this).attr("dismissmodalclass",options.dismissmodalclass);
          		
				modalBG = $('.reveal-modal-bg');

/*---------------------------
 Create Modal BG
----------------------------*/
			if(modalBG.length == 0) {
				modalBG = $('<div class="reveal-modal-bg" />').insertAfter($(this));
			}

            openModal($(this));


/*---------------------------
 Function for closing Modal 
----------------------------*/
			
			
/*			$.fn.reveal.closeModal=function(){
				console.log(this)
				closeModal(modal);
			}*/




/*---------------------------
 Open & Close Animations
----------------------------*/

			//Entrance Animations
			$(this).bind('reveal:open', function () {
			  modalBG.unbind('click');
				$('.' + options.dismissmodalclass).unbind('click');
				openModal($(this));
				$(this).unbind('reveal:open');
			});

			//Closing Animation
			$(this).bind('reveal:close', function () {
				console.log($(this));
                closeModal($(this));
				$(this).unbind('reveal:close');
			});

/*---------------------------
 Open and add Closing Listeners
----------------------------*/
        	//Open Modal Immediately
    	    $(this).trigger('reveal:open')

			//Close Modal Listeners
			var closeButton = $('.' + options.dismissmodalclass).bind('click', function () {
			  $(this).trigger('reveal:close')
			});
			//Add Close Modal function dismissJqObject:[$("#cancelbtn"),$("#okbtn")]

			if(options['dismissJqObject']){
				if({}.toString.call(options['dismissJqObject']).slice(8,-1)=='Object'){
					//单个关闭对象
					
					 options['dismissJqObject'].bind('click', function () {
					 
						 $(this).trigger('reveal:close');
					 });
				}else{
					//多个关闭对象
					var map=options['dismissJqObject'];
					for(var i=0;i<map.length;i++){
						map[i].bind('click', function () {
							$(this).trigger('reveal:close');
						});
					}

				}

			}



			if($(this).attr("closeonbackgroundclick")=="true") {
				modal=$(this);
				modalBG.css({"cursor":"pointer"})
				modalBG.bind('click', function () {					
				  	modal.trigger('reveal:close');
				});
			}
			$('body').keyup(function(e) {
        		if(e.which===27){ $(this).trigger('reveal:close'); } // 27 is the keycode for the Escape key
			});




      //  });//each call
		
		
		
    }//orbit plugin call
	
	
	
	
	$.fn.closeModal=function(){
		
		
		var defaults = {
	    	animation: 'fadeAndPop', //fade, fadeAndPop, none
		    animationspeed: 300, //how fast animtions are
		    closeonbackgroundclick: true, //if you click background will modal close?
		    dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
			//dismissJqObject:[$("#cancelbtn"),$("#okbtn")]
    	};

        //Extend dem' options
        var options = $.extend({}, defaults, options);
		
        
	
		// $(this).attr("topMeasure",50);				
		$(this).attr("topOffset", $(this).height() + $(this).attr("topMeasure"));
		$(this).attr("locked",false);
		$(this).attr("animation",options.animation);
		$(this).attr("animationspeed",options.animationspeed);
		$(this).attr("closeonbackgroundclick",options.closeonbackgroundclick);
		$(this).attr("dismissmodalclass",options.dismissmodalclass);	
		closeModal($(this));
	};	
	
	
	



	
						
})(jQuery);




	function openModal(modal){
		console.log(modal.attr("animation"))
		if(!modal.locked) {
			lockModal();
			if(modal.attr("animation") == "fadeAndPop") {
				modal.css({'top': $(document).scrollTop()-parseInt(modal.attr("topOffset")), 'opacity' : 0, 'display' : 'block'});
				modalBG.fadeIn(parseInt(modal.attr("animationspeed"))/2);
				modal.delay(parseInt(modal.attr("animationspeed"))/2).animate({
					"top": $(document).scrollTop()+parseInt(modal.attr("topMeasure")) + 'px',
					"opacity" : 1
				}, parseInt(modal.attr("animationspeed")),unlockModal());
					
			}
			if(modal.attr("animation") == "fade") {
				
				modal.css({'opacity' : 0, 'display' : 'block', 'top': $(document).scrollTop()+parseInt(modal.attr("topOffset")) + 'px'});
				
				modalBG.fadeIn(parseInt(modal.attr("animationspeed"))/2);
				modal.delay(parseInt(modal.attr("animationspeed"))/2).animate({
					"opacity" : 1
				}, parseInt(modal.attr("animationspeed")),unlockModal());
			}
			if(modal.attr("animation") == "none") {
				modal.css({'display' : 'block', 'top':$(document).scrollTop()+parseInt(modal.attr("topMeasure"))});
			
				modalBG.css({"display":"block"});
				unlockModal()
			}
		}

	}
			

	function closeModal(modal){
	//console.log(modal.attr("animation"))
	  if(!locked) {
			lockModal();
			 var openModal=0;
			 $(".reveal-modal").each(function(){
				 //获取已打开的弹窗数，大于1时，保留黑背景
				 if($(this).css("display")=="block"){
					 openModal++;
				 }
			 });
			
			if(modal.attr("animation") == "fadeAndPop") {
				if(openModal==1){
					modalBG.delay(parseInt(modal.attr("animationspeed"))).fadeOut(parseInt(modal.attr("animationspeed")));
				}
				
				modal.animate({
					"top":  $(document).scrollTop()-parseInt(modal.attr("topOffset")) + 'px',
					"opacity" : 0
				}, parseInt(modal.attr("animationspeed"))/2, function() {
					modal.css({'top':parseInt(modal.attr("topMeasure"))  + 'px', 'opacity' : 1, 'display' : 'none'});

					unlockModal();
				});
			}
			if(modal.attr("animation") == "fade") {
				if(openModal==1){
					modalBG.delay(parseInt(modal.attr("animationspeed"))).fadeOut(parseInt(modal.attr("animationspeed")));
				}
				modal.animate({
					"opacity" : 0
				}, modal.animationspeed, function() {
					modal.css({'opacity' : 1, 'display' : 'none', 'top' : parseInt(modal.attr("topMeasure"))});

					unlockModal();
				});
			}
			if(modal.attr("animation") == "none") {

				modal.css({'display' : 'none', 'top' : parseInt(modal.attr("topMeasure"))});
				if(openModal==1){
					modalBG.css({'display' : 'none'});
				}						

			}
		}




			
			
	}

/*---------------------------
 Animations Locks
----------------------------*/
	function unlockModal() {
		locked = false;
	}
	function lockModal() {
		locked = true;
	}		