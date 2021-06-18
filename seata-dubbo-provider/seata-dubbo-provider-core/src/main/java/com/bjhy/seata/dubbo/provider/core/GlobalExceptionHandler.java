package com.bjhy.seata.dubbo.provider.core;

import org.apel.gaia.container.boot.validation.DubboValidationExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

/**
 * 全局异常处理
 */
@ControllerAdvice
public class GlobalExceptionHandler extends DubboValidationExceptionHandler {
    //这里写自己的异常处理
}