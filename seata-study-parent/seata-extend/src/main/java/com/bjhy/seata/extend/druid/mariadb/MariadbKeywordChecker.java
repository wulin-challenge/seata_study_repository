package com.bjhy.seata.extend.druid.mariadb;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.rm.datasource.undo.mysql.keyword.MySQLKeywordChecker;

@LoadLevel(name = ExtendConstants.MARIADB)
public class MariadbKeywordChecker extends MySQLKeywordChecker{

}
