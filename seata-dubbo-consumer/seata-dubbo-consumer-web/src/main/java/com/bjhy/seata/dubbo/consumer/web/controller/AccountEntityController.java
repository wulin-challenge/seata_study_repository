package com.bjhy.seata.dubbo.consumer.web.controller;

import java.util.List;

import org.apel.gaia.commons.i18n.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bjhy.seata.dubbo.consumer.core.domain.AccountEntity;
import com.bjhy.seata.dubbo.consumer.core.service.AccountEntityService;
import com.bjhy.seata.dubbo.consumer.web.controller.base.BaseController;
import com.bjhy.seata.dubbo.provider.api.domain.GoodsInfo;

/**
 * 账户
 *
 */
@Controller
@RequestMapping("/accountEntity")
public class AccountEntityController extends BaseController<AccountEntity, String> {

	private final static String INDEX_URL = "accountEntity/account_entity_index";
	private final static String MODULE_NAME = "账户";
	
	@Autowired
	private AccountEntityService accountEntityService;

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
	
	@RequestMapping("/executePurchase")
	public @ResponseBody Message<List<GoodsInfo>> executePurchase(String goodsId,String accountId,Integer number){
		Message<List<GoodsInfo>> executePurchase = accountEntityService.executePurchase(goodsId, accountId, number);
		return executePurchase;
	}

}