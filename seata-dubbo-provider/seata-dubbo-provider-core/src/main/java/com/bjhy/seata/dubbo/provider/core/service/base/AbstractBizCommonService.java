package com.bjhy.seata.dubbo.provider.core.service.base;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.persistence.Id;

import org.apel.gaia.commons.autocomplete.executor.BeanAutoCompleteExecutor;
import org.apel.gaia.commons.autocomplete.generator.id.IdGenerator;
import org.apel.gaia.commons.pager.Condition;
import org.apel.gaia.commons.pager.Order;
import org.apel.gaia.commons.pager.PageBean;
import org.apel.gaia.persist.dao.CommonRepository;
import org.apel.gaia.util.BeanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * 公用业务接口抽象实现类
 * @author lijian
 */
//@Component
@Transactional
public abstract class AbstractBizCommonService<T,PK extends Serializable> implements BizCommonService<T, PK>{
	private static final Logger logger = LoggerFactory.getLogger(AbstractBizCommonService.class);
	
	@SuppressWarnings("unchecked")
	protected Class<T> entityClass = (Class<T>)((ParameterizedType)getClass().getGenericSuperclass()).getActualTypeArguments()[0];
	
	//泛型注入
	@Autowired
	private CommonRepository<T, PK> repository;
	
	@Autowired
	private	IdGenerator idGenerator;
	
	/**
	 * 返回实现repository接口的实例对象
	 */
	protected CommonRepository<T, PK> getRepository(){
		return this.repository;
	}
	
	/**
	 * 返回分页ql语句
	 */
	protected String getPageQl(){
		return "from " + entityClass.getSimpleName() + " where 1=1";
	}
	
	@Override
	public T findById(PK id) {
		return getRepository().findOne(id);
	}
	
	@Override
	public List<T> findAll(Sort sort){
		return getRepository().findAll(sort);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<T> findByCondition(Condition... conditions){
		return (List<T>)getRepository().doList(getPageQl(), Arrays.asList(conditions), new ArrayList<Order>(), false);
	}
	
	private Object complete(T record,boolean isUpdate){
		Object id =  BeanAutoCompleteExecutor.complete(record, idGenerator, isUpdate);
		if(id==null){
			id = getId(record);
		}
		return id;
	}

	@SuppressWarnings("unchecked")
	@Override
	public PK save(T entity) {
		Object id = complete(entity,false);
		try {
			getRepository().store(entity);
		}catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
		
		if(StringUtils.isEmpty(id)) {
			id = complete(entity,false); 
		}
		return (PK) id;
	}
	
	@SuppressWarnings("unchecked")
	private PK getId(T record){
		Class<?> entityClass = record.getClass();
		PK id = null;
		try {
			Field idField = null;
			Field[] fields = entityClass.getDeclaredFields();
			for (Field field : fields) {
				Id annotation = field.getAnnotation(Id.class);
				if(annotation!=null) {
					idField = field;
					break;
				}
			}
			if(idField==null)
			idField = entityClass.getDeclaredField("id");
			
			idField.setAccessible(true);
			id = (PK) idField.get(record);
		} catch (NoSuchFieldException | SecurityException e) {
			try {
				Method method = entityClass.getMethod("getId");
				id = (PK) method.invoke(record);
			} catch (NoSuchMethodException | SecurityException e1) {
				logger.error("getId",e1);
			} catch (IllegalAccessException e1) {
				logger.error("getId",e1);
			} catch (IllegalArgumentException e1) {
				logger.error("getId",e1);
			} catch (InvocationTargetException e1) {
				logger.error("getId",e1);
			}
		} catch (IllegalArgumentException e) {
			logger.error("getId",e);
		} catch (IllegalAccessException e) {
			logger.error("getId",e);
		}
		
		return id;
	}
	

	@Override
	public void update(T entity) {
		try {
			PK id = getId(entity);
			T sourceEntity = getRepository().findOne(id);
			BeanUtils.copyNotNullProperties(entity, sourceEntity);
			complete(sourceEntity,true);
			getRepository().update(sourceEntity);
		} catch (Exception e) {
			throw new RuntimeException(e);
		} 
	}

	@Override
	public PK saveOrUpdate(T entity) {
		try {
			PK id = getId(entity);
			if(StringUtils.isEmpty(id)){
				return save(entity);
			}else{
				update(entity);
				return id;
			}
		} catch (Exception e) {
			logger.error("saveOrUpdate",e);
			throw new RuntimeException(e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public void deleteById(PK... ids) {
		for (PK pk : ids) {
			getRepository().delete(pk);
		}
	}
	@SuppressWarnings("unchecked")
	@Override
	public void deleteLogicById(PK... ids) {
		for (PK pk : ids) {
			getRepository().deleteLogicById(pk);
		}
	}

	@Override
	public void pageQuery(PageBean pageBean) {
		getRepository().doPager(pageBean, getPageQl());
	}


}
