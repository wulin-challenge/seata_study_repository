package com.bjhy.seata.extend.druid.kingbase;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.rm.datasource.undo.postgresql.keyword.PostgresqlKeywordChecker;

@LoadLevel(name = ExtendConstants.KINGBASE)
public class KingbaseKeywordChecker extends PostgresqlKeywordChecker{

}
