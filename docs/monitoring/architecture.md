# 모니터링 아키텍처

## 목적

이 문서는 ADR-001에서 선택한 Grafana Cloud와 Alloy 기반 모니터링의 컴포넌트 책임, 실행 경계와 데이터 흐름을 정의한다. 로그 필드와 프론트 성능 이벤트의 세부 규약은 [logging-convention.md](logging-convention.md), 단계별 구현 순서는 [plan.md](plan.md)를 따른다.

## 전체 구조

```text
ZzicGo_fe ── 브라우저 오류·성능 이벤트 ──┐
                                          ▼
                                   ZzicGo_be
                                   ├─ 애플리케이션 로그
                                   ├─ HTTP 접근 로그
                                   └─ Actuator metrics
                                          │
EC2/Nginx ── 시스템·접근·오류 로그 ──────┤
                                          ▼
                                    Grafana Alloy
                                    ├─ 로그 수집
                                    ├─ metrics scrape
                                    └─ Unix metrics
                                          │
                                          ▼
                                    Grafana Cloud
                                    ├─ Loki logs
                                    ├─ Prometheus metrics
                                    ├─ Dashboard
                                    ├─ Alert
                                    └─ Synthetic check
                                          ▲
                                          │ read-only query
                                    ZzicGo_admin
                                    ├─ backend
                                    └─ frontend
```

## 컴포넌트 책임

### `ZzicGo_be`

- 구조화된 애플리케이션 로그 생성
- HTTP 요청별 Request ID 생성과 전파
- 예외 stack trace 기록
- 프론트엔드 오류와 성능 telemetry 수신 및 검증
- 추후 Actuator/Micrometer 기반 애플리케이션 메트릭 제공
- 로그인, 이미지 업로드, S3와 FCM 등 비즈니스 이벤트 계측

### `ZzicGo_fe`

- 사용자에게 제공되는 React/PWA 애플리케이션
- 초기 화면의 LCP, FCP와 TTFB 측정
- SPA 경로 변경의 화면 전환 시간 측정
- 제한된 브라우저 오류 전송
- query string, token과 개인정보를 telemetry에서 제외

### Grafana Alloy

- Spring Boot, Tomcat/Nginx 및 systemd 로그 수집
- 로그 파싱, 고정 label 부여와 불필요한 로그 제거
- Grafana Cloud Loki로 로그 전송
- 추후 `/actuator/prometheus` scrape
- 추후 Unix exporter 기반 EC2 시스템 메트릭 수집

Alloy는 `ZzicGo_be`와 별도 프로세스로 실행한다. 백엔드 배포 시 Alloy를 재시작하지 않는다.

### Grafana Cloud

- Loki 로그 저장과 LogQL 조회
- Prometheus 호환 메트릭 저장과 PromQL 조회
- Dashboard와 alert rule 평가
- 외부에서 프론트 URL과 health endpoint 확인

무료 플랜 사용량과 보관 기간을 전제로 한다. 사용량을 통제하기 위해 운영 DEBUG 로그를 사용하지 않고 label cardinality를 제한한다.

### `ZzicGo_admin`

`ZzicGo_admin`은 필요해질 때 루트의 별도 애플리케이션으로 추가한다.

```text
ZzicGo_admin/
├─ backend/
└─ frontend/
```

관리자 백엔드는 Grafana를 대체하는 저장소가 아니라 관리자 화면을 위한 BFF다.

- Grafana Cloud의 metrics/logs 읽기 전용 자격 증명 보관
- 서버에 미리 정의된 PromQL과 LogQL 실행
- 조회 기간과 결과 건수 제한
- 15~60초의 짧은 응답 캐시
- Grafana 응답을 관리자 화면 DTO로 변환
- 관리자 인증·인가와 조회 감사 로그 기록

관리자 프론트엔드는 Grafana Cloud를 직접 호출하지 않는다. 브라우저가 임의 PromQL이나 LogQL을 전달하는 API도 제공하지 않는다.

관리자 화면에는 상태 요약과 최근 오류를 제공하고 상세 분석은 Grafana로 이동하는 링크를 제공한다.

