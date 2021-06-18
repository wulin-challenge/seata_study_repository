package com.bjhy.seata.extend.intercepter;

import java.lang.reflect.Method;
import java.net.URL;
import java.security.CodeSource;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;

import org.apache.commons.lang.StringUtils;

import com.alibaba.druid.util.JdbcConstants;

import net.bytebuddy.implementation.bind.annotation.AllArguments;
import net.bytebuddy.implementation.bind.annotation.Origin;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.implementation.bind.annotation.SuperCall;
import net.bytebuddy.implementation.bind.annotation.This;

public class ExtendInterceptor {
	 private final static String[] DRUID_CLASS_PREFIX = new String[]{"com.bjhy.seata.extend."};

	@RuntimeType
	public static Object intercept(@This(optional = true) Object me, @Origin Method method,@AllArguments Object[] params,@SuperCall Callable<Object> zuper) throws Exception {
		if("io.seata.sqlparser.druid.DruidDbTypeParserImpl".equals(method.getDeclaringClass().getName()) && "parseFromJdbcUrl".equals(method.getName())) {
			return parseFromJdbcUrl(me, method, params, zuper);
		}
		if("io.seata.sqlparser.druid.DruidIsolationClassLoader".equals(method.getDeclaringClass().getName()) && "loadClass".equals(method.getName()) && params != null && params.length == 2) {
			return loadClass(me, method, params, zuper);
		}
		Object call = zuper.call();
		
		if("io.seata.sqlparser.druid.DruidIsolationClassLoader".equals(method.getDeclaringClass().getName()) && "getDruidUrls".equals(method.getName())) {
			call = getDruidUrls((URL[])call);
		}
		return call;
	}
	
    private static String parseFromJdbcUrl(Object me, Method method,Object[] params,Callable<Object> zuper) throws Exception {
    	String jdbcUrl = (String) params[0];
    	String dbType = (String) zuper.call();
    	if(StringUtils.isBlank(dbType)) {
    		if(jdbcUrl.startsWith("jdbc:kingbase8:")) {
    			return JdbcConstants.KINGBASE;
    		} 
    	}
        return dbType;
    }
	
    private static Class<?> loadClass(Object me, Method method,Object[] params,Callable<Object> zuper) throws Exception {
       
    	String name = (String) params[0];
    	for (String prefix : DRUID_CLASS_PREFIX) {
            if (name.startsWith(prefix)) {
            	Method loadInternalClassMethod = method.getDeclaringClass().getDeclaredMethod("loadInternalClass", String.class,boolean.class);
            	if(!loadInternalClassMethod.isAccessible()) {
            		loadInternalClassMethod.setAccessible(true);
            	}
            	return (Class<?>) loadInternalClassMethod.invoke(me, params);
            	
            }
        }
        return (Class<?>) zuper.call();
    }
	
	private static URL[] getDruidUrls(URL[] urlArray) {
        List<URL> urls = new ArrayList<>();
        for (URL url : urlArray) {
        	urls.add(url);
		}
        urls.add(findClassLocation(ExtendInterceptor.class));
        return urls.toArray(new URL[0]);
    }
	
	private static URL findClassLocation(Class<?> clazz) {
        CodeSource cs = clazz.getProtectionDomain().getCodeSource();
        if (cs == null) {
            throw new IllegalStateException("Not a normal druid startup environment");
        }
        return cs.getLocation();
    }
}