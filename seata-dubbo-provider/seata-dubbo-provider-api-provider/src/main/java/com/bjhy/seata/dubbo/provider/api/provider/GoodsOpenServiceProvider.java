package com.bjhy.seata.dubbo.provider.api.provider;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apel.dubbo.starter.config.SpringService;
import org.apel.gaia.commons.i18n.Message;
import org.apel.gaia.util.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.dubbo.config.annotation.Service;
import com.bjhy.seata.dubbo.provider.api.GoodsOpenService;
import com.bjhy.seata.dubbo.provider.api.domain.GoodsInfo;
import com.bjhy.seata.dubbo.provider.core.domain.GoodsEntity;
import com.bjhy.seata.dubbo.provider.core.service.GoodsEntityService;

import io.seata.spring.annotation.GlobalTransactional;

@Service(interfaceClass=GoodsOpenService.class,timeout=30000)
@SpringService
@Transactional
public class GoodsOpenServiceProvider implements GoodsOpenService {
	
	@Autowired
	private GoodsEntityService goodsService;

	@Override
	@GlobalTransactional
	public Message<List<GoodsInfo>> purchase(String goodsId, String username, Integer number) {
		if(number <= 0) {
			return new Message<>(Message.FAIL_CODE, 200, "没有选中任何商品");
		}
		
		List<GoodsInfo> result = new ArrayList<>();
		GoodsEntity goodsEntity = goodsService.findById(goodsId);
		
		Integer surplus = goodsEntity.getGoodsNumber() - number;
		if(surplus < 0) {
			return new Message<>(Message.FAIL_CODE, 200, "商品不足");
		}
		
		goodsEntity.setGmtModified(new Date());	
		goodsEntity.setGoodsNumber(surplus);
		goodsService.update(goodsEntity);	
		
		for (int i = 0; i < number; i++) {
			GoodsInfo goodsInfo = new GoodsInfo();
			BeanUtils.copyNotNullProperties(goodsEntity, goodsInfo);
			result.add(goodsInfo);
		}
		return new Message<>(Message.SUCCESS_CODE, 200, "购买成功",result);
	}

}
