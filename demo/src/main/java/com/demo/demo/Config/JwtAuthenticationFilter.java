package com.demo.demo.Config;

import com.demo.demo.Utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();
        if (requestPath.contains("/ws")) {
            log.info("📢 WebSocket Request đang đi qua Filter: {}", requestPath);
        }
        String token = getTokenFromRequest(request);

        if (token != null && jwtUtils.validateToken(token)) {

            String username = jwtUtils.getUsernameFromToken(token);

            String scope = jwtUtils.getScopeFromToken(token);

            System.out.println("DEBUG FILTER USER: " + username);
            System.out.println("DEBUG FILTER SCOPE: " + scope);

            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            if (StringUtils.hasText(scope)) {
                String[] roles = scope.split(" ");
                for (String role : roles) {
                    authorities.add(new SimpleGrantedAuthority(role));
                }
            }

            var authentication = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    authorities
            );

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));


            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        if (requestPath.contains("/ws")) {
            log.info("✅ Filter đã cho qua WebSocket: {}", requestPath);
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
