/**
 * 引用此js在页面加入${titanUtils}
 * 
 * 狱政公用js
 * 
 */
function titanCommon(){
	var me=this;
	/**
	 * 创建JqGrid列表
	 * tableId:创建列表id,colNames:colNames,colModel:colModel,url:访问url,
			pagerId:分页绑定id,title:显示标题
	 */
	me.createJqGrid=function(options){
		var defaults ={datatype:"json",mtype: "GET",height:document.body.clientHeight-270,autowidth: false,
				width:document.body.clientWidth-45, multiselect: true,postData:{},
				viewrecords: true,gridview: true,autoencode: true,
				rowNum: 10,rowList: [10, 20, 30],sortname:"gmtCreate",sortorder:"desc"
		};
		//装配默认参数
		options = $.extend(defaults, options);
		if(options.url){
			options.url=contextPath + options.url;
		}
		options.pager=options.pagerId;
		options.caption=options.title;
		var tempList = $(options.tableId).jqGrid(options);
		return tempList;
	};
	/**
	 * 绑定检索事件
	 * options {retrieveId:检索按钮id,list:检索列表,searchInput:关键字搜索框id}
	 */
	me.initRetrieve=function(options){
		$(options.retrieveId).click(function(){
			$(options.searchInput).val("");
			options.list.jqGrid("setGridParam", {
				postData: {filters:{}}
			});
			options.list.jqGrid('searchGrid', {multipleSearch:true,drag:false,searchOnEnter:true,top:150,left:200,
				onSearch: FieldtypeAddtionerFactory.create(options.list).search});
		});
	};
	/**
	 * 绑定新增事件
	 * addBtnId:新增按钮
	 */
	me.initAdd=function(addBtnId){
		$(addBtnId).click(function(){
			changeEditForm(true);
			showCommonDetailWindow("add");
			//必须业务实现该方法
			initAdd();
		});
	}
	/**
	 * 初始化编辑
	 * options {showEditId:编辑按钮,list:选择列表,url:数据回显调用路劲,pageData:页面使用参数（用于业务逻辑）,
	 * timeValidate:me.timeValidate(id,options)   时间校验方法，提供了通用方法，也可以自己实现
	 * }
	 */
	me.initEdit=function(options){
		$(options.showEditId).click(function(){
			var ids = options.list.jqGrid ('getGridParam', 'selarrrow');
			if(ids.length != 1){
				toastr.warning("选择一条要编辑的数据!");
				return;
			}
			if(options.timeValidate){//相差天数校验
				var isCoun = options.timeValidate(ids,options);
				if(!isCoun){
					return;
				}
			}
			PlatformUI.ajax({
				url: contextPath + options.url+"/" + ids[0],
				afterOperation: function(data, textStatus,jqXHR){
					changeEditForm(true);
					showCommonDetailWindow('edit',data,options.pageData);
				}
			});
		});
	}
	//时间校验
	me.timeValidate = function(ids,options){
		var r = true;
		$.ajax({
			url: contextPath + options.url+"/timeValidate",
			type: "get",
			data: {ids:ids},
			async:false,
			success: function(data){
				if(data && data.statusCode == 2){
					toastr.warning(data.statusText);
					r =  false;
				}
			}
		});
		return r;
	}
	
	
	/**
	 * 初始化查看
	 * options {showViewId:查看按钮,list:选择列表,url:数据回显调用路劲}
	 */
	me.initView=function(options){
		$(options.showViewId).click(function(){
			var ids = options.list.jqGrid ('getGridParam', 'selarrrow');
			if(ids.length != 1){
				toastr.warning("选择一条要查看的数据!");
				return;
			}
			PlatformUI.ajax({
				url: contextPath + options.url+"/" + ids[0],
				afterOperation: function(data, textStatus,jqXHR){
					showCommonDetailWindow('view',data);
					changeEditForm(false);
				}
			});
		});
	}
	/**
	 * 初始化删除(仅支持简单标准化删除方式)
	 * options {showDelId:删除按钮,list:选择列表,url:删除调用路劲,sortname:刷新排序列,allowDel:['节点名称'],validateFunction:额外的验证
	 * timeValidate:me.timeValidate(id,options)   时间校验方法，提供了通用方法，也可以自己实现
	 * }
	 */
	me.initDelete=function(options){
		$(options.showDelId).click(function(){
			var ids = options.list.jqGrid ('getGridParam', 'selarrrow');
			if(ids.length == 0){
				toastr.warning("请至少选择一条要删除的数据!");
				return;
			}
			if(options.timeValidate){//相差天数校验
				var isCoun = options.timeValidate(ids,options);
				if(!isCoun){
					return;
				}
			}
			if(options.validateFunction){//额外的验证
				var isCoun = options.validateFunction(ids);
				if(!isCoun){
					return;
				}
			}
			//这里只针对流程，如果流程删除对流程节点有限制，那么请配置对应可以删除的节点的名称
			if(typeof options.allowDel !="undefined"){
				for(var index in ids){
					var rowData = options.list.getRowData(ids[index]);
					var processState = rowData.processState;
					if(options.allowDel.indexOf(processState) == -1){
						var msg = "["+options.allowDel.join("]、[")+"]";
						toastr.warning("只允许删除"+msg+"的数据!");
						return;
					}
				}
			}
			//批量删除ajax
			$.messager.confirm('操作','请确认删除数据',function(r){
				if (r){
					PlatformUI.ajax({
						url: contextPath + options.url,
						type: "post",
						data: {_method:"delete",ids:ids},
						afterOperation: function(){
							PlatformUI.refreshGrid(options.list, {sortname:options.sortname,sortorder:"desc"});
						}
					});
				}
			});
		});
	}
	
	/**
	 * 初始化删除(仅支持简单标准化删除方式)
	 * options {showExportId:删除按钮,list:选择列表,url:删除调用路劲,allowExport:['节点名称']}
	 */
	me.initExportApprovalForm=function(options){
		$(options.showExportId).click(function(){
			var ids = options.list.jqGrid ('getGridParam', 'selarrrow');
			if(ids.length != 1){
				toastr.warning("选择一条要导出的数据!");
				return;
			}
			var rowData = options.list.getRowData(ids[0]);
			if(typeof options.allowExport !="undefined"){
				for(var index in ids){
					var rowData = options.list.getRowData(ids[index]);
					var processState = rowData.processState;
					if(options.allowExport.indexOf(processState) == -1){
						var msg = "["+options.allowDel.join("]、[")+"]";
						toastr.warning("只能导出["+msg+"]的数据!");
						return;
					}
				}
			}
			
			var form = $(document.createElement('form')).attr('action',contextPath + options.url)
		    .attr('method','get').css("display", "none");
			$('body').append(form);
			$(document.createElement('input')).attr('type', 'hidden').attr('name','id').attr('value', ids[0]).appendTo(form);
			$(form).submit();
		});
	}
	/**
	 * 格式化刑期
	 */
	me.formatterXq=function(value){
		if(value){
			if(value.length==6){
				var year = value.substr(0,2);
				var month = value.substr(2,2);
				var day = value.substr(4);
				return parseInt(year)+"年"+parseInt(month)+"月"+parseInt(day)+"天";
			}else{
				return value;
			}
		}else{
			return "";
		}
	};
	/**
	 * divId：表单id，attachId：绑定附件id，businessId：业务id，buttonAuthority:附件权限
	 * 创建附件组件
	 * options{divId:'#commonDetail',attachId:'#demo_attach',businessId:'123',buttonAuthority:buttonAuthority}
	 */
	me.loadAttchment=function(options){
		var width = $(options.divId).innerWidth()-40;
		var height = $(options.divId).innerHeight()-55;
		var attachment = $(options.attachId).attachment({
			businessId:options.businessId,
			width:width,
			height:height,
			/*按钮权限*/
			buttonAuthority:options.buttonAuthority
		});
		var attachmentJqgrid = attachment.getJqgrid();
		attachmentJqgrid.setGridHeight(height-150);
	};
	/**
	 * 初始化切换tab方法
	 * options {listTabIds:所有列表id数组,sortname:排序列}
	 */
	me.initChangeTab = function(options){
		//首次进入初始化
		$(".tabBtn:first").addClass("act");
		$("#gridContainer .dataGrid").hide();
		me.showDataGrid({index:0,listId:$(".tabBtn:first").attr("tabPoint"),sortname:options.sortname});
		//绑定点击事件
		$(".tabBtn").click(function(){
			$(".tabBtn").removeClass("act");
			$(this).addClass("act");
			var index = $(this).index();
			var name=$(this).attr("tabPoint");
			$("#gridContainer .dataGrid").hide();
			me.showDataGrid({index:index,listId:name,sortname:options.sortname});
		});
	}
	/**
	 * 切换tab页
	 * options {index:页面排序号, listId:列表id,sortname:列表排序列}
	 */
	me.showDataGrid = function (options){
		$("#gridContainer .dataGrid[tabPoint='"+options.listId+"']").show();
		$("#"+options.listId).jqGrid('setGridWidth', document.body.scrollWidth-30);
		PlatformUI.refreshGrid($("#"+options.listId), {sortname:options.sortname,sortorder:"desc",datatype:"json"});
	};
	/**
	 * 普通框体查询（只针对罪犯的姓名、编号简单或者自定义列的简单查询，若需要复杂查询自己单独写）
	 * options {list:查询列表,searchInputId:查询框id,prefix:罪犯实体前缀,conditionName:指定的查询列,指定conditionName之后将不做罪犯查询}
	 */
	me.commonInputSearch = function (options){
		var commonSearchInputValue = $(options.searchInputId).val();
		var rules = [];
		if(commonSearchInputValue != ""){
			if(options.conditionName){
				rules.push({"field":options.conditionName,"op":"cn","data":commonSearchInputValue});
			}else{
				var paramArr = commonSearchInputValue.split(",");
				$.each(paramArr,function(index,row){
					rules.push({"field":options.prefix+".xm","op":"cn","data":commonSearchInputValue});
					rules.push({"field":options.prefix+".zfbh","op":"cn","data":commonSearchInputValue,"groupOp": "OR"});
				});
			}
		}
		var filters = {"groupOp":"AND","rules":rules};
		options.list.jqGrid("setGridParam", {
			postData: {filters:JSON.stringify(filters)},
			page: 1
		}).trigger("reloadGrid");
	};
	/**
	 * 刷新（不刷新页面，只刷新列表）
	 * options {buttonId:按钮id,list:查询列表,searchInputId:查询框id,addHandle:额外的操作}
	 */
	me.commonRefresh = function (options){
		$(options.buttonId).click(function(){
			if(options.addHandle){//执行额外的操作
				options.addHandle();
			}
			$(options.searchInputId).val("");
			options.list.jqGrid("setGridParam", {
				postData: {filters:{}},
				page: 1
			}).trigger("reloadGrid");
		});
	};
	/**
	 * 绑定保存按钮(使用此方法需要在页面上引入$(serializejson)序列化表单json格式)
	 * options {windowId:窗口id,buttonId:绑定按钮id,formId:表单id,url:保存地址,list:列表,sortname:排序字段,
	 * paramFunction:获取外部参数的方法,validateFunction:额外的验证方法}
	 */
	me.initSave = function(options){
		$(options.buttonId).click(function(){
			//校验重复提交
			if(typeof _SUBMIT_STATUS !="undefined" && _SUBMIT_STATUS == 1){
				toastr.warning("正在提交中，请不要重复提交");
				return;
			}
			if(me.formIsValid(options.formId)){//验证
				if(options.validateFunction){//额外的验证
					var isCoun = options.validateFunction();
					if(!isCoun){
						return;
					}
				}
				_SUBMIT_STATUS = 1;
				var id=$(options.formId+" #id").val();
				var params = $(options.formId).serializeJSONData();
				if(options.paramFunction){
					var fparam=options.paramFunction();
					params=$.extend(params,fparam);
				}
				if(id){
					//ajax更新
			 		params._method="put";
			 		PlatformUI.ajax({
			 			url: contextPath + options.url+"/" + id,
			 			type: "post",
			 			data: params,
						afterOperation: function(data, textStatus,jqXHR){
							if(data.statusCode == 0){
								if(options.successCallBack){
									options.successCallBack();
								}
								PlatformUI.refreshGrid(options.list, {
									sortname:options.sortname,
									sortorder:"desc",
									page:options.list.jqGrid("getGridParam").page
								});
								$(options.windowId).window('close');
							}
							_SUBMIT_STATUS = 0;
						}
			 		});
				}else{
					//ajax保存
					PlatformUI.ajax({
						url: contextPath + options.url,
						type: "post",
						data: params,
						afterOperation: function(data, textStatus,jqXHR){
							if(data.statusCode == 0){
								if(options.successCallBack){
									options.successCallBack();
								}
								PlatformUI.refreshGrid(options.list, {sortname:options.sortname,sortorder:"desc"});
								$(options.windowId).window('close');
							}
							_SUBMIT_STATUS = 0;
						}
					});
				}
		 	}else{
		 		toastr.warning("表单验证失败");
		 	}
		});
	};
	/**
	 * 绑定重置按钮(对于新增表单清空数据，对于编辑表单回到回显状态数据)
	 * options {buttonId:绑定按钮id,formId:表单id,url:获取后端数据地址,pageData:页面参数（用于页面逻辑）}
	 */
	me.initReset = function(options){
		$(options.buttonId).click(function(){
			var id=$(options.formId+" #id").val();
			$(options.formId).form("clear");
			$(options.formId).find("input:hidden").val("");
			if(id){
				PlatformUI.ajax({
					url: contextPath + options.url+"/" + id,
					afterOperation: function(data, textStatus,jqXHR){
						reviewData(data,options.pageData);//自定义js回显数据方法
					}
				});
			}else{
				//必须业务实现该方法
				initAdd();
			}
		});
	};
	/**
	 * 公用弹窗
	 * options {formId:表单id,windowId:弹窗id,windowParam:{弹窗参数},data:回显数据,pageData:页面参数（用于页面逻辑）}
	 * 
	 * 附件参数 attachParam:{title:附件tab标题,type:展示类型(view,edit),formTabsId:切换tab父id,attachId:'#demo_attach',
	 * businessId:'123',buttonAuthority:权限(大于type)}
	 * 
	 * 罪犯选择框参数 criminalParam:{divID:绑定id,isEdit:是否可编辑,isDataAuthority:是否加权限,rowData:回显数据,postData:过滤参数,select:选中事件}
	 */
	me.showCommonDetailWindow = function(options,attachParam,criminalParam){
		//表单重置
		$(options.formId).form("clear");
		$(options.formId+" #id").val("");
		//弹窗展示
		var defaultWin={title:"详细信息",width:$(window).width()*0.6,height:$(window).height()*0.5,
			    modal:true,minimizable:false,collapsible:false,resizable:false,maximizable:true};
		
		
		var attchmentOptions;
		if(attachParam){
			//附件参数装配
			var attchmentOptions={divId:options.windowId,attachId:attachParam.attachId};
			if(attachParam.buttonAuthority){
				attchmentOptions.buttonAuthority=attachParam.buttonAuthority;
			}else{
				if(attachParam.type == "view"){
					attchmentOptions.buttonAuthority = ['download','batchDownload','showFile'];
				}else{
					attchmentOptions.buttonAuthority = ['upload','download','batchDownload','showFile','batchDelete','delete'];
				}
			}
			attchmentOptions.businessId="";
			
			//有附件情况下，弹窗参数变化
			defaultWin=$.extend(defaultWin,{
							onMaximize:function(){//最大化
					    	$(attachParam.formTabsId).css("width", "100%");  
					    	$(attachParam.formTabsId+" div[class^='tabs'],[class^='panel-body']").css("width", "auto");
					    	me.loadAttchment(attchmentOptions);//附件操作
					    },
					    onRestore:function(){//还原
					    	me.loadAttchment(attchmentOptions);//附件操作
					    },
					    onOpen:function(){
					    	$(attachParam.formTabsId).tabs("select",0);
					    }});
			
		};
		var finalWin=$.extend(defaultWin,options.windowParam);
		$(options.windowId).show();
		$(options.windowId).window(finalWin);
		//填充字段信息
		if(options.data){
			reviewData(options.data,options.pageData);//调用自定义js回显方法
		};
		//附件参数判断
		if(attchmentOptions){
			$(".window-shadow").hide();
			$(attachParam.formTabsId).tabs({
			    border:false,
			    onSelect:function(title){
			    	var id = $("#id").val();
			    	if(title == attachParam.title){
			    		if(id == null || id == ''){
			    			$(attachParam.formTabsId).tabs("select",0);
			    			toastr.warning("请先保存业务表单!");
			    		}else{
			    			attchmentOptions.businessId=id;
			    			me.loadAttchment(attchmentOptions);
			    		}
			    	}
			    }
			});
		};
		//判断是否加载罪犯选择组件
		if(criminalParam){
			//设置默认参数
			var rules = [];
//			rules.push({"field":"baseInfo.ZFZT_CODE","op":"eq","data":"code_zfzt_1"});
			var filters = {"groupOp":"AND","rules":rules};
			var defaultCriminal={isEdit:true,isDataAuthority:true,divID:"criminal_detail",postData: {filters:JSON.stringify(filters)}};
			var finalCriminal=$.extend(defaultCriminal,criminalParam);
			if(!finalCriminal.rowData.zfbh){
				delete finalCriminal.rowData;
			}
			$(".destoryForm").remove();
			criminalinfo= $("#"+finalCriminal.divID).chooseCriminal(finalCriminal);
		};
	};
	/**
	 * 公用导出数据方法
	 * url :访问路径
	 * method:访问方法，默认get
	 * param :{name:value}需要传入参数
	 */
	me.exportCommon = function(url,method,param){
		var finalMethed=method?method:'get';
		var form = $(document.createElement('form')).attr("id", "common_downloadForm")
    	.attr('action', url )
        .attr('method',finalMethed).css("display", "none");
		$('body').append(form);
		if(param){
			for(var key in param){
				$(document.createElement('input')).attr('type', 'hidden').attr('name',key).attr('value', param[key]).appendTo(form);
			}
		}
		$(form).submit();
	}
	
	/**
	 * 表单验证，校验不通过时获取焦点
	 * 使用时，无论是text，还是combo类型，class都必选设置为easyui-validatebox，并且data-options需要设置required:true
	 * isVisible:是否只校验显示的组件
	 */
	me.formIsValid = function(formId,isVisible){
		var flag = true;
		isVisible = isVisible==undefined ? false: isVisible;
		var _selectorValue = ".easyui-validatebox";
		if(isVisible){
			_selectorValue+=":visible";
		}
		$(formId).find(_selectorValue).each(function(index, e){
			if(!$(e).validatebox("isValid")){
				flag = $(e).validatebox("isValid");
				
				//判断是否为combo类型
				if($(e).attr("comboname") != null){
					
					//判断是否为combobox，否则即为combotree
					if($(e).hasClass("combobox-f")){
						if(me.comboboxIsValid($(e).attr("comboname"))){
							flag = true;
						}else{
							return false;
						}
					}else{
						if(me.combotreeIsValid([$(e).attr("comboname")])){
							flag = true;
						}else{
							return false;
						}
					}
				}else{
					e.focus();
					return false;
				}
			}
		});
		return flag;
	}
	
	/**
	 * 校验combotree类型，校验不通过时获取焦点
	 */
	me.combotreeIsValid = function(combotreeId){
		var flag = true;
		var _combotreeId = "#"+combotreeId;
		var _value = $(_combotreeId).combotree("getValue");
		if(_value == null || _value == ""){
			$(_combotreeId).combotree().next("span").find("input").focus();
			$(_combotreeId).combotree("showPanel");
			flag = false;
		}
		return flag;
	}
	
	/**
	 * 校验combobox类型，校验不通过时获取焦点
	 */
	me.comboboxIsValid = function(comboboxId){
		var flag = true;
		var _comboboxId = "#"+comboboxId;
		var _value = $(_comboboxId).combobox("getValue");
		if(_value == null || _value == ""){
			$(_comboboxId).combobox().next("span").find("input").focus();
			$(_comboboxId).combobox("showPanel");
			flag = false;
		}
		return flag;
	}
	
	//form表单序列化为json对象
	$.fn.serializeJSONData = function(){
		me.initComboData(this.attr("id"));
		
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name]) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	}
	
	//初始化combotree以及combobox对应text的值
	me.initComboData = function(formId){
		//处理combotree
		$("#"+formId+" .combotree-f").each(function(){
			var _id = $(this).attr("id");
			var _name = _id.substr(0,_id.length-getLastHump(_id).length)+"Name";
			var _text = $("#"+_id).combotree("getText");
			$("#"+_name).val(_text);
		});
		//处理combobox
		$("#"+formId+" .combobox-f").each(function(){
			var _id = $(this).attr("id");
			var _name = _id.substr(0,_id.length-getLastHump(_id).length)+"Name";
			var _text = $("#"+_id).combobox("getText");
			$("#"+_name).val(_text);
		});
	}
	
	//序列化带有combobox和combotree的form表单，防止出现Name字段为code值的问题
	me.serializeComboData = function(formId){
		me.initComboData(formId);
		return $("#"+formId).serialize();
	}
	
	
	
	/**
	 * 字符串为驼峰标识(得到最后一个驼峰的字符串:例如:aaBbCc:得到的是Cc)
	 */
	var getLastHump = function(humpCharacters){
		var lastHumpCharacter = "";
		if(humpCharacters != undefined && humpCharacters != null && humpCharacters.length != 0){
			for(var i=(humpCharacters.length-1);i>=0;i--){
				var character = humpCharacters.charAt(i);
				if(character<'A' || character>'Z'){
					lastHumpCharacter = character+lastHumpCharacter;
					
				}else{
					lastHumpCharacter = character+lastHumpCharacter;
					return lastHumpCharacter;
				}
			}
		}
		return "";
	}
	
	//扩展添加序列化combodata的特殊方法
	$.fn.extend({
		serializeComboData:function(){
			var _formId = this.attr("id");
			return me.serializeComboData(_formId);
		}
	});
	
	/**
	 * 填充数据到对应的form表单（有其它复杂类型填充要求可以自行增加，但是要考虑通用性）
	 * 通过Name匹配进行填充
	 * 支持combobox、combotree以及时间（要求使用WdatePicker,默认格式为yyyy-MM-dd）填充
	 * 支持多重对象嵌套填充表单
	 * 例如：
	 * var data = {id:"11",baseInfo:{id:"22",name:"罪犯"}};
	 * 表单里面如下即可正常填充baseInfo的值
	 * <input type='text' name='baseInfo.name'>
	 * @param formId
	 * @param data
	 * @param parentKey
	 * @returns
	 */
	me.fillDataToForm = function(formId,data,parentKey){
		for(var _key in data){
			var _inputKey = _key;
			if(typeof parentKey !="undefined"){
				_inputKey=parentKey+"."+_inputKey;
			}
			if(typeof data[_key] != "object"){
				var _jObj = $(formId+" input[name='"+_inputKey+"'],textarea[name='"+_inputKey+"']");
				//判断是否匹配到元素
				if(_jObj.length == 0){
					continue;
				}
				var _value = data[_key];
				if(_value!=null && $.trim(_value) !=""){
					//判断是否是combobox或者combotree
					if(_jObj.hasClass("textbox-value")){
						var _comboObj = _jObj.parent().prev();
						var _comboObjId = _comboObj.attr("id");
						if(_comboObj.hasClass("combobox-f")){
							$("#"+_comboObjId).combobox("setValue","");
							$("#"+_comboObjId).combobox("setValue",_value);
						}else if(_comboObj.hasClass("combotree-f")){
							$("#"+_comboObjId).combotree("setValue","");
							$("#"+_comboObjId).combotree("setValue",_value);
						}else if(_comboObj.hasClass("numberspinner-f")){
							$("#"+_comboObjId).numberspinner("clear");
							$("#"+_comboObjId).numberspinner("setValue",_value);
						}else if(_comboObj.hasClass("numberbox-f")){
							$("#"+_comboObjId).numberbox("clear");
							$("#"+_comboObjId).numberbox("setValue",_value);
						}
					}else{
						//日期类型为长整型，所有判断如果为数字类型才做转换
						if(typeof _value =="number"){
							//判断是否是时间选择框,默认格式化成yyyy-MM-dd
							var _wdateFunction = _jObj.attr("onclick") != null ? _jObj.attr("onclick"):_jObj.attr("onfocus");
							if( _wdateFunction!=null && _wdateFunction.indexOf("WdatePicker") > -1){
								if(_wdateFunction.indexOf("dateFmt")>-1){
									var dfmStr = _wdateFunction.substring(_wdateFunction.indexOf("dateFmt"));
									var pattern = dfmStr.match(/'([^']*)'/)[0];
									pattern=pattern.replace(/H/g,"h").replace(/\'/g,"");
									_value = ExtendDate.getFormatDateByLong(_value,pattern);
								}else{
									_value = ExtendDate.getSmpFormatDateByLong(_value,false);
								}
							}
						}
						_jObj.val(_value);
					}
				}
			}else if(!$.isArray(data[_key])){
				this.fillDataToForm(formId,data[_key],_key);
			}
		}
	}
	
	/**
	 * 公用只读方法
	 * 对于日期类型、checkbox、radio会进行禁用处理
	 */
	me.formReadOnly = function(formId,flag){
		$(formId+" input,textarea").each(function(){
			var e =$(this).attr("onclick")?$(this).attr("onclick"):$(this).attr("onfocus");
			if((e && e.indexOf("WdatePicker")>-1) || this.type =="checkbox" || this.type =="radio"){
				$(this).attr('disabled',flag);
			}else{
				$(this).attr("readOnly", flag);
			}
		});
	}
	
	//自定义校验类型
	$.extend($.fn.validatebox.defaults.rules, {
	    numberLength:{//校验数字类型，并限定长度
		    validator: function(value, param) {
		    		var len = $.trim(value).length;
		        return /^\d+(.\d+)?$/.test(value) && len >= param[0] && len <= param[1];
		      },
		      message: "请输入数字类型,且长度介于{0}和{1}之间."
	    },
	    integerLength:{//校验数字类型，并限定长度
		    validator: function(value, param) {
		    		var len = $.trim(value).length;
		        return /^[+]?[1-9]+\d*$/.test(value) && len >= param[0] && len <= param[1];
		      },
		      message: "请输入整数,且长度介于{0}和{1}之间."
	    },
	    float:{//校验两位小数的浮点型
		    validator: function(value, param) {
		        return /^[0-9]+(.[0-9]{2})?$/.test(value);
		      },
		      message: "请输入数字类型，并保留两位小数."
	    },
	    number:{//校验数字类型，包含浮点型(不限制小数点位置)
		    validator: function(value, param) {
	        return /^\d+(.\d+)?$/.test(value);
	      },
	      message: "请输入数字类型."
	   },
	   maxLength: {     
	        validator: function(value, param){     
	            return param[0] >= value.length;     
	        },     
	        message: '最多输入{0}个字符.'    
	    },
	    zjhm:{
	    		validator: function(value, param){     
	            return /^[0-9a-zA-Z]+$/.test(value);     
	        },
	        message: "请输入数字或者字母."
	    },
	    maxValue:{//校验数字类型，并限定最大值
		    validator: function(value, param) {
		        return /^[+]?[0-9]+\d*$/.test(value) && value <= param[0];
		      },
		      message: "请输入数字类型,且最大值为{0}."
	    },
	    minValue:{//校验数字类型，并限定最小值
		    validator: function(value, param) {
		        return /^[+]?[0-9]+\d*$/.test(value) && value >= param[0];
		      },
		      message: "请输入数字类型,且最小值为{0}."
	    }
	});
	
}
var titanUtils = new titanCommon();