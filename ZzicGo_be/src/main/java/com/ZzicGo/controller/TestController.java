package com.ZzicGo.controller;

import com.ZzicGo.global.CustomException;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.global.GeneralErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name="test", description = "테스트용 API")
@RestController
@RequestMapping("/api/z1")
public class TestController {

    @Operation(summary = "api 테스트 확인", description = "테스트용 api입니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "테스트 성공")
    })
    @GetMapping("/test")
    public CustomResponse<String> test() {
        String response = "Hello from Spring Boot 👋";
//        throw new CustomException(GeneralErrorCode.INTERNAL_SERVER_ERROR_500);
        return CustomResponse.ok(response);
    }
}
