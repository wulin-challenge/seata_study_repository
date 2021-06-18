package com.bjhy.seata.dubbo.provider.web.controller.base;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.NotNull;

import org.apel.gaia.commons.i18n.Message;
import org.apel.gaia.commons.i18n.MessageUtil;
import org.apel.gaia.commons.jqgrid.QueryParams;
import org.apel.gaia.commons.pager.PageBean;
import org.apel.gaia.persist.domain.CommonFiled;
import org.apel.gaia.util.DateUtil;
import org.apel.gaia.util.jqgrid.JqGridUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bjhy.seata.dubbo.provider.core.service.base.BizCommonService;

/**
 * 非流程公共controller
 * 
 * 
 *
 * @param <T>
 * @param <PK>
 */
public abstract class BaseController<T extends CommonFiled, PK extends Serializable> {
	/**
	 * 编辑或者删除相差天数校验，默认为30天
	 */
	protected static final Integer VALIDATE_DAYS = 30;
	
	/**
	 * 业务的service
	 */
	@Autowired
	private BizCommonService<T, String> businessService;

	public BizCommonService<T, String> getBusinessService() {
		return this.businessService;
	}

	/**
	 * 列表路径
	 * 
	 * @return
	 * 
	 */
	protected abstract String index();

	/**
	 * 权限表别名，如果有请重写该方法设置相关值
	 * 
	 * @return
	 * 
	 */
	protected String getPermPrefix() {
		return null;
	}
	
	
	/**
	 * 平台日志-操作模块名称
	 * @return
	 * 
	 */
	public abstract String platformLogModule();

	/**
	 * 列表查询（通过permPrefix表做数据权限过滤）
	 * 
	 * @param queryParams
	 * @return
	 * 
	 */
	@RequestMapping
	public @ResponseBody PageBean list(QueryParams queryParams) {
		PageBean pageBean = JqGridUtil.getPageBean(queryParams);
		businessService.pageQuery(pageBean);
		return pageBean;
	}

	/**
	 * 保存
	 * @param t
	 * @return
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST)
	public @ResponseBody Message<?> create(@Validated T t) {
		try {
			businessService.save(t);
		} catch (Exception e) {
			throw e;
		}
		return MessageUtil.message("common.create.success", t.getId());
	}

	/**
	 * 更新
	 * @param id
	 * @param t
	 * @return
	 * 
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public @ResponseBody Message<?> create(@PathVariable String id,@Validated T t) {
		try {
			t.setId(id);
			getBusinessService().update(t);
		} catch (Exception e) {
			throw e;
		}
		return MessageUtil.message("common.update.success");
	}

	/**
	 * 查看
	 * @param id
	 * @return
	 * 
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody T view(@NotNull @PathVariable String id) {
		return getBusinessService().findById(id);
	}

	/**
	 * 删除
	 * @param ids
	 * @return
	 * 
	 */
	@RequestMapping(method = RequestMethod.DELETE)
	public @ResponseBody Message<?> batchDelete(@RequestParam("ids[]") String[] ids) {
		try {
			getBusinessService().deleteById(ids);
		} catch (Exception e) {
			throw e;
		}
		return MessageUtil.message("common.delete.success");
	}
	
	/**
	 * 编辑或者删除校验方法
	 * @param id
	 * @return
	 * 
	 */
	@RequestMapping(value = "/timeValidate",method = RequestMethod.GET)
	public @ResponseBody Message<Boolean> timeValidate(@RequestParam("ids[]") String[] ids) {
		for(String id : ids) {
			T t = getBusinessService().findById(id);
			int days = DateUtil.daysBetween(t.getGmtModified(), new Date());
			Boolean r = days > getValidateDays() ? true : false;
			if(r) {
				return new Message<Boolean>(Message.FAIL_CODE, "最后修改时间距离当前超过"+getValidateDays()+"天，不能进行编辑或者删除！");
			}
		}
		return new Message<Boolean>(Message.SUCCESS_CODE, "时间校验通过");
	}
	
	/**
	 * 获取编辑或者删除相差天数，默认为30天，如果业务校验不同，可以重写该方法
	 * @return
	 * 
	 */
	protected Integer getValidateDays() {
		return VALIDATE_DAYS;
	}
	
	
	
}
