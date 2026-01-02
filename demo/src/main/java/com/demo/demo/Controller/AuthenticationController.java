package com.demo.demo.Controller;

import com.demo.demo.Dto.Request.LoginRequest;
import com.demo.demo.Dto.Request.RefreshRequest;
import com.demo.demo.Dto.Response.ApiResponse;
import com.demo.demo.Dto.Response.TokenResponse;
import com.demo.demo.Service.Impl.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.<TokenResponse>builder()
                .result(authenticationService.login(request))
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@RequestBody RefreshRequest request) {
        return ApiResponse.<TokenResponse>builder()
                .result(authenticationService.refreshToken(request))
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token không hợp lệ (Thiếu Bearer)");
        }

        String accessToken = authHeader.substring(7); // Cắt bỏ chữ "Bearer "
        authenticationService.logout(accessToken); // Gọi sang Service

        return ApiResponse.<Void>builder()
                .message("Logout thành công")
                .build();
    }
}
