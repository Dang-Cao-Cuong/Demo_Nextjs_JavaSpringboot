package com.demo.demo.Dto.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenResponse {
    String accessToken;
    String refreshToken;
}
