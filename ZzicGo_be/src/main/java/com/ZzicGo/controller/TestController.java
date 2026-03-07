package com.ZzicGo.controller;

import com.ZzicGo.config.jwt.CustomUserDetails;
import com.ZzicGo.config.jwt.JwtProvider;
import com.ZzicGo.global.CustomException;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.global.GeneralErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name="test", description = "테스트용 API")
@RestController
@RequestMapping("/api/z1")
public class TestController {

//    @Operation(summary = "api 테스트 확인", description = "테스트용 api입니다.")
//    @ApiResponses({
//            @ApiResponse(responseCode = "200", description = "테스트 성공")
//    })
//    @GetMapping("/test")
//    public CustomResponse<String> test() {
//        String response = "Hello from Spring Boot 👋";
////        throw new CustomException(GeneralErrorCode.INTERNAL_SERVER_ERROR_500);
//        return CustomResponse.ok(response);
//    }

    private final JwtProvider jwtProvider;

    public TestController(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Operation(summary = "api 테스트 확인",
            description = """
                    테스트용 api입니다.
                    만약 이 api가 통과하지 않는다면, SecurityConfig에 url을 추가해야합니다.
                    
                    인증이 필요없다면, PERMIT_ALL_URL_ARRAY에 추가하고, 
                    인증이 필요하다면, REQUEST_AUTHENTICATED_ARRAY에 추가해주세요.
                    """)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "테스트 성공")
    })
    @GetMapping("/test")
    public CustomResponse<String> test() {
        String response = "Hello from Spring Boot 👋";
        return CustomResponse.ok(response);
    }

    @Operation(summary = "api 권한 테스트 확인",
            description = """
                    테스트용 api입니다.
                    Swagger에서 Authorize에 토큰을 입력한 후 사용해야 정상 작동합니다.
                    """)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "테스트 성공"),
            @ApiResponse(responseCode = "COMMON401_1", description = "인증이 필요합니다.")
    })
    @GetMapping("/test-auth")
    public CustomResponse<String> testAuth(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        String response = "Hello from Spring Boot 👋";
        return CustomResponse.ok(response);
    }
}
