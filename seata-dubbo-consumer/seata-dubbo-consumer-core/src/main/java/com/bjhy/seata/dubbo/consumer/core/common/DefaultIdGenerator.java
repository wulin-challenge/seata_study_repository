package com.bjhy.seata.dubbo.consumer.core.common;

import org.apel.gaia.commons.autocomplete.generator.id.IdGenerator;
import org.apel.gaia.util.UUIDUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DefaultIdGenerator implements IdGenerator{
	private static final Logger logger = LoggerFactory.getLogger(DefaultIdGenerator.class);

	@Override
	public Object getId(Class<?> typeClass) {
		try {
			Object obj = typeClass.newInstance();
			if(obj instanceof String){
				return getStringId();
			}
		} catch (InstantiationException e) {
			logger.error("getId",e);
		} catch (IllegalAccessException e) {
			logger.error("getId",e);
		}
		return null;
	}
	
	public String getStringId(){
		return UUIDUtil.uuid();
	}
	
}
