/**
 * easyui tbas组件扩展单击事件
 */
$.extend($.fn.tabs.methods, {
    /**
     * 绑定单击事件
     * @param {Object} jq
     * @param {Object} caller 绑定的事件处理程序
     */
    bindClick: function(jq, caller){
        return jq.each(function(){
            var that = this;
            $(this).children("div.tabs-header").find("ul.tabs").undelegate('li', 'click.tabs').delegate('li', 'click.tabs', function(e){
                if (caller && typeof(caller) == 'function') {
                    var title = $(this).text();
                    var index = $(that).tabs('getTabIndex', $(that).tabs('getTab', title));
                    caller(index, title);
                }
            });
        });
    },
    /**
     * 解除绑定双击事件
     * @param {Object} jq
     */
    unbindClick: function(jq){
        return jq.each(function(){
            $(this).children("div.tabs-header").find("ul.tabs").undelegate('li', 'click.tabs');
        });
    }
});