## 실행 경계

초기에는 추가 EC2 비용을 피하기 위해 다음 프로세스를 같은 EC2에서 실행할 수 있다.

```text
zzicgo-api.service       # 사용자 API, 예: 8080
zzicgo-admin.service     # 향후 관리자 API, 예: 8081
grafana-alloy.service    # telemetry 수집기
nginx.service
```

이는 프로세스와 배포 생명주기를 분리하지만 EC2 장애 영역까지 분리하지는 않는다. Grafana Cloud와 외부 Synthetic Health Check가 EC2 밖에 있으므로 EC2 전체 장애 알림은 계속 받을 수 있다.

## 저장소 구조

```text
ZzicGo/
├─ ZzicGo_be/
├─ ZzicGo_fe/
├─ ZzicGo_admin/              # 향후 추가
│  ├─ backend/
│  └─ frontend/
├─ monitoring/                # 구현 단계에서 추가
│  ├─ alloy/
│  │  └─ config.alloy
│  ├─ dashboards/
│  ├─ alerts/
│  └─ README.md
└─ docs/
   ├─ adr/
   └─ monitoring/
```

`monitoring/`은 실행 애플리케이션 소스가 아니라 Alloy, dashboard와 alert의 배포 설정을 보관한다. `docs/monitoring/`은 설계와 운영 규약을 보관한다.

## 로그 우선 데이터 흐름

```text
Spring Boot app.log ──────────┐
Tomcat/Nginx access log ──────┼─ Alloy ── Grafana Cloud Loki
Nginx error log ──────────────┤
frontend telemetry API log ───┘
```

초기 대시보드는 로그에서 다음을 계산한다.

- 분당 전체 요청과 4xx/5xx 수
- ERROR/WARN 발생 추이
- event 종류별 오류 수
- 접근 로그 기반 응답시간 p95
- 최근 ERROR 로그와 Request ID 검색
- 프론트 성능 지표 p75와 `poor` 비율

로그 부재만으로 서비스 Down을 판단하지 않는다. 트래픽이 없는 정상 상태와 구분할 수 없기 때문이다. 서비스 가용성은 외부 Synthetic Health Check로 판정한다.

## 로그 생성, 출력 및 저장 구조

백엔드는 로그의 목적에 따라 애플리케이션 로그와 Tomcat 접근 로그를 분리한다.

| 로그 종류 | 생성 주체 | 터미널 | 저장 위치 |
|---|---|---:|---|
| Spring Boot, HikariCP 등 프레임워크 로그 | 각 라이브러리 logger | 출력 | `app.log` |
| 비즈니스 이벤트와 예외 | 서비스, `GlobalExceptionHandler` 등 | 출력 | `app.log` |
| API 요청 요약 | `RequestIdFilter` | 출력 | `app.log` |
| API 원본 접근 로그 | Tomcat AccessLogValve | 미출력 | `logs/access.YYYY-MM-DD.log` |
| Hibernate SQL과 bind parameter | Hibernate | 미출력 | 미수집 |

Spring, 애플리케이션 코드와 `RequestIdFilter`는 SLF4J를 통해 로그 이벤트를 생성한다. Logback은 같은 이벤트를 콘솔과 JSON 파일 appender로 전달한다.

```text
Spring / HikariCP / Service / RequestIdFilter
                      │
                      ▼
                 SLF4J + Logback
                  ┌───┴────┐
                  ▼        ▼
              CONSOLE   JSON_FILE
              터미널      app.log
```

터미널과 `app.log`는 같은 로그 이벤트를 받지만 표현 형식은 다르다.

- 터미널은 사람이 읽기 쉬운 ANSI 색상 텍스트를 사용한다.
- API 상태 코드는 2xx 초록, 3xx 청록, 4xx 노랑, 5xx 빨강으로 표시한다.
- `app.log`는 Alloy와 Loki가 파싱하기 쉬운 JSON을 사용한다.
- 터미널은 API 요청의 method, path, status와 duration만 보여준다.
- `requestId`, `event`, `application`, `environment`는 터미널에서 생략하고 JSON 필드로 보존한다.
- 예외 stack trace는 양쪽에 기록되지만 표현 형식이 다르다.

