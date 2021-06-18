package com.bjhy.seata.dubbo.consumer.core.service.impl;

import java.util.List;

import org.apel.gaia.commons.i18n.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bjhy.seata.dubbo.consumer.core.dao.AccountEntityRepository;
import com.bjhy.seata.dubbo.consumer.core.domain.AccountEntity;
import com.bjhy.seata.dubbo.consumer.core.service.AccountEntityService;
import com.bjhy.seata.dubbo.consumer.core.service.base.AbstractBizCommonService;
import com.bjhy.seata.dubbo.consumer.core.service.base.CommonDubboService;
import com.bjhy.seata.dubbo.provider.api.GoodsOpenService;
import com.bjhy.seata.dubbo.provider.api.domain.GoodsInfo;

import io.seata.spring.annotation.GlobalTransactional;

/**
 * 账户 service实现
 *
 */
@Service
@Transactional
public class AccountEntityServiceImpl extends AbstractBizCommonService<AccountEntity, String> implements AccountEntityService  {

	@Autowired
	private CommonDubboService commonDubboService;
	
	@Autowired
	private AccountEntityRepository accountRepository;
	
	@GlobalTransactional
	public Message<List<GoodsInfo>> executePurchase(String goodsId,String accountId,Integer number) {
		AccountEntity account = findById(accountId);
		
		GoodsOpenService goodsOpenService = commonDubboService.getGoodsOpenService();
		Message<List<GoodsInfo>> purchase = goodsOpenService.purchase(goodsId, account.getUsername(), number);
		
		if(purchase.getStatusCode() == Message.FAIL_CODE) {
			return new Message<>(Message.FAIL_CODE,200,purchase.getStatusText());
		}
		
		List<GoodsInfo> data = purchase.getData();
		Double totalPrice = getTotalPrice(data);
		
		//剩余余额
		double surplusAmount = account.getTotalAmount() - totalPrice;
		if(surplusAmount < 0) {
			throw new RuntimeException("余额不足");
		}
		int i = 1/0;
		account.setTotalAmount(surplusAmount);
		update(account);
		return purchase;
	}
	
	private Double getTotalPrice(List<GoodsInfo> data) {
		Double totalPrice = 0D;
		
		for (GoodsInfo goodsInfo : data) {
			totalPrice += goodsInfo.getPrice();
		}
		
		return totalPrice;
	}
}