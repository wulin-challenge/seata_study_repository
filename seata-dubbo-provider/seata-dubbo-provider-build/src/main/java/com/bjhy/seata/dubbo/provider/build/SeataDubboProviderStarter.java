package com.bjhy.seata.dubbo.provider.build;

import org.apel.gaia.container.boot.PlatformStarter;

public class SeataDubboProviderStarter {
	
	public static void main(String[] args) {
		PlatformStarter.start(args);
		System.out.println("http://127.0.0.1:8556/seata-dubbo-provider/goodsEntity/index");
	}

}