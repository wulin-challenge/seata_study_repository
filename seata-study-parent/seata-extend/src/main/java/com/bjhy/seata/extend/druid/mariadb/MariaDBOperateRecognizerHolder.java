package com.bjhy.seata.extend.druid.mariadb;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.sqlparser.druid.mysql.MySQLOperateRecognizerHolder;

@LoadLevel(name = ExtendConstants.MARIADB)
public class MariaDBOperateRecognizerHolder extends MySQLOperateRecognizerHolder{

}
