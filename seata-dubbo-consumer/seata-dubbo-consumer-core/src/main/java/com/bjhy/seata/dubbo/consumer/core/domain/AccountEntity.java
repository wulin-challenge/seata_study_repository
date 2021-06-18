package com.bjhy.seata.dubbo.consumer.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.apel.gaia.persist.domain.CommonFiled;

/**
 * 账户
 */
@Entity
@Table(name = "study_account")
public class AccountEntity extends CommonFiled  {
	private static final long serialVersionUID = 1L;
	
	/**
	 * 账户昵称
	 */
	@Column(name="nickName",length = 64)
	private String nickName;
	
	/**
	 * 账户总金额
	 */
	@Column(name="totalAmount",length = 10)
	private Double totalAmount;
	
	/**
	 * 账户用户名
	 */
	@Column(name="username",length = 64)
	private String username;
	
    /**
	 * 账户昵称
	 */
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	/**
	 * 账户昵称
	 */
	public String getNickName() {
		return nickName;
	}
	
    /**
	 * 账户总金额
	 */
	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	/**
	 * 账户总金额
	 */
	public Double getTotalAmount() {
		return totalAmount;
	}
	
    /**
	 * 账户用户名
	 */
	public void setUsername(String username) {
		this.username = username;
	}

	/**
	 * 账户用户名
	 */
	public String getUsername() {
		return username;
	}
	
}