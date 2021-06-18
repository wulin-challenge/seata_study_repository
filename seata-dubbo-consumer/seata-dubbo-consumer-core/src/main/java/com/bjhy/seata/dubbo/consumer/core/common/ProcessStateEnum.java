package com.bjhy.seata.dubbo.consumer.core.common;

/**
 * 流程状态枚举
 */
public enum ProcessStateEnum {
	NEW("新建"),REJECT("已拒绝"),ARCHIVE("已归档");
	
	private String value;

	private ProcessStateEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}
}