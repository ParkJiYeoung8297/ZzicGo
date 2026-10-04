package com.ZzicGo.monitoring;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;
import java.util.regex.Pattern;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class RequestIdFilter extends OncePerRequestFilter {

    public static final String REQUEST_ID_HEADER = "X-Request-ID";
    public static final String REQUEST_ID_MDC_KEY = "requestId";

    private static final Pattern VALID_REQUEST_ID = Pattern.compile("^[A-Za-z0-9._-]{8,128}$");

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String requestId = resolveRequestId(request.getHeader(REQUEST_ID_HEADER));
        response.setHeader(REQUEST_ID_HEADER, requestId);
        long startedAt = System.nanoTime();
        boolean completedNormally = false;

        try (MDC.MDCCloseable ignored = MDC.putCloseable(REQUEST_ID_MDC_KEY, requestId)) {
            try {
                filterChain.doFilter(request, response);
                completedNormally = true;
            } finally {
                long durationMs = (System.nanoTime() - startedAt) / 1_000_000;
                int status = resolveStatus(response, completedNormally);

                if (shouldLogRequest(request, status)) {
                    log.atInfo()
                            .addKeyValue("event", "http_request")
                            .addKeyValue("method", request.getMethod())
                            .addKeyValue("path", request.getRequestURI())
                            .addKeyValue("status", status)
                            .addKeyValue("durationMs", durationMs)
                            .log(
                                    "{} {} → {} ({}ms)",
                                    request.getMethod(),
                                    request.getRequestURI(),
                                    status,
                                    durationMs
                            );
                }
            }
        } finally {
            MDC.remove(REQUEST_ID_MDC_KEY);
        }
    }

    private int resolveStatus(HttpServletResponse response, boolean completedNormally) {
        if (!completedNormally && response.getStatus() < HttpServletResponse.SC_BAD_REQUEST) {
            return HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
        }
        return response.getStatus();
    }

    private boolean shouldLogRequest(HttpServletRequest request, int status) {
        boolean successfulHealthCheck = "/actuator/health".equals(request.getRequestURI())
                && status >= HttpServletResponse.SC_OK
                && status < HttpServletResponse.SC_MULTIPLE_CHOICES;
        return !successfulHealthCheck;
    }

    private String resolveRequestId(String candidate) {
        if (candidate != null && VALID_REQUEST_ID.matcher(candidate).matches()) {
            return candidate;
        }
        return UUID.randomUUID().toString();
    }
}
