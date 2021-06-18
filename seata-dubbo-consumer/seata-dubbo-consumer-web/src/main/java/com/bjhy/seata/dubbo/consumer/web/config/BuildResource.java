package com.bjhy.seata.dubbo.consumer.web.config;

import javax.servlet.ServletContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ServletContextAware;

/**
 * 前端资源构建
 *
 */
@Component
public class BuildResource implements ServletContextAware {
	
	//构建狱政公用js
	private String buildTitanUtilsResource(String contextPath) {
		String js = "<script src=\"" + contextPath + "/js/common/titanUtils.js\" type=\"text/javascript\"></script>";
		return  js;
	}
	//构建狱政流程公用js
	private String buildActivitiUtilsResource(String contextPath) {
		String js = "<script src=\"" + contextPath + "/js/common/activitiTitanCommon.js\" type=\"text/javascript\"></script>";
		return  js;
	}
	//构建流程客户端js
	private String buildProcessClientResource(String contextPath) {
		String js = "<script type=\"text/javascript\" src=\""+contextPath+"/js/process_client.js\"></script>";
		return  js;
	}
	
	//构建choose_criminal
	private String buildChooseCriminalResource(String contextPath) {
		String css ="<link href=\"" + contextPath + "/css/choose-criminal.css\" rel=\"stylesheet\"/>";
		String js = "<script src=\"" + contextPath + "/js/common/chooseCriminal.js\" type=\"text/javascript\"></script>";
		return css + js;
	}
	//jquery上传文件插件
	private String buildAjaxUploadResource(String contextPath) {
		String js ="<script type=\"text/javascript\" src=\""+contextPath+"/js-module/ajaxUpload/jquery.ajaxfileupload.js\"></script>";
		return js;
	}
	//easyui tabs组件扩展单击事件
	private String buildEasyuiTabsResource(String contextPath) {
		String js = "<script src=\"" + contextPath + "/js/common/tabsClick.js\" type=\"text/javascript\"></script>";
		return js;
	}
	@Override
	public void setServletContext(ServletContext servletContext) {
		String contextPath = servletContext.getContextPath();
		servletContext.setAttribute("titanUtils",buildTitanUtilsResource(contextPath));
		//servletContext.setAttribute("titanActiviti",buildActivitiUtilsResource(contextPath));
		servletContext.setAttribute("chooseCriminal",buildChooseCriminalResource(contextPath));
		servletContext.setAttribute("processClient",buildProcessClientResource(contextPath));
		servletContext.setAttribute("ajaxUpload",buildAjaxUploadResource(contextPath));
		servletContext.setAttribute("easyuitabs",buildEasyuiTabsResource(contextPath));
	}
}