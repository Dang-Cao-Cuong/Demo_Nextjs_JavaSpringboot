package com.demo.demo.Config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.net.URI;

@Component
public class SwaggerAutoOpen {

    private final String SWAGGER_URL = "http://localhost:8080/cnc/v1/swagger-ui/index.html";

    @EventListener(ApplicationReadyEvent.class)
    public void openSwaggerAfterStartup() {
        System.out.println("khởi động trình duyệt mở Swagger...");
        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(SWAGGER_URL));
            } else {
                Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + SWAGGER_URL);
            }
        } catch (Exception e) {
            System.err.println("Không thể tự mở trình duyệt: " + e.getMessage());
        }
    }
}
