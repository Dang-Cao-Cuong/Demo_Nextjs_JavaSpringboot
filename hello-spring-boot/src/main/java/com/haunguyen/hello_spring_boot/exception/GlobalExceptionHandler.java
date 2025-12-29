package com.haunguyen.hello_spring_boot.exception;

import com.haunguyen.hello_spring_boot.dto.request.ApiResponse;
import com.haunguyen.hello_spring_boot.dto.response.ValidationError;
import jakarta.validation.ConstraintViolation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;
    import java.util.Map;
    import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final String MIN_ATTRIBUTE = "min";

    @ExceptionHandler(value= RuntimeException.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception){
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(ErrorCode.USER_EXISTED.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }
    @ExceptionHandler(value= AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception){
        ErrorCode errorCode = exception.getErrorCode();

        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception) {

        List<ValidationError> result = exception.getBindingResult().getFieldErrors()
                .stream()
                .map(fieldError -> {
                    String enumKey = fieldError.getDefaultMessage();

                    ErrorCode errorCode = ErrorCode.INVALID_KEY;
                    Map<String, Object> attributes = null;

                    try {
                        errorCode = ErrorCode.valueOf(enumKey);

                        var constraintViolation = fieldError.unwrap(ConstraintViolation.class);

                        attributes = constraintViolation.getConstraintDescriptor().getAttributes();

                    } catch (IllegalArgumentException | UnsupportedOperationException e) {
                    }

                    String finalMessage = Objects.nonNull(attributes)
                            ? mapAttribute(errorCode.getMessage(), attributes)
                            : errorCode.getMessage();

                    return new ValidationError(fieldError.getField(), finalMessage);
                })
                .toList();

        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(ErrorCode.INVALID_KEY.getCode());
        apiResponse.setMessage("Validation failed");
        apiResponse.setResult(result);

        return ResponseEntity.badRequest().body(apiResponse);
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));

        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handlingAccessDeniedException(AccessDeniedException exception){
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }


}
