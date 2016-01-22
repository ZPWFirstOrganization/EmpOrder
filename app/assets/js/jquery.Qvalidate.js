    /*author: Sean Shen
	 *plugin-name: quickly validate
	  Version: 1.0.4

	示范
	$("form").Qvalidate();

	<input type="text" placeholder="必填"  valid='{"required":true}'>
	<input type="text" placeholder="邮箱"  valid='{"email":true}'>
	<input type="text" placeholder="必填 邮箱"  valid='{"required":true,"email":true}'>
	<input type="text" placeholder="数字"  valid='{"number":true}'>
    <input type="text" class="input"  name="verifyCode" placeholder="验证码" valid='{"required":true,"limitLength":4,"ajax":{"url":"book-doctor-finish.php","inputName":["cellphone","real_name"],"data":"a=b"}}' />	         //服务器返回json格式 {"result":true,"errorMsg":"无"}

	<input type="text" class="input-text input-text-pos website" placeholder="英文或数字（小于20位）" name='doctor[domain_prefix]' maxlength="20" value="{$doctor.domain_prefix}" valid='{"required":true,"regex":"^[A-Za-z0-9]+$"}' msg='{"required":"请填写您想要的域名","regex":"只能包含英文和数字"}'/>

	*/

(function($) {

    $.fn.Qvalidate = function(options){
		var defaults={
			firstError:function(element){//第一个验证不通过处
			  // element.focus();
			  // $("body").animate({ scrollTop: element.offset().top }, 0);

			},
			onError:function(element,msg){//出错回调
			       $(element).addClass("input-error");
				   if($(element)[0].tagName=='SELECT'){
					   //错误控件为select时处理
					  $(element).next().addClass("input-error");
				   };
				   if($(element).attr('contenteditable')){
					   //错误控件为contenteditable时处理
					  $(element).prev().addClass("input-error");
				   };

			},
			onSuccess:function(element,msg){//成功回调
			       $(element).removeClass("input-error");
				   if($(element)[0].tagName=='SELECT'){
					   //错误控件为select时处理
					  $(element).next().removeClass("input-error");
				   };
				   if($(element).attr('contenteditable')){
					   //错误控件为contenteditable时处理
					  $(element).prev().removeClass("input-error");
				   }


			}

		};
		var settings = $.extend(defaults, options);

//		if(options){
//			$.extend(defaults,options);
//		};
		var formObj = $(this);
		var elements = this.find("input,select,textarea,[contenteditable]");

		//递交表单时验证
        $(this).bind('submit', validateAll)


		//验证表单所有控件
		function validateAll(){

			//console.log(formObj)
			var allResult=true;
			var firstError=false;
			//$.each( elements, function(id, element){
				/**
				 * 2015.7.2
				 */
			for(var a=0;a<elements.length;a++){

				//for(var a=elements.length-1;a>-1;a--){
				if (eval("(" +$(elements[a]).attr("valid")+ ")")){//判断是否需要验证该元素

					var method =  eval("(" +$(elements[a]).attr("valid")+ ")");  //获取验证规则
					var errorMsg =  eval("(" +$(elements[a]).attr("msg")+ ")"); //获取验证错误消息

				    //console.log(errorMsg);
					//console.log(validate($(element),method,errorMsg))
					if($(elements[a]).attr("type")=="checkbox"){
						//判断当checkbox时特殊处理

						if(method.required==true){
							chkResult=false;
							//console.log($("[type='checkbox'][name="+$(elements[a]).attr("name")+"]").prop("checked"));
							$.each( $("[type='checkbox'][name='"+$(elements[a]).attr("name")+"']"), function(id, element){
								 if($(element).prop("checked")){
									chkResult=true;
								 }
							});
							if(chkResult==false){
								allResult=false;
								settings.onError(elements[a],errorMsg.required);

							};
						};
						//console.log(allResult);

					}else{
						if(validate($(elements[a]),method,errorMsg)===false){//验证不通过时返回false
							  if(firstError===false){firstError=$(elements[a])} //取得第一个验证不通过的控件
							  allResult=false;
						};
					}

				};
			}
			 //});

			 //滑到第一个错误处触发回调函数
			 if(firstError){
				settings.firstError(firstError);
			 }



			 return allResult;


		}
		$.fn.Qvalidate.valid=validateAll;    //单独方法用于返回验证结果

		//获取需要验证的元素
		//var elements=$(this).find("input,select,textarea");
		//单个控件触发事件时验证
		elements.each(function(){
			if ($(this).metadata({type:"attr",name:"valid"})){//判断是否需要验证该元素
			   var method = eval("(" +$(this).attr("valid")+ ")");
			   var errorMsg = eval("(" +$(this).attr("msg")+ ")"); //获取验证错误消息
			   if($(this).attr('contenteditable')){
					//div编辑器时特殊处理
					$(this).on('blur',function(){
						validate($(this).siblings('input'),method,errorMsg);//验证元素
					})
			   }else{
					$(this).bind('change', function() {
				     validate($(this),method,errorMsg);//验证元素
				    // settings.firstError()
			   		})
			   }


			}


    });

		//具体验证方法
		function validate(element,method,msg){

            settings.onSuccess(element);//去除所有错误效果
	        var result = new Array(); //result数组存放每个验证规则的结果

			for (var key in method ){

			  var rule=method[key]; //验证规则


			  switch(key.toLowerCase()){

				  case "required":  //验证必填


				      msg==null ? errorMsg = "" : errorMsg = msg.required;  //验证错误消息为null时,设为空值

					  if(element.attr("type")== "checkbox"){  //验证控件是checkbox

						 if(element[0].checked==true){
							settings.onSuccess(element,errorMsg);
						    result[key] = true;
					     }else{
							settings.onError(element,errorMsg);
							result[key] = false;

							return false;
						 };

					  }else{//验证控件是输入框或下拉选择器

						 if(element.val() || element.attr("checked")== true){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;

						 }else{//验证失败

							  settings.onError(element,errorMsg);
							  result[key] = false;

							  return false;
						 }



					  }



					  break;
				  case "email":  //验证邮件格式

					  msg==null ? errorMsg = "" : errorMsg = msg.email;  //验证错误消息为null时,设为空值
				      if(element.val()){
						  if (element.val().search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }
					  }
					  break;
				  case "minlength":

					  msg==null ? errorMsg = "" : errorMsg = msg.minLength;  //验证错误消息为null时,设为空值

				      if(element.val()){
						  if (element.val().length>=rule){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }
					  }
					  break;
				  case "maxlength":

					  msg==null ? errorMsg = "" : errorMsg = msg.maxLength;  //验证错误消息为null时,设为空值

				      if(element.val()){
						  if (element.val().length<=rule){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }
					  }
					  break;
				  case "limitlength":

					  msg==null ? errorMsg = "" : errorMsg = msg.limitLength;  //验证错误消息为null时,设为空值

				      if(element.val()){
						  if (element.val().length==rule){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;

							  return false;
						  }
					  }
					  break;
				  case "number":

					  msg==null ? errorMsg = "" : errorMsg = msg.number;  //验证错误消息为null时,设为空

				      if(element.val()){
						  if (element.val().search(/^[0-9]+$/) != -1){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }

					  }
					  break;

				  case "numberrange":

					  msg==null ? errorMsg = "" : errorMsg = msg.numberRange;  //验证错误消息为null时,设为空

				      if(element.val()){

						  if (element.val()>= rule[0] && element.val()<= rule[1]){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }

					  }
					  break;

				  case "chinese":  //验证中文输入

					  msg==null ? errorMsg = "" : errorMsg = msg.chinese;  //验证错误消息为null时,设为空值
				      if(element.val()){
						  if (element.val().search(/^[\u4E00-\u9FA5]{1,100}$/) != -1){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }
					  }
					  break;

				  case "password":  //验证密码输入

					  msg==null ? errorMsg = "" : errorMsg = msg.password;  //验证错误消息为null时,设为空值
				      if(element.val()){
						  if (element.val().search(/^[0-9a-zA-Z\,\.\/\;\'\[\]\=\-\)\(\*\&\^\%\$\#\@\!\`\<\>\?\:\"\}\{\+\_\~\|\\]+$/) != -1){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }
					  }
					  break;
				  case "equalto":

					  msg==null ? errorMsg = "" : errorMsg = msg.equalTo;  //验证错误消息为null时,设为空

				      if(element.val()){
						  if (element.val()==$(rule).val()){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }
					  }
					  break;

				  case "cellphone":

					  msg==null ? errorMsg = "" : errorMsg = msg.cellphone;  //验证错误消息为null时,设为空

				      if(element.val()){
						  var reg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
						  if (reg.test(element.val())==true){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }
					  }
					  break;

				  case "residenceid":

					  msg==null ? errorMsg = "" : errorMsg = msg.residenceID;  //验证错误消息为null时,设为空

				      if(element.val()){

						  if (isIdCardNo(element.val())){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }

					  }
					  break;
				  case "regex":  //正则验证

					  msg==null ? errorMsg = "" : errorMsg = msg.regex;  //验证错误消息为null时,设为空值

					  rule=new RegExp(rule);
				      if(element.val()){
						  if (element.val().search(rule) != -1){//验证成功

							  settings.onSuccess(element,errorMsg);
							  result[key] = true;
						  }else{

							  settings.onError(element,errorMsg);
							  result[key] = false;
							  return false;
						  }
					  }
					  break;
				  case "ajax":

					  //返回json格式 {"result":true,"errorMsg":"无"}
					  result[key] = false;

					  //把传参控件转为字符串
					  inputName="";
					  if(rule.inputName){
					  	for(var k in rule.inputName){
					  			if(!isNaN(k)){
					  				//如果key是数字
					  				inputName += rule.inputName[k] +"="+$("input[name='"+rule.inputName[k]+"']").val()+"&";
					  			} else {
					  				//如果是关联数组
					  				inputName += (rule.inputName[k]?rule.inputName[k]:k) +"="+$("input[name='"+k+"']").val()+"&";
					  			}

					  		}
						 //  $.each( rule.inputName, function(i, n){
							// //  alert( "Name: " + i + ", Value: " + n );
							//  inputName+=n +"="+$("input[name='"+n+"']").val()+"&";
						 //  });
					  }
					  //console.log(inputName);
                      if(rule.data){
						  customerData=rule.data;
					  }else{
				     	  customerData="";
					  };



					  $.ajax({
						   type: "GET",
						   async:false,
						   url: rule.url,
						   data: element.attr("name")+"="+element.val()+"&"+inputName+customerData,
						   dataType:"json",
						   success: function(json){
							 	// console.log(json.result)
							  if(json.result==true || json.result=="true"){

								  settings.onSuccess(element,json.errorMsg);
								  result[key] = true;

							  }else{

								  settings.onError(element,json.errorMsg);
								  result[key] = false;
								  return false;

							  }

						   }
					  });

					  //console.log(element.attr("name")+" inside ajax("+key+") -> "+result[key]);
					  break;
				  case "residenceidsex":

					  msg==null ? errorMsg = "" : errorMsg = msg.residenceIDsex;  //验证错误消息为null时,设为

				      if(element.val()){
					  var value=element.val();
							if (value.length === 18) { //判断18位身份证性别
								if (parseInt(value.substr(-3, 2)) % 2 === 0) {
									  settings.onSuccess(element,errorMsg);
									  result[key] = true;
								}else{
									  settings.onError(element,errorMsg);
									  result[key] = false;
									  return false;
								}
							}
							else if (value.length === 15) {//判断15位身份证性别
								if (parseInt(value.substr(-2, 2)) % 2 === 0) {
									  settings.onSuccess(element,errorMsg);
									  result[key] = true;
								}else{
									  settings.onError(element,errorMsg);
									  result[key] = false;
									  return false;
								}
							}

					  }
					  break;
			//		default:
//				      result["default"] = false;


			    }


			};

			// if(element.attr("name") == 'verifyCode' && key == 'ajax'){
		 //  		console.log(element.attr("name")+" ajax rule end -> "+rule);
		 //  	}
			// console.log(result)

			var singleResult=true;
			//将每条验证结果收集到数组后，统一验证最后结果
			for(var name in result){

			  if (result[name]===false){//有一条验证规则不通过，该控件验证结果失败
               // $(element).data("valid", false);
               	//console.log(element.attr("name")+" outside  " + name +" -> false");
				singleResult=false;
			  }
			};

			//console.log(singleResult)
			return singleResult;


		}



		//检查身份证函数
		function isIdCardNo(num) {

		 var factorArr = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
		 var parityBit=new Array("1","0","X","9","8","7","6","5","4","3","2");
		 var varArray = new Array();
		 var intValue;
		 var lngProduct = 0;
		 var intCheckDigit;
		 var intStrLen = num.length;
		 var idNumber = num;
		   // initialize
			 if ((intStrLen != 15) && (intStrLen != 18)) {

				 return false;
			 }
			 // check and set value
			 for(i=0;i<intStrLen;i++) {
				 varArray[i] = idNumber.charAt(i);
				 if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {

					 return false;
				 } else if (i < 17) {
					 varArray[i] = varArray[i] * factorArr[i];
				 }
			 }

			 if (intStrLen == 18) {
				 //check date
				 var date8 = idNumber.substring(6,14);
				 if (isDate8(date8) == false) {

					return false;
				 }
				 // calculate the sum of the products
				 for(i=0;i<17;i++) {
					 lngProduct = lngProduct + varArray[i];
				 }
				 // calculate the check digit
				 intCheckDigit = parityBit[lngProduct % 11];
				 // check last digit
				 if (varArray[17].toUpperCase() != intCheckDigit) {
					 return false;
				 }
			 }
			 else{        //length is 15
				 //check date
				 var date6 = idNumber.substring(6,12);
				 if (isDate6(date6) == false) {

					 return false;
				 }
			 }
			 return true;

		 }

		function isDate6(sDate) {
		   if(!/^[0-9]{6}$/.test(sDate)) {

			  return false;
		   }
		   var year, month, day;
		   year = "19"+sDate.substring(0, 2);
		   month = sDate.substring(2, 4);
		   if (year < 1700 || year > 2500) return false
		   if (month < 1 || month > 12) return false
		   return true
		}

		function isDate8(sDate) {
		   if(!/^[0-9]{8}$/.test(sDate)) {
			  return false;
		   }
		   var year, month, day;
		   year = sDate.substring(0, 4);
		   month = sDate.substring(4, 6);
		   day = sDate.substring(6, 8);
		   var iaMonthDays = [31,28,31,30,31,30,31,31,30,31,30,31]
		   if (year < 1700 || year > 2500) return false
		   if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1]=29;
		   if (month < 1 || month > 12) return false
		   if (day < 1 || day > iaMonthDays[month - 1]) return false
		   return true
		}



    };



})(jQuery);



(function($) {

$.extend({
	metadata : {
		defaults : {
			type: 'class',
			name: 'metadata',
			cre: /({.*})/,
			single: 'metadata'
		},
		setType: function( type, name ){
			this.defaults.type = type;
			this.defaults.name = name;
		},
		get: function( elem, opts ){
			var settings = $.extend({},this.defaults,opts);
			// check for empty string in single property
			if ( !settings.single.length ) settings.single = 'metadata';

			var data = $.data(elem, settings.single);
			// returned cached data if it already exists
			if ( data ) return data;

			data = "{}";

			if ( settings.type == "class" ) {
				var m = settings.cre.exec( elem.className );
				if ( m )
					data = m[1];
			} else if ( settings.type == "elem" ) {
				if( !elem.getElementsByTagName )
					return undefined;
				var e = elem.getElementsByTagName(settings.name);
				if ( e.length )
					data = $.trim(e[0].innerHTML);
			} else if ( elem.getAttribute != undefined ) {
				var attr = elem.getAttribute( settings.name );
				if ( attr )
					data = attr;
			}

			if ( data.indexOf( '{' ) <0 )
			data = "{" + data + "}";

			data = eval("(" + data + ")");

			$.data( elem, settings.single, data );
			return data;
		}
	}
});

/**
 * Returns the metadata object for the first member of the jQuery object.
 *
 * @name metadata
 * @descr Returns element's metadata object
 * @param Object opts An object contianing settings to override the defaults
 * @type jQuery
 * @cat Plugins/Metadata
 */
$.fn.metadata = function( opts ){
	return $.metadata.get( this[0], opts );
};

})(jQuery);