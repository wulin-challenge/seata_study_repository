package com.bjhy.seata.dubbo.provider.core.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bjhy.seata.dubbo.provider.core.domain.GoodsEntity;
import com.bjhy.seata.dubbo.provider.core.service.GoodsEntityService;
import com.bjhy.seata.dubbo.provider.core.service.base.AbstractBizCommonService;

/**
 * 商品 service实现
 *
 */
@Service
@Transactional
public class GoodsEntityServiceImpl extends AbstractBizCommonService<GoodsEntity, String> implements GoodsEntityService  {

}