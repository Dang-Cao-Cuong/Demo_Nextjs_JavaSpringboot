package com.demo.demo.Utils;

import com.demo.demo.Entity.User;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.time.Instant;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtUtils {

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public String generateAccessToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("haunguyen.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plusSeconds(VALID_DURATION).toEpochMilli()))
                .claim("scope", buildScope(user))
                .build();
        Payload payload = new Payload(claims.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    public String generateRefreshToken() {
        return UUID.randomUUID().toString();
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> stringJoiner.add("ROLE_" + role.getName()));
        }
        return stringJoiner.toString();
    }

    public boolean validateToken(String token) {
        try {
            // 1. Parse trực tiếp sang SignedJWT (thay vì JWSObject)
            SignedJWT signedJWT = SignedJWT.parse(token);

            // 2. Tạo Verifier
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

            // 3. Kiểm tra chữ ký (verify) VÀ Kiểm tra hạn sử dụng (expiration)
            boolean isVerified = signedJWT.verify(verifier);
            boolean isNotExpired = new Date().before(signedJWT.getJWTClaimsSet().getExpirationTime());

            return isVerified && isNotExpired;

        } catch (Exception e) {
            log.error("Token invalid/expired", e); // In lỗi ra để debug nếu cần
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            // CÁCH MỚI: Parse thẳng sang SignedJWT để tránh lỗi NullPointerException
            SignedJWT signedJWT = SignedJWT.parse(token);

            // Lấy subject (username) ra an toàn
            return signedJWT.getJWTClaimsSet().getSubject();

        } catch (Exception e) {
            log.error("Lỗi khi lấy username từ token", e);
            return null;
        }
    }

    public String getScopeFromToken(String token) {
        try {
            JWSObject jwsObject = JWSObject.parse(token);
            return jwsObject.getPayload().toJSONObject().get("scope").toString();
        } catch (Exception e) {
            return "";
        }
    }
}
