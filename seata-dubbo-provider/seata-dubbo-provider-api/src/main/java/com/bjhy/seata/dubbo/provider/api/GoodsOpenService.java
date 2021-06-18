package com.bjhy.seata.dubbo.provider.api;

import java.util.List;

import org.apel.gaia.commons.i18n.Message;

import com.bjhy.seata.dubbo.provider.api.domain.GoodsInfo;

/**
 * 商品开放出来的接口
 * @author wulin
 *
 */
public interface GoodsOpenService {

	/**
	 * 购买
	 * @param goodsId 购买商品的Id
	 * @param username 购买用户
	 * @param number 购买商品数量
	 * @return
	 */
	Message<List<GoodsInfo>> purchase(String goodsId,String username,Integer number);
}
