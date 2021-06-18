package com.bjhy.seata.extend.druid.dm;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.sqlparser.druid.oracle.OracleOperateRecognizerHolder;

@LoadLevel(name = ExtendConstants.DM)
public class DmOperateRecognizerHolder extends OracleOperateRecognizerHolder{

}
