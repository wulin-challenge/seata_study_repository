package com.bjhy.seata.extend.druid.dm;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.rm.datasource.undo.oracle.OracleUndoExecutorHolder;

@LoadLevel(name = ExtendConstants.DM)
public class DmUndoExecutorHolder extends OracleUndoExecutorHolder{

}
