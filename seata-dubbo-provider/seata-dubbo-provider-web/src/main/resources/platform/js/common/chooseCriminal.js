/**
 * 罪犯信息下拉框插件-chooseCriminal
 * 使用示例：
 *  (单选罪犯)
 *   var rules = [];
 *   rules.push({"field":"sysPermName","op":"cn","data":"一监区"});
 *   var filters = {"groupOp":"AND","rules":rules};
 *   var crimianlinfo  = $("#divID").chooseCriminal({
 *       postData: {filters:JSON.stringify(filters)},
 *       divID:"commonDetail",
 *       isMultiselect:true,
 *         gridWidth:780,
 *         gridHeight:200
 *        });
 *  获取单选后的罪犯信息：crimianlinfo.属性 例如：crimianlinfo.xm
        
    (多选罪犯)
 *    var  crimianlinfoList = $("#commonDetail").chooseCriminal({
 *       postData: {filters:JSON.stringify(filters)},
 *       divID:"commonDetail",
 *        });
 *   获取多选后罪犯信息集合：crimianlinfoList.values();
 *   对集合里对象进行操作示例：
 *   var arr =  crimianlinfoList.values();
    for(var i=0;i<arr.length;i++){
    var  xm = arr[i].xm;
    }
 * 
 * 参数说明：
 *  (1).query_url :加载下拉框数据的URL, 如果URL为空则使用插件提供的默认URL
 *  如果使用自己编写的controller地址,你需要像如下编写：
 *  @RequestMapping
  public @ResponseBody  Map<String, Object> list(QueryParams queryParams,boolean isDataAuthority){
     PageBean pageBean = JqGridUtil.getPageBean(queryParams);
     //调用添加权限的方法
     chooseCriminalBizService.addDataAuthority(pageBean, isDataAuthority);
     chooseCriminalBizService.pageQuery(pageBean);
     Map<String, Object> result = new LinkedHashMap<>();
     result.put("total", pageBean.getTotalRows());//总条数
     result.put("rows",pageBean.getItems()) ;//每页行数
    return result;
 *  (2).divID:divID
 *  (3).sidx:排序字段,默认罪犯编号
 *  (4).sord：排序类型,默认desc
 *  (5).postData:  postData: {filters:JSON.stringify(filters)} 自定义查询条件 默认无
 *  (6). isMultiselect：是否多选罪犯,默认单选false
 *  (7).gridHeight 多选表格的高度 默认150
 *  (8).isShowForm:true,//是否显示罪犯详细信息表单 默认显示
 *  (9).select:{},回调函数,自定义操作
 *  (10).查看回显数据： 
 *      $("#commonDetail").chooseCriminal({
       divID:"commonDetail",
       isView:false,---下拉框不可选择
       rowData:rowData--选中行的数据
        }); 
    (11).编辑回显数据：
        $("#commonDetail").chooseCriminal({
       divID:"commonDetail",
       isEdit:false,---下拉框不可选择
       rowData:rowData--选中行的数据
        }); 
 *     rowData:rowData--选中行的数据  可通过如下的方式获取： 
 *     var ids = diaochuzhuanhuiList.jqGrid ('getGridParam', 'selarrrow');
     var rowData = diaochuzhuanhuiList.jqGrid("getRowData", ids);
 *  (12).isDataAuthority:false//是否加数据权限,默认不加
 *  (13).fields:{sexEnum:"性别"}//添加表格额外列,默认显示{xm:"罪犯姓名",zfbh:"罪犯编号",sysPermName:"关押单位"}
 *   (14).isGridMultiselect:表格是否多选 默认多选
 *   isOnSelectQuery :选中某项的时候是否在进行查询
 * 特别注意：由于直接关闭窗口,每次会导致组件未销毁,重复生成,所以需要在你js显示window的方法内添加onClose事件:
 *  示例：
 *  $('#divID').window({
    title:"XXXX",
      width:800,
      height:500,
      modal:true,
      onClose :function(){
        $(".destoryForm").empty();
      }
  });
 *
 *
 */
