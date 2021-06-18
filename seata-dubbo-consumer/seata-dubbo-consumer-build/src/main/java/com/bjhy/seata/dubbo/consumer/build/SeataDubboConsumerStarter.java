package com.bjhy.seata.dubbo.consumer.build;

import org.apel.gaia.container.boot.PlatformStarter;

public class SeataDubboConsumerStarter {
	
	public static void main(String[] args) {
		PlatformStarter.start(args);
		System.out.println("http://127.0.0.1:8555/seata-dubbo-consumer/accountEntity/index");
	}

}