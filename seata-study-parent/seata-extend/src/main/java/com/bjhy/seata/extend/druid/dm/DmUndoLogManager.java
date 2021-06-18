package com.bjhy.seata.extend.druid.dm;

import com.bjhy.seata.extend.ExtendConstants;

import io.seata.common.loader.LoadLevel;
import io.seata.rm.datasource.undo.oracle.OracleUndoLogManager;

@LoadLevel(name = ExtendConstants.DM)
public class DmUndoLogManager extends OracleUndoLogManager{

}
