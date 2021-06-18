package com.bjhy.seata.dubbo.provider.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bjhy.seata.dubbo.provider.core.domain.GoodsEntity;
import com.bjhy.seata.dubbo.provider.web.controller.base.BaseController;

/**
 * 商品
 *
 */
@Controller
@RequestMapping("/goodsEntity")
public class GoodsEntityController extends BaseController<GoodsEntity, String> {

	private final static String INDEX_URL = "goodsEntity/goods_entity_index";
	private final static String MODULE_NAME = "商品";

	/**
	 * 首页
	 */
	@RequestMapping(value = "index", method = RequestMethod.GET)
	@Override
	public String index() {
		return INDEX_URL;
	}
	
	@Override
	public String getPermPrefix() {
		return null;
	}

	@Override
	public String platformLogModule() {
		return MODULE_NAME;
	}

}