var myRandom;
var customparams;
(function ($) {
  var chineseIME = true;//标识中文输入是否完成
  //解决enter键多次加载插件的问题
  $(document).click(function(e){
    var currentTarget=$(e.currentTarget.activeElement);
    if(currentTarget.attr("type")=="button"){
      //获取下拉框的id
      var myChooseID=$("#"+myRandom);
      //判断是否存在该标签,不存在就全部的button失去焦点,否则就聚焦输入框
      if(myChooseID){
        var myInput=myChooseID.next().find('input');
        if(myInput.length==0){
          currentTarget.blur();
        }else{
          myInput.focus()
        }
      }
    }
  });
    $.fn.extend({
      chooseCriminal: function (options) {
         //产生随机数
         var random =Math.floor(Math.random()*100000+1);
         var colNames = [];//列名
         var colModel = [];//列数据
         myRandom="sel"+"_"+random;//罪犯选择输入框 id
         //
         //自定义参数对象
         //
         customparams = {
             resultObj : {},//存储单选选择的后的罪犯数据,返回给外界调用者使用
             resultListObj : PlatformUI.arrayMap(),//存储多选选择的后的罪犯数据,返回给外界调用者使用
             tempObj:PlatformUI.arrayMap(),//用来存储外部传进来的rowData
             currentTag : this,//当前标签对象
             formID: "form_"+random,
             chooseID : myRandom,//下拉选择框的ID
             gridID :"grid"+"_"+random,//dataGrid的ID
             pager : "pager"+"_"+random,//分页ID
             countRow :0,//计数行号,默认为0
             gridColNamesMap:PlatformUI.arrayMap(),//列名Map
             gridColModelMap:PlatformUI.arrayMap(),//列数据Map
         };
         //
         //参数和默认值
         //
           var defaults = {
            _search:"false",
            //如果未传入url，则使用默认的url进行查询
            query_url :options.url?options.url:contextPath + "/chooseCriminal",
            onSelectQueryURL:contextPath + "/chooseCriminal/query",
            isOnSelectQuery:true,
          //  sidx:"zfbh",//排序字段，默认根据罪犯的编号zfbh
          //  sord: "desc",//排序类型：升序，降序 ,默认降序
            isMultiselect:false,//是否多选,默认单选
            isShowForm:true,//是否显示罪犯详细信息表单
            isView:true,//查看是否可编辑
            isEdit:true,//是否可选,默认可选
            isDataAuthority:false,//是否加数据权限
            defaultfields:{xm:"罪犯姓名",zfbh:"罪犯编号",sysPermName:"关押监区"},//字段集合
            lableName:"请选罪犯",
            legendName:"罪犯基础数据",
            isGridMultiselect:true,
            gridHeight:150//列表的高度，默认150
           };
           //
         //装载默然参数和传人的参数对象
         //
           var options = $.extend(defaults, options);
           /***动态列操作 start***/
          
           //初始化ColNamesAndcolModel
            var initColumns = function(){
               customparams.resultListObj.put("gridId",customparams.gridID);
               var fieldsObj = $.extend(options.defaultfields, options.fields);
               //添加罪犯id隐藏域
               customparams.gridColNamesMap.put("zfid","zfid");
                 customparams.gridColModelMap.put("zfid",{name: "id", index:"id",hidden: true}); 
                 customparams.gridColNamesMap.put("baseInfoId","baseInfoId");
                 customparams.gridColModelMap.put("baseInfoId",{name: "baseInfoId", index:"baseInfoId",hidden: true}); 
                 //循环设置设置colName
                 for(var field in fieldsObj){
                   if(!(customparams.gridColNamesMap.containsKey(field))){
                     customparams.gridColNamesMap.put(field,fieldsObj[field]);
                       customparams.gridColModelMap.put(field,{name: field, index:field, align:"center", sortable: true}); 
                   }
                  
                }
                 //如果为查看的时候不添加操作列
                 if(options.isView==true){
                  customparams.gridColNamesMap.put("customColumn","操作");
                  customparams.gridColModelMap.put("customColumn",{  name: "customColumn",formatter:function(cellvalue, options, rowObject){
                  var obj = "{zfbh:" + "\"" + rowObject.zfbh + "\"" + ",rowId:" + "\"" + options.rowId + "\"" + "}";
                  var columnTemplate  = "<span class='btn_orange innerDelBtn' name='"+ obj +"' >删除</span>"
                  return columnTemplate;  
                       }, align:"center",search:false,sortable: false });
                 }
             var fields = customparams.gridColNamesMap.keys();
               for(var i=0;i<fields.length;i++){
              colNames.push(customparams.gridColNamesMap.get(fields[i]));
                //用于考核分分数格式化
                if("khjf" == fields[i]){
                  colModel.push({align:"center",index:"khjf",name:"khjf",sortable:true,formatter:function(value){
                    //return parseFloat(value).toFixed(1)
                    return value==null?"":parseFloat(value).toFixed(1);
            }});
                }else{
                  colModel.push(customparams.gridColModelMap.get(fields[i]));
                }
            } 
             };
           /***动态列操作end***/
           
           //默认查询参数
           if(options.postData!=null&&options.postData!=undefined){
           var defaultSearchParams = JSON.parse(options.postData.filters);
           }
           
           /**
            * 编码请求的url参数
            */
           var encodeURIParams = function(value){
             var value2 = window.encodeURI(value);
             value2 = window.encodeURI(value2);
         return value2;
           }
          
           //
         //解析载入参数  query_url 请求的地址
         //
           var bindParams = function(query_url){
             
             var params="";//存储解析的参数
             for(var attr in options){
               var key = attr;
               var value = options[attr];
               if(value != "" && !(value instanceof Object)
                 &&key!="query_url"
                 &&key!="divID"&&key!="isMultiselect"&&key!="gridHeight"){
                 value = encodeURIParams(value);
                 params+=key+"="+value+"&"
               }else if(value instanceof Object){
                 params+=$.param(value)+"&" 
               }else if(key=="_search"){
                 value = encodeURIParams(value);
                 params+=key+"="+value+"&";
               }else if(key=="isDataAuthority"){
                 value = encodeURIParams(value);
                 params+=key+"="+value+"&";
               }else if(key=="businessKey"){
                 value = encodeURIParams(value);
                 params+=key+"="+value+"&";
               }
             }
             
             var finalParams =query_url+"?"+params.substring(0,params.length-1);
             return finalParams;
              };
            //
           //绑定选择罪犯combogrid
           //
              var chooseColumns=[
                            {field:'id',title:'id',width:120,hidden:true},
                        {field:'xm',title:'姓名',width:80},
                        {field:'zfbh',title:'罪犯编号',width:100},
                        {field:'sysOrgName',title:'关押监狱',width:120},
                        {field:'sysPermName',title:'关押监区',width:80},
                        {field:'rjrq',title:'入监日期',width:80,
                          formatter:function(value){
                            //return value;
                            if(value!=null){
                              
                              return ExtendDate.getSmpFormatDateByLong(value,false);
                            }
                                  }
                        },
                        {field:'xq',title:'刑期',width:100,
                          formatter:function(value){
                            return formXq(value);
                          }
                        },
                        {field:'accusalName',title:'罪名',width:100}
                      ];
              if(options.chooseColumns){
                chooseColumns=chooseColumns.concat(options.chooseColumns);
              }
          var renderComboGrid  = function(){
                $("#"+customparams.chooseID).combogrid({
                panelWidth: 700,
                panelHeight: 310,
                multiple: options.isMultiselect,
              idField: 'zfbh',//id
              textField: 'xm',//input显示值
                pagination : true,//是否分页 
                pageSize: 10,//每页显示的记录条数，默认为10    
                loadMsg:'正在查询',
                delay: 500,
                rownumbers:true,//序号
              url: bindParams(options.query_url),
              method: 'get',
              onShowPanel:options.onShowPanel?options.onShowPanel:function(){},
              fitColumns: true,
              columns: [chooseColumns],
              keyHandler:{
                up:function(){//【向上键】押下处理  
                   //获取panel当前的状态,如果显示就关闭
              　       var pClosed = 　　$("#"+customparams.chooseID).combogrid("panel").panel("options").closed; 
              　       if(pClosed){
              　       　　$("#"+customparams.chooseID).combogrid("showPanel"); 
              　        }
                  　　var grid = $("#"+customparams.chooseID).combogrid("grid"); //表格对象
                  　　var rowSelected = grid.datagrid("getSelected"); //获取选中行的数据
                     var rowLength = grid.datagrid("getRows").length;//行的长度
                  　　if (rowSelected) { 
                    ///取得选中行的rowIndex,如果大于0就减1并选中该行
                  　 var rowIndex = grid.datagrid("getRowIndex", rowSelected);
                  　 　  //向上移动到第一行为止  
                  　  if (rowIndex > 0) { 
                  　   grid.datagrid("selectRow",  rowIndex - 1); 
                        } 
                  　 　}else if(rowLength >0){ 
                      grid.datagrid('selectRow',0);  
                     } 
                  
                  
                },
                down:function(){//【向下键】押下处理  
                   //获取panel当前的状态,如果显示就关闭
              　       var pClosed = 　　$("#"+customparams.chooseID).combogrid("panel").panel("options").closed; 
              　       if(pClosed){
              　       　　$("#"+customparams.chooseID).combogrid("showPanel"); 
              　        }
                    var grid = $("#"+customparams.chooseID).combogrid("grid"); //表格对象
                　　    var rowSelected = grid.datagrid("getSelected"); //获取选中行的数据
                　　    var rowData = $("#"+customparams.chooseID).combogrid('grid').datagrid('getRows').length;
                　　  if (rowSelected) { 
                　　    //取得选中行的rowIndex,如果大于0就减1并选中该行
                　   var rowIndex = grid.datagrid("getRowIndex", rowSelected);
                　 　  //向下移动到当页最后一行为止
                　  if (rowIndex < rowData-1) { 
                　     grid.datagrid("selectRow",  rowIndex +1); 
                      } 
                　 　 }else if(rowData >0){ 
                      grid.datagrid('selectRow', 0);  
                   } 
                },
                enter:function(){//【enter键】押下处理
                   //获取panel当前的状态,如果显示就关闭
                  　  var pClosed = 　　$("#"+customparams.chooseID).combogrid("panel").panel("options").closed; 
                  　　if (!pClosed) { 
                  　　　　$("#"+customparams.chooseID).combogrid("hidePanel"); 
                       } 
                  　　var record = $("#"+customparams.chooseID).combogrid("grid").datagrid("getSelected"); 
                  　　if (record == null || record == undefined){
                      return;
                  　　}else { 
                     //加载数据
                      loadData(record.zfbh);
                             //选中后让下拉表格消失  
                                                  　$("#"+customparams.chooseID).combogrid('hidePanel');  
                      } 
                },
                query:function(keyword){//动态搜索
                      if(chineseIME){
                        query(keyword);
                      }
                }
                          
                  },
             onSelect:function(){//选中事件
               
             
                            var grid = $("#"+customparams.chooseID).combogrid('grid');//获取选中行数据的罪犯编号   
                            var criminalbh = grid.datagrid('getSelected').zfbh;//罪犯id
                            if(options.isOnSelectQuery){
                               loadData(criminalbh);
                            }else{
                             var rowData  = grid.datagrid('getSelected');
                                 loadRow(rowData);
                            }
                           
                            
             },
             onClickRow:function(rowIndex, rowData){
             	 var grid = $("#"+customparams.chooseID).combogrid('grid');
             	 var selectedRow = grid.datagrid('getSelected');
             	 if(selectedRow == null){
             	 	grid.datagrid("selectRow",  rowIndex);
             	 }

             }

                  });
              };
          
          //设置Comboxgrid的值
          var setComboxgridValue  =function(value){
            $("#"+customparams.chooseID).combogrid('setValue', value);
          };

          var query = function(_value){
            var value = _value;
            //装载动态输入参数
            if (options.postData != null && options.postData != undefined) {
              //存储查询条件
              var rules1 = [];
              var rules2 = [];
              var groups = [];
              //添加输入参数
              rules1.push(
                { "field": "zfbh", "op": "cn", "data": value },
                { "field": "xm", "op": "cn", "data": value }/*,
                               {"field":"dah","op":"cn","data":value},
                               {"field":"simpleSpell","op":"cn","data":value},
                               {"field":"fullSpell","op":"cn","data":value}*/
              );
              groups.push({ groupOp: "or", rules: rules1 });
              //循环设默认参数
              for (i in defaultSearchParams.rules) {
                rules2.push(defaultSearchParams.rules[i]);
              }
              groups.push({ groupOp: "and", rules: rules2 });
              var filters = { "groupOp": "and", "groups": groups, rules: [] };
              options = $.extend(defaults, { postData: { filters: JSON.stringify(filters) } });
            } else {
              var rules1 = [
                { "field": "zfbh", "op": "cn", "data": value },
                { "field": "xm", "op": "cn", "data": value }/*,
                                 {"field":"dah","op":"cn","data":value},
                                 {"field":"simpleSpell","op":"cn","data":value},
                               {"field":"fullSpell","op":"cn","data":value}*/

              ];
              //还需要添加罪犯的简拼和全拼查询条件
              var filters = { "groupOp": "or", "rules": rules1 };
              options = $.extend(defaults, { queryData: { filters: JSON.stringify(filters) } });
            }
            $("#" + customparams.chooseID).combobox('clear');
            //将输入的值设置至输入框中
            setComboxgridValue(value);
            //重新请求后台加载表格
            $("#" + customparams.chooseID).combogrid("grid").datagrid({ url: bindParams(options.query_url) });
          }
          //
          //根据选中的行加载罪犯数据
          //参数说明：criminalId 罪犯id
          //
          var loadData = function (criminalbh){
            //加载罪犯基础信息
            $.ajax({
              type : 'POST',
              url : options.onSelectQueryURL,
              data :{criminalbh:criminalbh},
              success : function(data) {
                //转换对象中包含时间类型的数值
                convertObjectType(data);
                //判断当前用户引用的是单选,还是多选
                if(options.isMultiselect==false){//单选
                   //填充表单
                    fillForm(customparams.formID, data);
                  $.extend(customparams.resultObj, data);
                }else{//多选
                  if(customparams.tempObj.containsKey(data.zfbh)){//此处暂时通过罪犯的姓名判断
                      toastr.warning("罪犯已被选择!");
                        setComboxgridValue("");
                   }else{
                   addRowData(data);
                   $.extend(customparams.resultListObj, data); 
                  }
                }
                   //调用回调函数
                    if(options.select!=undefined){
                      options.select(data);
                    }
              } 
            });
          };
          //加载行数据
          var loadRow = function(data){
          //转换对象中包含时间类型的数值
          convertObjectType(data);
          //判断当前用户引用的是单选,还是多选
          if(options.isMultiselect==false){//单选
             //填充表单
              fillForm(customparams.formID, data);
            $.extend(customparams.resultObj, data);
          }else{//多选
            if(customparams.tempObj.containsKey(data.zfbh)){//此处暂时通过罪犯的姓名判断
                toastr.warning("罪犯已被选择!");
                  setComboxgridValue("");
             }else{
             addRowData(data);
             $.extend(customparams.resultListObj, data); 
            }
          }
             //调用回调函数
                if(options.select!=undefined){
                  options.select();
                }
        
          }
          //加载额表格外部数据
          var loadExternalData = function(){
              var rowData = options.rowData;
              externalAddRowData(rowData);
          }
             //
          //填充表单 
            //参数说明：
            //formId 表单ID  
            //data   填充的数据集 c_familyAddressDetail
          //
            var fillForm = function(formId, data){
              $("#"+random+"_c_mtUrl").attr("src", "");
                for(var attr in data){
                  var formField = $("#"+random+"_c_"+ attr);
                  if(data.khjf!= null){
                      if(data.khjf!=null&&data.khjf!=undefined){
                  $("#"+random+"_khjf").val(Number(data.khjf).toFixed(1));
                }
                  }else{
                    $("#"+random+"_khjf").val(0);
                  }
                  if(formField){
                    if(data[attr]!="undefined"){
                      if(attr=="mtUrl"){//图片
                        $("#"+random+"_c_"+ attr).attr("src", data[attr]+"?n="+random);
                      }else if(attr=="jtDetail"){
                        //拼接家庭地址全部
                        var sheng = data['jtProvinceName']==null?"":data['jtProvinceName']+"";
                        var shi = data['jtCityName'] == null ? "" : data['jtCityName']+"";
                        var area=data['jtAreaName']==null?"":data['jtAreaName']+"";
                        var xiangqing =data[attr]==null?"":data[attr]+"";
                        //var jtzz=data['familyProvinceName']+""+data['familyCityName']+""+data['familyAreaName']+""+data[attr];
                        var jtzz =sheng+shi+area+xiangqing;
                        jtzz.replace("null","");
                        formField.val(jtzz);
                      }else{
                        formField.val(data[attr]);
                      }
                    }
                    
                  }
                }
              }
             //
            //添加表格的行信息 
            //参数说明：data 数据集
          //
          var addRowData = function(data){
        //判断当前对象是否已经存在resultesObj中,如果存在则不保存,反之则保存
        if(!(customparams.resultListObj.containsKey(data.zfbh))){
          customparams.resultListObj.put(data.zfbh,data);
          var rowData = {baseInfoId:data.id,id:data.id,xm:data.xm, zfbh:data.zfbh, sysPermName:data.sysPermName};
          if(options.fields!=null||options.fields!=undefined){
            for( field in options.fields){
               var fieldValue = eval("("+"data."+field+")"); 
              if(field=="sexEnum"){//特殊处理性别字段
               if(fieldValue == "OTHER"){//其它性别
                rowData[field]="其它性别";
               }else if(fieldValue == "MALE"){//男
                 rowData[field]="男";
               }else if(fieldValue == "FEMALE"){//女
                 rowData[field]="女";
               }else{
                 rowData[field]="未说明的性别";
               }
              }else{
                rowData[field]=fieldValue;
              }
              
            }
          }
          customparams.countRow = customparams.countRow+1;
          //添加行
           $("#"+customparams.gridID).addRowData(customparams.countRow, rowData);
           setComboxgridValue("");
        }else{
          //提示
          toastr.warning("罪犯已被选择!");
          setComboxgridValue("");
          return;
        }
          };
          
          //添加外数据到grid
        var externalAddRowData = function(data){
           for(key in data){
             if(!(customparams.tempObj.containsKey(data[key].xm))){
               customparams.tempObj.put(data[key].xm,data[key]);
               customparams.resultListObj.put(data[key].zfbh,data[key]);
             }
            }
              
        customparams.countRow = customparams.countRow+1;
          $("#"+customparams.gridID).addRowData(customparams.countRow, data);
        };
             //
          //删除行指定列
          //参数说明：
            //zfbh 罪犯编号
            //rowId 行ID
          //
          var deleteRow = function(zfbh,rowId){
              //删除集合中的元素
          customparams.resultListObj.remove(zfbh);  
          //删除表格中的行
          $("#"+customparams.gridID).delRowData(rowId);
          //更改行号
          customparams.countRow = customparams.countRow - 1; 
            var obj = $("#"+customparams.gridID).jqGrid("getRowData");
            if(obj.length==0){
             $("#"+customparams.chooseID).combogrid('setValue', "");
            }
            };


            //处理夏令时日期生日少一天的问题
            function convertDate(longDate){
            	var _data = null;
            	$.ajax({
		              type : 'get',
		              async:false,
		              url : contextPath + "/chooseCriminal/converDate",
		              data :{longDate:longDate},
		              success : function(data) {
		              	_data =  data;
		              } 
            	});
            	return _data;
            }

             //
          //转换对象类型
          //参数说明：
            //data 数据集
          //
      var convertObjectType = function(data) {
         //转换时间
          if(data.rjrq!=null&&data.rjrq!=undefined){
          	data.rjrq = convertDate(data.rjrq);
            //data.rjrq = ExtendDate.getFormatDate(new Date(data.rjrq), "yyyy-MM-dd");
          }
          if(data.csrq!=null&&data.csrq!=undefined){
          	data.csrq = convertDate(data.csrq);
            //data.csrq = ExtendDate.getFormatDate(new Date(data.csrq), "yyyy-MM-dd");
          }
          if(data.dqxqqr!=null&&data.dqxqqr!=undefined){
          	data.dqxqqr = convertDate(data.dqxqqr);
            // data.dqxqqr = ExtendDate.getFormatDate(new Date(data.dqxqqr), "yyyy-MM-dd");
          }
          if(data.dqxqzr!=null&&data.dqxqzr!=undefined){
          	data.dqxqzr = convertDate(data.dqxqzr);
            // data.dqxqzr = ExtendDate.getFormatDate(new Date(data.dqxqzr), "yyyy-MM-dd");
          }
          data.dqxq = formXq(data.dqxq);
          data.xq = formXq(data.xq);
          data.yx = formXq(data.yx);
          
         if(data.zwfName==null){//职务犯
			  data.zwfName = "否";
		  }else{
			  data.zwfName = "是";
		  }
          if(data.ilf==null){//是否老犯
            data.ilf = "否";
          }else if(data.islf==0){
            data.ilf = "否";
          }else{
            data.ilf = "是";
          }
          if(data.icf==null){//是否老犯
            data.icf = "否";
          }else if(data.icf==0){
            data.icf = "否";
          }else{
            data.icf = "是";
          }
          if(data.ibf==null){//是否病犯
            data.ibf = "否";
          }else if(data.ibf==0){
            data.ibf = "否";
          }else{
            data.ibf = "是";
          }
          if (data.iwxf==null){//是否危险犯
            data.iwxf = "否";
          } else if (data.iwxf==0){
            data.iwxf = "否";
          }else{
            data.iwxf = "是";
          }
          if(data.jjjlName==null){
            data.jjjlName = "无";
          }
          
      };
       //
          //渲染panel视图
          //
       var renderPanelView = function(){
          var html = "";
            html+="<div class='destoryForm'>";
           if(options.isView==false){//针对查看/编辑,选择框不可编辑
              //html+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+options.lableName+":"+"&nbsp;&nbsp;"+"<input id='"+customparams.chooseID+"' style='width:210px'  disabled='disabled' name='singleSelect'/>";
            }else if(options.isEdit==false){//针对编辑还可以选择的情况,默认不可用
              //html+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+options.lableName+":"+"&nbsp;&nbsp;"+"<input id='"+customparams.chooseID+"'style='width:210px' disabled='disabled'  name='singleSelect'/>";
            }else{
              html+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+options.lableName+":"+"&nbsp;&nbsp;"+"<input id='"+customparams.chooseID+"'style='width:210px' name='singleSelect' class='singleSelect'/>";
            }
           if(options.isShowForm==true){//如果设置的属性为true则显示表单
              html+="<fieldset>"
              html+="<legend>"+options.legendName+"</legend>"
              html+="<form id='"+customparams.formID+"'>";
              html+="<td><input  type='hidden' id='"+random+"_c_id'  name='c_id' /></td>";
              html+="<table class='t4_1'>";
              html+="<tr>";
              html +="<th style='white-space:nowrap;'>罪犯姓名:</th>";
              html+="<td><input  style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px '  readonly='true' type='text' id='"+random+"_c_xm'  name='c_xm' /></td>";
              html +="<th style='width:100px;white-space:nowrap;'>罪犯编号:</th>";
              html+="<td><input  style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px ' readonly='true' type='text' id='"+random+"_c_zfbh' name='c_zfbh' /></td>";
              html +="<th style='white-space:nowrap;'>罪名:</th>";
             html += "<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='" + random +"_c_accusalName' name='c_accusalName' /></td>";
              html+="<td rowspan='8' style='text-align: center;width:120px;'><img src='' width='120' height='130' alt='' id='"+random+"_c_mtUrl' name='c_mtUrl' /></td>";
              html+="</tr>";
              
              html+="<tr>";
              html +="<th style='white-space:nowrap;'>入监时间:</th>";
              html+="<td><input style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px ' readonly='true' type='text' id='"+random+"_c_rjrq' name='c_rjrq' /></td>";
              html +="<th style='white-space:nowrap;'>身份证号:</th>"
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_sfzh' name='c_sfzh' /></td>";
              html +="<th style='white-space:nowrap;'>出生日期:</th>";
              html+="<td> <input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_csrq' name='c_csrq' /></td>";
              html+="</tr>";
              
              html+="<tr>";
              html +="<th style='white-space:nowrap;'>分押类型:</th>"
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_fylxName' name='c_fylxName' /></td>";
              html +="<th style='white-space:nowrap;'>关押监区:</th>";
              html+="<td><input  style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px ' readonly='true' type='text' id='"+random+"_c_sysPermName' name='c_sysPermName' /></td>";
              html +="<th style='white-space:nowrap;'>处遇等级:</th>";
              html+=" <td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_cydjName' name='c_cydjName' /></td>";
              html+="</tr>";
              
              html+="<tr>";
              html +="<th style='white-space:nowrap;'>原判刑期:</th>"
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_xq' name='c_xq' /></td>";
              html +="<th style='white-space:nowrap;'>当前刑期:</th>"
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_dqxq' name='c_dqxq' /></td>";
              html +="<th style='white-space:nowrap;'>余刑:</th>";
              html +="<td style='white-space:nowrap;'><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_yx' name='c_yx' /></td>";
              html+="</tr>";
              
              html+="<tr>";
              html +="<th style='white-space:nowrap;'>刑期起日:</th>";
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_dqxqqr' name='c_dqxqqr' /></td>";
              html +="<th style='white-space:nowrap;'>刑期止日:</th>";
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_dqxqzr' name='c_dqxqzr' /></td>";
              html +="<th style='white-space:nowrap;'>军警经历:</th>";
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_jjjlName' name='c_jjjlName' /></td>";
              html+="</tr>";
              
              html+="<tr>";
              html +=" <th style='white-space:nowrap;'>累惯犯:</th>"
             html += "<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='" + random +"_c_lgfName' name='c_lgfName' /></td>"
              html +=" <th style='white-space:nowrap;'>职务犯:</th>";
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_zwfName' name='c_zwfName' /></td>";
              html +="<th style='width:100px;white-space:nowrap;'>危险犯:</th>";
              html += "<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='" + random +"_c_iwxf' name='c_iwxf' /></td>";  
              html+="</tr>";
              
              html+="<tr>";
              html +="<th style='white-space:nowrap;'>是否老犯:</th>";
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_ilf' name='c_ilf' /></td>";
              html +="<th style='white-space:nowrap;'>是否病犯:</th>";
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_ibf' name='c_ibf' /></td>";
              html +="<th style='white-space:nowrap;'>是否残犯:</th>";
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_c_icf' name='c_icf' /></td>";
              html+="</tr>";
              
              html+="<tr>";
              html +="<th style='white-space:nowrap;' >家庭住址:</th>";
              //html+="<td colspan='2'><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px;width:99%;' readonly='true' type='text' id='"+random+"_c_dwellDetail' name='c_dwellDetail' /></td>";
              html+="<td colspan='3'><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px;width:99%;' readonly='true' type='text' id='"+random+"_c_jtDetail' name='c_jtDetail' /></td>";
              html +="<th style='white-space:nowrap;'>考核分:</th>";
              html+="<td><input   style='border-left:0px;border-top:0px;border-right:0px;border-bottom:1px 'readonly='true'type='text' id='"+random+"_khjf' name='khjf' /></td>";
              html+=" </tr>";
              html+=" </table>";
              html+="</form>";
              html+="</fieldset>"
          }
            html+="</div>"; 
            $(customparams.currentTag).prepend(html);
            renderComboGrid();
           };
           
       /*******************渲染dtaGrid部分*********************/
   
       //
            //渲染dataGrid表格
        //
       var renderGrid = function(){
         if(options.isShowForm==true){
         var gridhtml ="";
          gridhtml+="<div class='destoryForm'>";
         if(options.isView==false){//针对查看/编辑,选择框不可编辑
//            gridhtml+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+options.lableName+":<input id='"+customparams.chooseID+"'style='width:210px' type=\"hidden\" name='multiSelect'/>";
              }else if(options.isEdit==false){//针对编辑还可以选择的情况,默认不可用
//                gridhtml+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+options.lableName+":<input id='"+customparams.chooseID+"'style='width:210px' type=\"hidden\" name='multiSelect'/>";
              }else{
                gridhtml+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+options.lableName+":<input id='"+customparams.chooseID+"'style='width:210px' name='multiSelect'/>";
            }
          gridhtml+="<fieldset>"
          gridhtml+="<legend>"+options.legendName+"</legend>"
          gridhtml+="<table id='"+customparams.gridID+"'></table> ";
          gridhtml+="<div id='"+customparams.pager+"'></div>";
          gridhtml+="</fieldset>"
          gridhtml+="</div>"; 
         $(customparams.currentTag).prepend(gridhtml);
             renderComboGrid();
         initDataGrid();
         }
       };

        //
            //加载dataGrid表格数据
        //
       var initDataGrid =function (){
         initColumns();//初始化列
            $("#"+customparams.gridID).jqGrid({
              datatype : 'local',
              width:options.gridWidth?options.gridWidth:'auto',
              height:options.gridHeight,
              multiselect: options.isGridMultiselect,
              colNames: colNames,
              colModel: colModel,
              sortname: options.sidx,
              sortorder:options.sord,
              rownumbers:true,//添加左侧行号
              viewrecords: true,
              gridview: true,
              autoencode: true,
              shrinkToFit:true,
              ondblClickRow:options.ondblClickRow?options.ondblClickRow:function(){},
              caption: "罪犯信息列表",
              gridComplete: function(){
                binCompleteEvent();
              }
          });
       };
         //
          // 给表格绑定加载完的事件
         //
       var binCompleteEvent =function(){
        //给操作栏绑定点击事件
            $(".innerDelBtn").click(function(e){
              var obj = eval("(" + $(e.target).attr("name") + ")");
              deleteRow(obj.zfbh, obj.rowId);
            });
             //选中行鼠标变为手型
                var ids=$("#"+customparams.gridID).jqGrid('getDataIDs');
                for(var i = 0; i < ids.length ; i ++){
                   var id = ids[i];
                   $("#"+id).attr("style","cursor:pointer");
                 }
       }
       /*******************渲染dtaGrid部分结束*********************/
       //判断rowData
       var judgeRowData = function(){
         if(options.rowData!=undefined){
              var xm;//罪犯姓名
              var zfbh;//罪犯编号
              var flag = false;//标识是否zfbh对象.属性
              var special;//特殊标识
              for(key in options.rowData){
                 if(key.indexOf(".xm") >0||key.indexOf(".zfbh") >0){
                 flag = true;
                 special=key.split(".xm")[0];
                 break;
                 }
              }
              if(flag){
                xm = options.rowData[special+".xm"];
                zfbh =  options.rowData[special+".zfbh"];
              }else{
                xm = options.rowData.xm;//获取选中行罪犯的姓名
                zfbh =options.rowData.zfbh;//获取选中行罪犯的编号 
              }
           loadData(zfbh);//加载数据
           setComboxgridValue(xm);//设置comboxgrid值
            }  
       };
         //
          // 根据类型渲染视图
         //
       var renderView = function(){
         if(options.isEdit){//当前操作是修改
           if(options.isMultiselect){//多选,渲染表格视图
             renderGrid();
             loadExternalData(options.rowData);//加载额外的数据
            }else{
             renderPanelView();//单选,渲染表单
             judgeRowData();
            }
        }else if(options.isView){//当前操作是修改
          if(options.isMultiselect){//多选,渲染表格视图
             renderGrid();
             loadExternalData(options.rowData);//加载额外的数据
      
            }else{
              renderPanelView();//渲染视图
              judgeRowData();
          }
         }else{//当前操作是新增
           if(options.isMultiselect){
             renderGrid();//多选,渲染表格视图
            }else{
             renderPanelView();//单选,渲染表单
         }
         }
         var _query_input = $("#" + myRandom)
           .next("span")
           .find("input[type='text']");
         _query_input.on("compositionstart", function() {
           chineseIME = false;
         });
         _query_input.on("compositionend", function(e) {
           chineseIME = true;
           var _v = e.currentTarget.value;
           if (_v) query(_v);
         });
       };
       
       //
       //初始化入口
       //
      renderView();
      customparams.resultObj.chooseId=customparams.chooseID;
      //返回值
      return options.isMultiselect==true?customparams.resultListObj:customparams.resultObj;
     
       }
    
       });
    
    })(jQuery);

function formXq(cellvalue){
  var columnTemplate = cellvalue;
  if(cellvalue != null && cellvalue.length == 6){
    var n = parseInt(cellvalue.substring(0,2));
    var y = parseInt(cellvalue.substring(2,4));
    var r = parseInt(cellvalue.substring(4,6));
    columnTemplate = n + "年" + y + "月" + r + "天";
  }else if(cellvalue == null){
    columnTemplate = "";
  }
  return columnTemplate;  
}