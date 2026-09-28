# 로깅 및 프론트 telemetry 규약

## 목적

백엔드, 접근 로그와 프론트엔드 telemetry를 Grafana Cloud Loki에서 일관되게 검색하고 집계하기 위한 규약이다.

## 구조화 로그

백엔드 애플리케이션 로그는 가능한 한 JSON으로 기록한다.

```json
{
  "timestamp": "2026-09-28T15:30:12.391+09:00",
  "level": "ERROR",
  "application": "zzicgo-backend",
  "environment": "production",
  "requestId": "c43628c1",
  "event": "history_upload_failed",
  "logger": "com.ZzicGo.service.HistoryService",
  "method": "POST",
  "path": "/api/z1/histories",
  "status": 500,
  "durationMs": 438,
  "exception": "AmazonS3Exception",
  "message": "Failed to upload history image"
}
```

필드는 해당 이벤트에 의미가 있을 때만 기록한다. 빈 값을 채우기 위해 필드를 강제로 추가하지 않는다.

## 로그 레벨

- `ERROR`: 처리되지 않은 예외, 요청 실패, 즉시 확인이 필요한 외부 연동 실패
- `WARN`: 복구 가능한 실패, 잘못된 인증, 사용자 요청 거부, 재시도 성공 가능 상태
- `INFO`: 정상적인 주요 비즈니스 상태 변화와 배포·시작·종료
- `DEBUG`: 로컬 개발에서만 사용하며 운영에서는 비활성화

운영 환경의 Spring Web과 Spring Security 로그는 INFO 또는 WARN으로 유지한다.

## 표준 event 이름

초기 event 이름은 다음으로 통일한다.

- `unhandled_exception`
- `auth_login_failed`
- `request_rejected`
- `token_validation_failed`
- `token_refresh_failed`
- `history_upload_failed`
- `s3_upload_failed`
- `fcm_send_failed`
- `challenge_join_failed`
- `frontend_error`
- `frontend_performance`

event 이름은 `snake_case`를 사용한다. 로그 메시지 문구가 바뀌어도 event 이름은 유지한다.

## 예외 기록

예상하지 못한 예외는 메시지만 기록하지 않고 stack trace를 포함한다.

```java
log.error("event=unhandled_exception", ex);
```

예상 가능한 도메인 예외는 WARN으로 기록하되 사용자 입력값 전체를 남기지 않는다.

## Request ID

각 HTTP 요청에 `X-Request-ID`를 부여한다.

1. 유효한 `X-Request-ID`가 들어오면 검증 후 사용한다.
2. 없거나 유효하지 않으면 서버가 새 값을 생성한다.
3. MDC의 `requestId`에 저장한다.
4. 접근 로그, 애플리케이션 로그와 응답 헤더에 같은 값을 사용한다.
5. 요청 처리 완료 후 `finally`에서 MDC를 제거한다.

프론트엔드에서 응답의 Request ID를 확인할 수 있도록 CORS의 exposed header에 `X-Request-ID`를 추가한다.

## 접근 로그

접근 로그에는 최소한 다음 값을 포함한다.

- timestamp
- requestId
- method
- route 또는 path
- status
- durationMs
- client IP
- user agent

query string은 기본적으로 기록하지 않는다. 사용자 ID가 포함되는 실제 URL은 가능하면 route template으로 정규화한다.

## 민감정보 제외

다음 값은 로그와 프론트 telemetry에 기록하지 않는다.

- JWT와 refresh token
- `Authorization`, `Cookie` 헤더
- OAuth authorization code, client secret
- 비밀번호
- AWS access key와 secret key
- 이메일, 생년월일 등 불필요한 개인정보
- 이미지 원본과 multipart payload
- 전체 요청·응답 body
- URL query string

## Loki label 정책

값의 종류가 제한된 필드만 label로 사용한다.

권장 label:

- `application`
- `environment`
- `level`
- `event`
- `method`
- `status`

다음 고카디널리티 값은 label로 사용하지 않고 로그 본문에만 둔다.

- `requestId`
- `userId`, `email`
- 실제 ID가 포함된 URL
- `challengeId`, `historyId`
- 예외 메시지와 stack trace

## 프론트엔드 오류 수집

프론트엔드는 모든 `console.log`를 전송하지 않는다. 다음 오류만 제한적으로 수집한다.

- `window.error`
- `unhandledrejection`
- API 5xx
- PWA service worker 초기화 실패

초기 수집 endpoint는 다음과 같다.

```text
POST /api/z1/telemetry/client-errors
```

요청 예시:

```json
{
  "type": "unhandled_rejection",
  "message": "Failed to fetch",
  "page": "/z1/challenges/:challengeId",
  "browser": "Chrome",
  "requestId": "c43628c1"
}
```

백엔드는 입력값을 검증한 후 `application=zzicgo-frontend`, `event=frontend_error`인 구조화 로그로 변환한다. 브라우저가 보내는 값은 조작 가능하므로 보안 감사 데이터로 사용하지 않는다.

## 프론트엔드 렌더링 성능 수집

서버 접근 로그의 응답시간은 브라우저 렌더링 시간을 나타내지 않는다. `web-vitals`와 브라우저 Performance API로 실제 사용자 성능을 측정한다.

초기 수집 지표:

- `LCP`: 주요 콘텐츠가 화면에 표시되는 시간
- `FCP`: 첫 콘텐츠가 화면에 표시되는 시간
- `TTFB`: 첫 응답 바이트 수신 시간
- `ROUTE_TRANSITION`: SPA 경로 변경 시작부터 다음 화면 paint까지 걸린 시간

필요해지면 `INP`와 `CLS`를 추가한다. React Profiler의 component render duration은 API 대기, 이미지 로딩, layout과 paint를 모두 포함하지 않으므로 주 지표로 사용하지 않는다.

```text
web-vitals / Performance API
            │
            ▼
POST /api/z1/telemetry/performance
            │
            ▼
Spring Boot `frontend_performance` 구조화 로그
            │
            ▼
Alloy → Loki → Grafana
```

성능 이벤트 형식:

```json
{
  "metric": "LCP",
  "value": 2134,
  "rating": "good",
  "page": "/z1/challenges/:challengeId",
  "navigationType": "navigate"
}
```

수집 endpoint는 다음 정책을 적용한다.

- `LCP`, `FCP`, `TTFB`, `ROUTE_TRANSITION` 등 허용된 metric만 수용
- 숫자 값의 하한과 비정상적으로 큰 상한 검증
- `good`, `needs-improvement`, `poor` 등 허용된 rating만 수용
- 실제 ID가 포함된 URL을 route template으로 변환
- query string 제거
- 문자열 길이와 전체 payload 크기 제한
- 사용자 또는 IP 단위 rate limit
- 동일 이벤트 반복 전송 제한
- 필요하면 전체 세션 중 일부만 샘플링

브라우저는 페이지 종료 시에도 전송할 수 있도록 `navigator.sendBeacon`을 우선 사용하고, 지원하지 않으면 `fetch`의 `keepalive` 옵션을 사용한다.

## Grafana 조회 예시

Request ID로 관련 로그 조회:

```logql
{application="zzicgo-backend"}
| json
| requestId="c43628c1"
```

최근 5분 ERROR 수:

```logql
sum(
  count_over_time(
    {application="zzicgo-backend", level="ERROR"}[5m]
  )
)
```

프론트 LCP p75:

```logql
quantile_over_time(
  0.75,
  {application="zzicgo-frontend"}
  | json
  | metric="LCP"
  | unwrap value [1h]
)
```
