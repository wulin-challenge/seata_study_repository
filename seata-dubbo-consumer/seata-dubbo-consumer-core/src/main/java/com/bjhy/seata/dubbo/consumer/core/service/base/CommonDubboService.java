package com.bjhy.seata.dubbo.consumer.core.service.base;

import org.springframework.stereotype.Component;

import com.alibaba.dubbo.config.annotation.Reference;
import com.bjhy.seata.dubbo.provider.api.GoodsOpenService;

/**
 * 外部dubbo接口
 * 
 * @author wulin
 *
 */
@Component
public class CommonDubboService {

	@Reference(timeout=30000)
	private GoodsOpenService goodsOpenService;

	public GoodsOpenService getGoodsOpenService() {
		return goodsOpenService;
	}

}