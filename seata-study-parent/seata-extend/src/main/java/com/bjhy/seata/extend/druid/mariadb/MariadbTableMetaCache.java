package com.bjhy.seata.extend.druid.mariadb;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.rm.datasource.sql.struct.cache.MysqlTableMetaCache;

@LoadLevel(name = ExtendConstants.MARIADB)
public class MariadbTableMetaCache extends MysqlTableMetaCache{

}
