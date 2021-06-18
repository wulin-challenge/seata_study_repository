package com.bjhy.seata.config;

import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.seata.spring.annotation.GlobalTransactionScanner;
import io.seata.spring.annotation.datasource.EnableAutoDataSourceProxy;
import io.seata.spring.boot.autoconfigure.properties.client.ServiceProperties;

/**
 * The type Seata configuration.
 */
//@Configuration
//@EnableAutoDataSourceProxy
public class SeataConfiguration {

	@Value("${spring.application.name}")
	private String applicationId;
	
	@Autowired
	private ServiceProperties serviceProperties;

	/**
	 * 注册一个StatViewServlet
	 *
	 * @return global transaction scanner
	 */
	@Bean
	public GlobalTransactionScanner globalTransactionScanner() {
		
        GlobalTransactionScanner globalTransactionScanner = new GlobalTransactionScanner(applicationId,getTxServiceGroup());
		return globalTransactionScanner;
	}
	
	private String getTxServiceGroup() {
		Map<String, String> vgroupMapping = serviceProperties.getVgroupMapping();
		String key = null;
		Set<Entry<String, String>> entrySet = vgroupMapping.entrySet();
		for (Entry<String, String> entry : entrySet) {
			key= entry.getKey();
			break;
		}
		return key;
	}
	
//	/**
//	 * Data source data source.
//	 *
//	 * @param druidDataSource the druid data source
//	 * @return the data source
//	 */
//	@Primary
//	@Bean("dataSourceProxy")
//	public DataSource dataSourceProxy(DataSource dataSource) {
//		DataSourceProxy dataSourceProxy = new DataSourceProxy(dataSource);
//		return dataSourceProxy;
//	}
}
