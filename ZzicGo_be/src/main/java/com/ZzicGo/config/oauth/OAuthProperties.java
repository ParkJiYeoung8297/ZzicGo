package com.ZzicGo.config.oauth;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "oauth")
public class OAuthProperties {

    private ProviderConfig naver;
    private ProviderConfig kakao;

    @Getter
    @Setter
    public static class ProviderConfig {

        private String clientId;
        private String clientSecret;
        private String redirectUri;

        private String tokenUri;
        private String profileUri;
    }
}