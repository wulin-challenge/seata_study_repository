package com.bjhy.seata.extend.druid.dm;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.rm.datasource.sql.struct.cache.OracleTableMetaCache;

@LoadLevel(name = ExtendConstants.DM)
public class DmTableMetaCache extends OracleTableMetaCache{

}
