var commonList;
//页面的formId
var commonDetailFormId="#commonDetailForm";
//页面window对应的divId
var windowDivId = "#commonDetail";
//后台请求controller-url
var requestURL = "/goodsEntity";
//附件相关参数配置
var attachParam = {divId:windowDivId,attachId:'#attchmentId',formTabsId:"#form_tabs",title:"业务附件"};
//已选择罪犯对象
var criminalinfo;

$(function(){
	colNames= ["ID","商品名称","价格","商品库存数量","监区","监狱","创建日期","修改时间"];
    colModel= [
        { name: "id", index:"id",hidden: true},
	    { name: "goodsName", index:"goodsName", align:"center", sortable: true,searchoptions :{sopt:['eq','cn']}},
	    { name: "price", index:"price", align:"center", sortable: true,searchoptions :{sopt:['eq','cn']}},
	    { name: "goodsNumber", index:"goodsNumber", align:"center", sortable: true,searchoptions :{sopt:['eq','cn']}},
		{ name: "sysPermName", index:"sysPermName", align:"center", sortable: true,searchoptions :{sopt:['eq','cn']}},
		{ name: "sysOrgName", index:"sysOrgName", align:"center", sortable: true,searchoptions :{sopt:['eq','cn']}},
		{ name: "gmtCreate", index:"gmtCreate", align:"center", sortable: true,expType:"date",expValue:"yyyy-MM-dd HH:mm:ss",searchoptions:{dataInit:PlatformUI.defaultJqueryUIDatePick,sopt:['gt','lt','eq','ge','le']}, sortable: true ,formatter:"date",formatoptions: { srcformat: "U", newformat: "Y-m-d H:i:s" }},
		{ name: "gmtModified", index:"gmtModified", align:"center", sortable: true,expType:"date",expValue:"yyyy-MM-dd HH:mm:ss",searchoptions:{dataInit:PlatformUI.defaultJqueryUIDatePick,sopt:['gt','lt','eq','ge','le']}, sortable: true ,formatter:"date",formatoptions: { srcformat: "U", newformat: "Y-m-d H:i:s" }},
        ];
	var jqGridAddOptions={tableId:"#commonList",colNames:colNames,colModel:colModel,url:requestURL,
			pagerId:"#commonPager",title:"商品列表",sortname:"gmtCreate"
	};
	//初始化列表
	commonList = titanUtils.createJqGrid(jqGridAddOptions);
	
	//绑定检索事件
	titanUtils.initRetrieve({retrieveId:"#commonRetrieveBtn",list:commonList,searchInput:"#commonSearchInput"});
	
	//绑定刷新事件
	titanUtils.commonRefresh({list:commonList,buttonId:"#commonRefreshBtn",searchInputId:"#commonSearchInput"});
	
	//绑定导出excel事件
	$("#commonExportBtn").click(function(){
		var extraParams ={
				authorityField:{"sys_orgCode":"sysOrgCode","sys_permCode":"sysPermCode"},
				prefix:"p",
				module:"商品",
				sqlable:"false"//是否本地sql，默认设置为false即可，一律采用hql
		};
		PlatformUI.exportGrid("commonList", "from NoFlowExampleTemplate p where 1=1 ","",extraParams);
	});
	
	//绑定普通页面查询框体点击事件
	$("#commonSearchBtn").click(function(){
		//方法具体使用请见方法体实现,复杂查询逻辑请自定义方法
		titanUtils.commonInputSearch({list:commonList,searchInputId:"#commonSearchInput",conditionName:"exampleName"});
	});
	
	//绑定查询框回车事件
	$("#commonSearchInput").keyup(function(event){
		if(event.keyCode == 13){  
			//方法具体使用请见方法体实现,复杂查询逻辑请自定义方法
			titanUtils.commonInputSearch({list:commonList,searchInputId:"#commonSearchInput",conditionName:"exampleName"});
        }
	});
	
	//绑定新增事件
	titanUtils.initAdd("#commonShowAddBtn");
	
	//表单保存操作
	titanUtils.initSave({
		buttonId:"#commonSaveBtn",
		windowId:windowDivId,
		formId:commonDetailFormId,
		list:commonList,
		url:requestURL,
		sortname:"gmtCreate",
		validateFunction:submitValidate,
		paramFunction:function(){
			//有除了表单提交以外的参数请在这里设置
			return {};
		},
		successCallBack:function(){
			//保存或者更新成功之后回掉该方法
		}
	});
	
	//表单重置操作
	titanUtils.initReset({buttonId:"#commonResetBtn",formId:commonDetailFormId,url:requestURL});
	
	//编辑按钮
	titanUtils.initEdit({showEditId:"#commonShowEditBtn",list:commonList,url:requestURL,timeValidate:titanUtils.timeValidate});
	
	//查看按钮
	titanUtils.initView({showViewId:"#commonViewBtn",list:commonList,url:requestURL});
	
	//批量删除事件
	titanUtils.initDelete({showDelId:"#commonDelBtn",list:commonList,url:requestURL,
		validateFunction:delValidate,timeValidate:titanUtils.timeValidate
	});
	
	//初始化数据逻辑
	init();
});

//*********************方法区**********************

//初始化码表、行政区划等信息
function init(){

}

//新增初始化方法，点击新增按钮或者新增页面点击重置都会调用此方法
function initAdd(){
	
}

//数据回显方法，必须有
//点击编辑，查看，重置等操作时会调用此方法填充页面数据
function reviewData(data,pageData){
	//公共填充方法
	titanUtils.fillDataToForm(commonDetailFormId,data);
	//自定义参数
	if(pageData){
		
	}
	//下面自行增加复杂文本框填充内容（复杂文本框为公共填充方法暂时没有解决的类型）
	
	titanUtils.formIsValid(commonDetailFormId);
}

//保存额外校验方法，如果除了必填校验还有其它特别类型的校验，请在下面添加代码
function submitValidate(){
	//罪犯是否选择校验
//	var criminalId = $("#criminalId").val();
//	if(criminalId==""){
//		toastr.warning("请选择罪犯");
//		return false;
//	}
	return true;
}

//删除额外校验
function delValidate(){
	return true;
}

//相差天数校验
function timeValidate(){
	
}

//弹出表单框体
function showCommonDetailWindow(operation,data,pageData){
	//设置附件的操作类型
	attachParam.type = operation;
	//配置打开的相关参数
	var options = {
			formId:commonDetailFormId,
			windowId:windowDivId,
			windowParam:{title:"商品详细信息",width:$(window).width()*0.9,height:$(window).height()*0.9},
			data:data,
			pageData:pageData
	};
	
	//罪犯选择插件配置
	var rowData = {};
	if(operation !="add" && data && data.baseInfo){
		rowData = {zfbh:data.baseInfo.zfbh};
	}
	var criminalParam = {
			divID:"commonDetail_form",
			isEdit:"add"==operation?true:false,
			isDataAuthority:true,
			rowData:rowData,
//			postData:{},  过滤罪犯条件，默认为加载在押罪犯，如果需要其它条件请按需设置
			select:function(){
				//这里可以获取罪犯的相关信息
				$("#criminalId").val(criminalinfo.id);
				var xm = criminalinfo.xm;
				var zfbh = criminalinfo.zfbh;
			}
	};
	titanUtils.showCommonDetailWindow(options,attachParam,criminalParam);
}

//查看/编辑form切换函数
function changeEditForm(flag){
	if(flag){
		$("#commonDetailBtnKit").show();
	}else{
		$("#commonDetailBtnKit").hide();
	}
	titanUtils.formReadOnly(commonDetailFormId,!flag);
	//复杂类型只读
}