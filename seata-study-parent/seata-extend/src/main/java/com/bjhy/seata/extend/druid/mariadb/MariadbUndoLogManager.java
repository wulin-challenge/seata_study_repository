package com.bjhy.seata.extend.druid.mariadb;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.rm.datasource.undo.mysql.MySQLUndoLogManager;
import io.seata.sqlparser.util.JdbcConstants;

@LoadLevel(name = ExtendConstants.MARIADB)
public class MariadbUndoLogManager extends MySQLUndoLogManager{

}
