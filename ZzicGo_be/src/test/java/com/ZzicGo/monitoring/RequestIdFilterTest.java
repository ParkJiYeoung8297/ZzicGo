package com.ZzicGo.monitoring;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.slf4j.LoggerFactory;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

class RequestIdFilterTest {

    private final RequestIdFilter filter = new RequestIdFilter();

    @Test
    void usesValidIncomingRequestIdAndClearsMdcAfterRequest() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        String incomingRequestId = "client-request-123";
        request.addHeader(RequestIdFilter.REQUEST_ID_HEADER, incomingRequestId);

        filter.doFilter(request, response, (servletRequest, servletResponse) ->
                assertThat(MDC.get(RequestIdFilter.REQUEST_ID_MDC_KEY)).isEqualTo(incomingRequestId));

        assertThat(response.getHeader(RequestIdFilter.REQUEST_ID_HEADER)).isEqualTo(incomingRequestId);
        assertThat(MDC.get(RequestIdFilter.REQUEST_ID_MDC_KEY)).isNull();
    }

    @Test
    void replacesInvalidIncomingRequestId() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        request.addHeader(RequestIdFilter.REQUEST_ID_HEADER, "invalid request id\nAuthorization: secret");

        filter.doFilter(request, response, (servletRequest, servletResponse) -> {
        });

        assertThat(response.getHeader(RequestIdFilter.REQUEST_ID_HEADER))
                .matches("^[a-f0-9-]{36}$")
                .doesNotContain("secret");
        assertThat(MDC.get(RequestIdFilter.REQUEST_ID_MDC_KEY)).isNull();
    }

    @Test
    void logsRequestSummaryWithoutQueryString() throws ServletException, IOException {
        Logger logger = (Logger) LoggerFactory.getLogger(RequestIdFilter.class);
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        appender.start();
        logger.addAppender(appender);

        try {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/z1/histories");
            request.setQueryString("token=must-not-be-logged");
            MockHttpServletResponse response = new MockHttpServletResponse();

            filter.doFilter(request, response, (servletRequest, servletResponse) ->
                    ((MockHttpServletResponse) servletResponse).setStatus(201));

            ILoggingEvent event = appender.list.getLast();
            Map<String, Object> fields = event.getKeyValuePairs().stream()
                    .collect(Collectors.toMap(pair -> pair.key, pair -> pair.value));

            assertThat(fields)
                    .containsEntry("event", "http_request")
                    .containsEntry("method", "POST")
                    .containsEntry("path", "/api/z1/histories")
                    .containsEntry("status", 201);
            assertThat(fields.get("durationMs")).isInstanceOf(Long.class);
            assertThat(fields.toString()).doesNotContain("must-not-be-logged");
        } finally {
            logger.detachAppender(appender);
            appender.stop();
        }
    }
}
