package com.demo.demo.Service.Impl;

import com.demo.demo.Dto.Request.LoginRequest;
import com.demo.demo.Dto.Request.RefreshRequest;
import com.demo.demo.Dto.Response.TokenResponse;
import com.demo.demo.Entity.RefreshToken;
import com.demo.demo.Entity.User;
import com.demo.demo.Repository.RefreshTokenRepository;
import com.demo.demo.Repository.UserRepository;
import com.demo.demo.Utils.JwtUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    RefreshTokenRepository refreshTokenRepository;
    PasswordEncoder passwordEncoder;
    JwtUtils jwtUtils;

    // LOGIN
    public TokenResponse login(LoginRequest request) {
        // 1. Tìm user
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("DEBUG CHECK ROLE: " + user.getUsername());
        System.out.println("DEBUG ROLE COUNT: " + user.getRoles().size());
        user.getRoles().forEach(r -> System.out.println("DEBUG ROLE: " + r.getName()));
        // 2. Check pass
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated) throw new RuntimeException("Wrong password");

        // 3. Tạo cặp bài trùng Token
        var accessToken = jwtUtils.generateAccessToken(user);
        var refreshToken = jwtUtils.generateRefreshToken();

        // 4. LƯU Refresh Token xuống DB (Quan trọng!)
        saveRefreshTokenToDb(user, refreshToken);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // REFRESH TOKEN FLOW
    public TokenResponse refreshToken(RefreshRequest request) {
        // 1. Tìm Refresh Token trong DB
        var storedToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("Refresh token not found in DB"));

        // 2. Kiểm tra hết hạn
        if (storedToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(storedToken); // Hết hạn thì xóa luôn cho sạch DB
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }

        // 3. Nếu ngon lành -> Cấp Access Token Mới
        var user = storedToken.getUser();
        var newAccessToken = jwtUtils.generateAccessToken(user);

        // (Tuỳ chọn) Có thể cấp luôn RefreshToken mới (Rotation) để bảo mật hơn.
        // Ở đây mình giữ nguyên RefreshToken cũ cho đơn giản.

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(request.getRefreshToken()) // Trả lại cái cũ
                .build();
    }

    // LOGOUT
    @Transactional // Nhớ import jakarta.transaction.Transactional
    public void logout(String accessToken) {
        // 1. Lấy username từ Access Token (Token bạn đang dùng để đăng nhập)
        String username = jwtUtils.getUsernameFromToken(accessToken);

        if (username == null) {
            throw new RuntimeException("Token không hợp lệ hoặc không xác định được user");
        }

        // 2. Tìm User trong DB
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Xóa TOÀN BỘ Refresh Token của user này
        // (Nghĩa là đăng xuất khỏi cả điện thoại, laptop... cho an toàn)
        refreshTokenRepository.deleteByUser(user);
    }

    private void saveRefreshTokenToDb(User user, String token) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token)
                .expiryDate(Instant.now().plusSeconds(604800)) // 7 ngày
                .build();
        refreshTokenRepository.save(refreshToken);
    }
}
