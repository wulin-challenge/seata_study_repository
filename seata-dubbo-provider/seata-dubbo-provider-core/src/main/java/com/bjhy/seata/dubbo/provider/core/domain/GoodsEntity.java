package com.bjhy.seata.dubbo.provider.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.apel.gaia.persist.domain.CommonFiled;

/**
 * 商品
 */
@Entity
@Table(name = "study_goods")
public class GoodsEntity extends CommonFiled  {
	private static final long serialVersionUID = 1L;
	
	/**
	 * 商品名称
	 */
	@Column(name="goodsName",length = 100)
	private String goodsName;
	
	/**
	 * 价格
	 */
	@Column(name="price",length = 10)
	private Double price;
	
	/**
	 * 商品库存数量
	 */
	@Column(name="goodsNumber",length = 10)
	private Integer goodsNumber;
	
    /**
	 * 商品名称
	 */
	public void setGoodsName(String goodsName) {
		this.goodsName = goodsName;
	}

	/**
	 * 商品名称
	 */
	public String getGoodsName() {
		return goodsName;
	}
	
    /**
	 * 价格
	 */
	public void setPrice(Double price) {
		this.price = price;
	}

	/**
	 * 价格
	 */
	public Double getPrice() {
		return price;
	}
	
    /**
	 * 商品库存数量
	 */
	public void setGoodsNumber(Integer goodsNumber) {
		this.goodsNumber = goodsNumber;
	}

	/**
	 * 商品库存数量
	 */
	public Integer getGoodsNumber() {
		return goodsNumber;
	}
	
}