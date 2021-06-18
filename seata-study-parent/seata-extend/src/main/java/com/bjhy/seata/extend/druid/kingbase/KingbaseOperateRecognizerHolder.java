package com.bjhy.seata.extend.druid.kingbase;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.sqlparser.druid.postgresql.PostgresqlOperateRecognizerHolder;

@LoadLevel(name = ExtendConstants.KINGBASE)
public class KingbaseOperateRecognizerHolder extends PostgresqlOperateRecognizerHolder{

}