터미널의 API 요청 요약 예시는 다음과 같다.

```text
2026-09-29T00:31:29.473+09:00 [INFO] RequestIdFilter - GET /actuator/health → 200 (57ms)
```

동일 이벤트의 `app.log` 표현은 다음과 같다.

```json
{
  "timestamp": "2026-09-29T00:31:29.473+09:00",
  "level": "INFO",
  "application": "zzicgo-backend",
  "environment": "local",
  "event": "http_request",
  "requestId": "27a2d319-d143-4677-a8c8-d0ea07df67af",
  "method": "GET",
  "path": "/actuator/health",
  "status": 200,
  "durationMs": 57,
  "message": "GET /actuator/health → 200 (57ms)"
}
```

Tomcat AccessLogValve는 Logback과 별개로 모든 요청의 원본 접근 로그를 기록한다.

```text
requestId=27a2d319-d143-4677-a8c8-d0ea07df67af method=GET path=/actuator/health status=200 durationMs=63 remoteIp=127.0.0.1 userAgent="curl/8.7.1"
```

`RequestIdFilter`와 Tomcat은 측정 범위가 달라 `durationMs`가 조금 다를 수 있다. API 요청이 `app.log`와 Tomcat 접근 로그 양쪽에 존재하므로 Grafana 전송 단계에서는 중복 수집 범위를 결정한다. 초기 권장안은 다음과 같다.

- Grafana의 API 집계와 검색은 `app.log`의 `event=http_request`를 기준으로 한다.
- Tomcat 접근 로그는 원본 요청 분석을 위한 짧은 보관 파일로 유지한다.
- Grafana Cloud 사용량을 줄여야 하면 Tomcat 접근 로그는 Alloy 수집 대상에서 제외한다.

출력 형식의 설정 위치는 다음과 같다.

- 콘솔 텍스트와 `app.log` JSON: `ZzicGo_be/src/main/resources/logback-spring.xml`
- Tomcat 접근 로그 필드와 경로: `ZzicGo_be/src/main/resources/application.yml`
- API 요청 요약 필드: `ZzicGo_be/src/main/java/com/ZzicGo/monitoring/RequestIdFilter.java`

운영 서버에서 콘솔 출력은 외부 사용자에게 공개되는 터미널이 아니라 systemd journal로 전달된다. 파일 로그가 자동으로 더 안전한 것은 아니므로 콘솔과 파일 모두 JWT, Cookie, OAuth code, 요청 body, query string과 개인정보를 기록하지 않는다.

## 메트릭 확장 흐름

로그 기반 모니터링이 안정화되면 다음 구조를 추가한다.

```text
Spring Boot /actuator/prometheus ─┐
Alloy Unix exporter ──────────────┼─ Alloy ── Grafana Cloud Metrics
                                  └─ alerts/dashboard
```

Actuator management server는 `127.0.0.1`의 별도 port에 bind하고 `health`와 `prometheus`만 노출한다. 상세 health, `env`, `beans`, `configprops` 등은 외부에 공개하지 않는다.

수집 대상은 다음과 같다.

- HTTP 요청 수, 상태 코드와 p50/p95/p99 응답시간
- JVM heap, GC와 thread
- Tomcat thread
- HikariCP active/idle/pending connection
- 프로세스 uptime
- EC2 CPU, 메모리, 디스크와 네트워크
- 인증, 업로드, S3와 FCM의 성공·실패 횟수

## 보안 경계

- Grafana 전송·조회 자격 증명을 저장소에 commit하지 않는다.
- 조회 자격 증명은 읽기 전용 최소 권한으로 발급한다.
- 관리자 프론트엔드에 Grafana token을 전달하지 않는다.
- JWT, OAuth code/secret, AWS credential과 개인정보를 로그에 기록하지 않는다.
- public health endpoint는 `UP/DOWN`만 제공한다.
- telemetry endpoint에는 payload 제한, allowlist 검증과 rate limit을 적용한다.
