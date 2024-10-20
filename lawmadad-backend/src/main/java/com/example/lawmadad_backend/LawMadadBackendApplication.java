package com.example.lawmadad_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class LawMadadBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(LawMadadBackendApplication.class, args);
	}
}
