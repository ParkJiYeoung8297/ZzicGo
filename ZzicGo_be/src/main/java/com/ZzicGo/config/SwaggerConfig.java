package com.ZzicGo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI(){
        Info info = new Info()
                .title("📸 ZzicGo API")
                .version("1.0.0")
                .description("ZzicGo API 명세서입니다.");
        return new OpenAPI()
                .info(info); // 정보 띄우기
    }

}
