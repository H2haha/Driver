//调取日历
$("#dtBox").DateTimePicker({
    dateFormat: "yyyy-MM-dd",
    timeFormat: "hh:mm AA",
    dateTimeFormat: "yyyy-MM-dd hh:mm:ss AA"
  
  });

// 司机基本信息
$(function() {
    var userId;
	var driverMsg = localStorage.getItem("driverMsg");
    driverMsg = JSON.parse(driverMsg) == null ? {} : JSON.parse(driverMsg);
    driverMsg.userId = getQueryStr("userId");
//    swal({
//        title: '!!' + driverMsg.userId,
//        type: "warning",
//        confirmButtonColor: "#DD6B55",
//        confirmButtonText: "确定",
//    });
    console.log(driverMsg);
    /*
    ***城市和公司列表初始化，以及根据城市查询公司***
     */
    getOpCity();
    /*getCompany(110000);
    $(".cityId").on("change", function(){
        var cityId = $(this).find('option:selected').attr("value");
        getCompany(cityId);
    });*/

    /*
     ******车辆品牌和型号选择******
     */
    $(".carBrandSelect").on("change", function(){
        var carBrandId = $(this).attr("value");
        getCarModel(carBrandId);
    });
    $(".keydowninput").on('keyup', function() {
    	$(".ulBrand").show();
    	var keyval = $(this).val();
    	$.ajax({
    		type: 'GET',
    		url: ctx +'/dingding-web/jsonpAction!brandbykeys',
    		dataType: 'jsonp',
    		async: false,
            jsonp: "callback",
    		data: {
    			keys: keyval
    		},
    		success: function(data) {
    			console.log(data);
    			var ulModels = {};
    			ulModels.list = data;
    			var ulTpl = document.getElementById("liBrandTpl").innerHTML;
    			var ulModelhtml = juicer(ulTpl, ulModels);
    			$(".ulBrand").html(ulModelhtml);
    		}
    	});
    });
    $(".ulBrand").on('click', 'li', function() {
    	$(".keydowninput").val($(this).text());
    	$(".keydowninput").attr("data-value", $(this).attr("data-value"));
    	getCarModel($(this).attr("data-value"));
    	$(".ulBrand").hide();
    });
    
    $(document).on("click", function() {
    	$(".ulBrand").hide();
    })
	/*
	**字段验证**
	 */
	$("#driver-form").
	bootstrapValidator({
		message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	msg6: {validators: {notEmpty: {message: '不能为空'},regexp: {
    			regexp: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/,message: '车牌号格式不对'}}},//车牌号
        	msg7: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /^[\u4E00-\u9FA5]+$/,message: '只能输入汉字'}}},//车辆颜色
        	msg8: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /^[\u4E00-\u9FA5]+$/,message: '只能输入汉字'}}},//车辆所属
        	msg9: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /^[a-zA-Z0-9]{15,17}$/,message: '格式不正确'}}},//车架号
        	msg10: {validators: {regexp: {regexp: /^\d{12}\b/,message: '12位数字'}}},//网约车许可证
        	msg11: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /^[A-Z0-9]{15,25}$/,message: '格式不正确'}}},//车辆保单单号
        	msg1: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /^[\u4E00-\u9FA5]+$/,message: '只能输入汉字'}}},//姓
        	msg2: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /^[\u4E00-\u9FA5]+$/,message: '只能输入汉字'}}},//名
        	msg3: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message: '请输入正确身份证号码'}}},//身份证号
        	msg4: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /^\d{12}$/,message: '12位数字'}}},//驾驶证档案编号
        	msg5: {validators: {identical: {field: 'msg3',message: '请与身份证号一致'}}},//网约车驾驶员资格证号
            addMsg1: {validators: {notEmpty: {message: '不能为空'}}},//行驶证地址
            addMsg3: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /^[a-zA-Z0-9]{15,17}$/,message: '格式不正确'}}},//车辆识别代码
            addMsg4: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /^[a-zA-Z0-9]{5,20}$/,message: '格式不正确'}}},//发动机号码
            addMsg5: {validators: {notEmpty: {message: '不能为空'},regexp: {regexp: /^[a-zA-Z0-9]{5,20}$/,message: '格式不正确'}}}//行车证档案编号
        }
	});
	/*
	**点击下一步**
	 */
	$(".btn-next").on("click", function() {
		$('#adddriverform').data('bootstrapValidator').validate();  
        if(!$('#adddriverform').data('bootstrapValidator').isValid()){  
            return ;  
        }
        /*司机信息*/
        driverMsg.surname = $(".surname").val();//姓
		driverMsg.lastName = $(".lastName").val();//名
        driverMsg.cityId = $(".cityId").find("option:selected").attr("value");//运营城市
        //driverMsg.organizationId = $(".companyId").find("option:selected").attr("value");//公司
		driverMsg.idCard = $(".idCard").val();//身份证号
		driverMsg.jszFileNumber = $(".jszFileNumber").val();//驾驶证档案编号
		driverMsg.userOperatingPermit = $(".userOperatingPermit").val();//网约车资格证号
		driverMsg.jszLssueDate = $(".jszLssueDate").val();//初领驾驶证日期
		driverMsg.jszValidityPeriod = $(".jszValidityPeriod").val();//驾驶证截止日期
		driverMsg.permittedType = $(".permittedType").find("option:selected").html();//准驾车型
        
        /*车辆信息*/
		driverMsg.vehicleLevelId = $(".vehicleLevelId").find("option:selected").attr("value");//车辆类型--车辆等级
		driverMsg.lisencePlate = $(".lisencePlate").val();//车牌号
        driverMsg.vehicleModel = $('.keydowninput').val();//车辆品牌
        driverMsg.vehicleType = $('.carModelSelect').find('option:selected').html();//车辆型号
		driverMsg.vehicleColor = $(".vehicleColor").val();//车辆颜色
		driverMsg.vehicleOwner = $(".vehicleOwner").val();//车辆所属
		driverMsg.vehicleNumber = $(".vehicleNumber").val();//车架号
		driverMsg.vehicleOperatingPermit = $(".vehicleOperatingPermit").val();//网约车许可证
		driverMsg.vehicleInsurance = $(".vehicleInsurance").val();//车辆保单单号
		driverMsg.xszLssueDate = $(".xszLssueDate").val();//行车本注册日期
		driverMsg.xszVehicleType = $(".addMsg2").find("option:selected").text();//行驶证车辆类型
        driverMsg.xszAddress = $(".addMsg1").val();//行驶证地址
        driverMsg.useNature = $(".addMsg7").find("option:selected").text();//使用性质
        driverMsg.vehicleIdentificationCode = $(".addMsg3").val();//车辆识别代码
        driverMsg.engineNumber = $(".addMsg4").val();//发动机号码
        driverMsg.xszFileNumber = $(".addMsg5").val();//行驶证档案编号
        driverMsg.xszCertificationDate = $(".addMsg6").val();//行车证发证日期
        
        console.log(driverMsg.vehicleType);
        
        if(driverMsg.jszLssueDate.length < 5) {
            swal({
                title: '请选择初领驾驶证日期',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.jszValidityPeriod.length < 5) {
            swal({
                title: '请选择驾驶证截止日期',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.xszLssueDate.length < 5) {
            swal({
                title: '请选择行车本注册日期',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.xszCertificationDate.length < 5) {
            swal({
                title: '请选择行车证发证日期',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.vehicleType == '请选择车辆品牌' || driverMsg.vehicleType == undefined) {
            swal({
                title: '请输入首字母选择车辆品牌',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else {
            driverMsg = JSON.stringify(driverMsg);
            localStorage.setItem("driverMsg", driverMsg);

            window.location.href = 'driverMsg2.html';
        }
	})
    //获取车辆类型
    function getCarModel(carBrandId) {
    	$.ajax({
    		type: 'GET',
    		url: ctx + '/dingding-web/jsonpAction!model',
    		dataType: 'jsonp',
    		async: false,
            jsonp: "callback",
    		data: {
    			id: carBrandId
    		},
    		success: function(data) {
    			var carModels = {};
    			carModels.list = data;
    			var carModelTpl = document.getElementById("carModelSelectTpl").innerHTML;
    			var carModelhtml = juicer(carModelTpl, carModels);
    			$(".carModelSelect").html(carModelhtml);
    		}
    	});
    }

})
//获取城市列表方法
function getOpCity() {
    $.ajax({
        type: "post",
        url: ctx+"/dingding-web/cityAction!getCityList.action",
        dataType: "jsonp",
        async: false,
        jsonp: "callback",
        data: {
        },
        success:function(data){
            var optionHtml = '';
            for(var i in data.responseBody) {
                optionHtml += "<option value="+data.responseBody[i].cityId+">"+data.responseBody[i].cityName+"</option>";
            }
            console.log(optionHtml);
            $(".cityId").html(optionHtml);
        }
    });
}
//获取公司列表
function getCompany(cityNo) {
    $.ajax({
        type: "post",
        url: ctx+"/dingding-web/companyAction!getCompanyList.action",
        dataType: "jsonp",
        async: false,
        jsonp: "callback",
        data: {
            cityId:cityNo
        },
        success:function(data){
            console.log(data);
            var optionHtml = '';
            for(var i in data.responseBody) {
                optionHtml += "<option value="+data.responseBody[i].organizationId+">"+data.responseBody[i].organizationName+"</option>";
            }
            $(".companyId").html(optionHtml);
        }
    }); 
}    
//照片信息  

$(function() {
    

    var driverMsg = localStorage.getItem("driverMsg");
    driverMsg = JSON.parse(driverMsg);

    console.log(driverMsg);

    //driverMsg.userId = 'a46f1cca-1f9a-4347-9085-6cd75cee906f';//userId--用户id
    driverMsg.authType = 2;//专车
    driverMsg.channelId = -2;//app渠道
    /*
    **提交审核**
     */
    $(".btn-exam").on('click', function() {
        /*
        **获取图片字段**iCardUserImage
         */
        driverMsg.idCardPositiveImage = $(".imgBox1").attr("data-value");//身份证正面
        driverMsg.idCardOppositeImage = $(".imgBox2").attr("data-value");//身份证反面
        driverMsg.idCardUserImage = $(".imgBox3").attr("data-value");//手持身份证正面
        driverMsg.jszImage = $(".imgBox4").attr("data-value");//驾驶本正本
        driverMsg.jszCopyImage = $(".imgBox5").attr("data-value");//驾驶本副本
        driverMsg.userOperatingPermitImg = $(".imgBox6").attr("data-value");//网约车资格证
        driverMsg.xszImage = $(".imgBox7").attr("data-value");//行驶本正本
        driverMsg.xszCopyImage = $(".imgBox8").attr("data-value");//行驶本副本
        driverMsg.vehicleInsuranceImg = $(".imgBox9").attr("data-value");//车辆保单照片
        driverMsg.vehicleOperatingPermitImg = $(".imgBox10").attr("data-value");//网约车许可证
        driverMsg.vehicleImage = $(".imgBox11").attr("data-value");//车辆照片
        console.log(driverMsg);

        if(driverMsg.idCardPositiveImage.length < 5) {
            swal({
                title: '请上传身份证正面',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.idCardOppositeImage < 5) {
            swal({
                title: '请上传身份证反面',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.idCardUserImage < 5) {
            swal({
                title: '请上传手持身份证正面',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.jszImage < 5) {
            swal({
                title: '请上传驾驶本正本',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.jszCopyImage < 5) {
            swal({
                title: '请上传驾驶本副本',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.xszImage < 5) {
            swal({
                title: '请上传行驶本正本',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.xszCopyImage < 5) {
            swal({
                title: '请上传行驶本副本',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.vehicleInsuranceImg < 5) {
            swal({
                title: '请上传车辆保单照片',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else if(driverMsg.vehicleImage < 5) {
            swal({
                title: '请上传车辆照片',
                type: "warning",
                confirmButtonColor: "#DD6B55",
               confirmButtonText: "确定",
            });
        }
        else {
            commitGoToEaxm();
        }
    });

    /*
     ******上传图片******
     */
    $(".imgInp").change(function(){
        var uploadPicUserId = driverMsg.userId;
        readURL(this,$(this).attr("data-value"),uploadPicUserId);
    });
    function uploadImage(srcImage, n, userId) {
        $(".imgBox"+n).attr("data-value",'');
        $.ajax({
            type: 'POST',
            url: ctx+'/dingding-web/driverAction!uploadDriverAuthImage.action',
            dataType: 'jsonp',
//            async: false,
            jsonp: "callback",
            data: {
                uploadPictures: srcImage,
                userId: userId
            },
            beforeSend:function(){
                $(".progress-bar" + n).attr("aria-valuenow", '0');
                $(".progress-bar" + n).css({width: '20%',color: '#000'});
                $(".progress-bar" + n).html('上传中..');
            },
            success: function(data) {
                console.log(data);
                if(typeof(data) == null || data == '' || data == undefined) {
                    $(".progress-bar" + n).attr("aria-valuenow", '100');
                    $(".progress-bar" + n).css({width: '100%'});
                    $(".progress-bar" + n).html('图片过大，上传失败，请重新上传'); 
                    $(".imgBox"+n).attr("data-value",'');
                }
                else {
                    $(".imgBox"+n).attr("data-value",data.responseBody.imageName);
                    $(".progress-bar" + n).attr("aria-valuenow", '100');
                    $(".progress-bar" + n).css({width: '100%'});
                    $(".progress-bar" + n).html('上传成功');
                }
                
            }
        });
    }
    
    function readURL(input,n,userId) {
        var fileName = $(".imgInp"+n).val();
        var suffixIndex=fileName.lastIndexOf(".");  
        var suffix=fileName.substring(suffixIndex+1).toUpperCase();  
        if(suffix!="BMP"&&suffix!="JPG"&&suffix!="JPEG"&&suffix!="PNG"&&suffix!="GIF"){  
            alert("请上传图片");
        }
        else {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                console.log(input.files[0]);
                var size = input.files[0].size;//读到的图片的字节数
                if(size <= 879394) {
//                  swal({
//                        title: '图片大小'+size,
//                        type: "warning",
//                        confirmButtonColor: "#DD6B55",
//                       confirmButtonText: "确定",
//                    });
                    reader.onload = function (e) {
                        
                        $('#blah'+n).attr('src', e.target.result);
                        uploadImage($('#blah'+n).attr('src'), n, userId);
                    }
                    reader.readAsDataURL(input.files[0]);
                }
                else {
//                  swal({
//                        title: '图片过大'+size,
//                        type: "warning",
//                        confirmButtonColor: "#DD6B55",
//                       confirmButtonText: "确定",
//                    });
                    var imageUrl = getObjectURL(input.files[0]);
                    console.log(imageUrl);
                    convertImgToBase64(imageUrl, function(base64Img){
                        $('#blah'+n).attr('src', base64Img);
                        uploadImage($('#blah'+n).attr('src'), n, userId);
                    });
                    event.preventDefault();
                }
                
            }
        }
    };
    
    function convertImgToBase64(url, callback, outputFormat){ 
        var canvas = document.createElement('CANVAS'); 
        var ctx = canvas.getContext('2d'); 
        var img = new Image; 
        img.crossOrigin = 'Anonymous'; 
        img.onload = function(){
          var width = img.width;
          var height = img.height;
          // 按比例压缩4倍
          var rate = (width<height ? width/height : height/width)/4;
          canvas.width = width*rate; 
          canvas.height = height*rate; 
          ctx.drawImage(img,0,0,width,height,0,0,width*rate,height*rate); 
          var dataURL = canvas.toDataURL(outputFormat || 'image/png'); 
          callback.call(this, dataURL); 
          canvas = null; 
        };
        img.src = url; 
      }

       function getObjectURL(file) {
            var url = null ; 
            if (window.createObjectURL!=undefined) {  // basic
              url = window.createObjectURL(file) ;
            } else if (window.URL!=undefined) {       // mozilla(firefox)
              url = window.URL.createObjectURL(file) ;
            } else if (window.webkitURL!=undefined) { // web_kit or chrome
              url = window.webkitURL.createObjectURL(file) ;
            }
            return url ;
      }

    //提交认证
    function commitGoToEaxm() {
        $.ajax({
            type: "POST",
            url: ctx+"/dingding-web/driverAction!driverAuth.action",
            dataType: "jsonp",
            async: false,
            jsonp: "callback",
            jsonpCallback: "success_jsonp",
            data: driverMsg,
            success: function(data){
                console.log(data);
                if(data.code == 400) {
                    swal({
                      title: "参数异常",
                      type: "warning",
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "确定",
                  });
                }
                else if(data.responseBody.code == 200) {//提交资料成功
                    window.location.href = 'checking.html';
                }
                else {
                    swal({
                      title: data.responseBody.message,
                      type: "warning",
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "确定",
                  });
                }
//                if(data.responseBody.code == 614) {//审核通过成为专车车主
//                    window.location.href = 'success.html';
//                }
//                if(data.responseBody.code == 613) {//信息处于审核中
//                    window.location.href = 'checking.html';
//                }
//                if(data.responseBody.code == 616) {//该身份证已被注册
//                    swal({
//                    title: '该身份证已被注册,请重新填写',
//                    type: "warning",
//                    confirmButtonColor: "#DD6B55",
//                    confirmButtonText: "确定",
//                });
//                }
//                if(data.responseBody.code == 617) {//该车牌号已被注册
//                    swal({
//                    title: '该车牌号已被注册,请重新填写',
//                    type: "warning",
//                    confirmButtonColor: "#DD6B55",
//                    confirmButtonText: "确定",
//                });
//                }
//                if(data.responseBody.code == 400) {//参数异常
//                    swal({
//                    title: '参数异常',
//                    type: "warning",
//                    confirmButtonColor: "#DD6B55",
//                    confirmButtonText: "确定",
//                });
//                }
            }
        });
    }

})



