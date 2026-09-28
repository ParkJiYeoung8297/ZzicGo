package com.ZzicGo.monitoring;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;
import org.springframework.boot.ansi.AnsiColor;
import org.springframework.boot.ansi.AnsiOutput;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class HttpStatusColorConverter extends ClassicConverter {

    private static final Pattern HTTP_STATUS_PATTERN = Pattern.compile("(?<=→ )\\d{3}(?= \\()");

    @Override
    public String convert(ILoggingEvent event) {
        String message = event.getFormattedMessage();
        Matcher matcher = HTTP_STATUS_PATTERN.matcher(message);

        if (!matcher.find()) {
            return message;
        }

        int status = Integer.parseInt(matcher.group());
        String coloredStatus = AnsiOutput.toString(
                colorFor(status),
                matcher.group(),
                AnsiColor.DEFAULT
        );

        return message.substring(0, matcher.start())
                + coloredStatus
                + message.substring(matcher.end());
    }

    private AnsiColor colorFor(int status) {
        if (status >= 500) {
            return AnsiColor.RED;
        }
        if (status >= 400) {
            return AnsiColor.YELLOW;
        }
        if (status >= 300) {
            return AnsiColor.CYAN;
        }
        if (status >= 200) {
            return AnsiColor.GREEN;
        }
        return AnsiColor.DEFAULT;
    }
}
