package com.bjhy.seata.dubbo.consumer.core.service;

import java.util.List;

import org.apel.gaia.commons.i18n.Message;

import com.bjhy.seata.dubbo.consumer.core.domain.AccountEntity;
import com.bjhy.seata.dubbo.consumer.core.service.base.BizCommonService;
import com.bjhy.seata.dubbo.provider.api.domain.GoodsInfo;

/**
 * 账户 service
 *
 */
public interface AccountEntityService extends BizCommonService<AccountEntity,String>{

	/**
	 * 执行购买
	 * @param goodsId
	 * @param accountId
	 * @param number
	 * @return
	 */
	public Message<List<GoodsInfo>> executePurchase(String goodsId,String accountId,Integer number);
}