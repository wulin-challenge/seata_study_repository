package com.bjhy.seata.extend.druid.dm;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.rm.datasource.undo.oracle.keyword.OracleKeywordChecker;

@LoadLevel(name = ExtendConstants.DM)
public class DmKeywordChecker extends OracleKeywordChecker{
	

}
