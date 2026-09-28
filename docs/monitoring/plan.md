# 모니터링 도입 계획

## 원칙

- 백엔드 로그 가시성을 가장 먼저 확보한다.
- 한 단계의 데이터 품질을 확인한 뒤 다음 신호를 추가한다.
- 사용자 요청 경로에서 모니터링 전송 완료를 기다리지 않는다.
- Grafana Cloud 무료 사용량을 넘기지 않도록 로그 수준, label과 샘플링을 관리한다.
- 관리자 애플리케이션은 모니터링 수집이 안정화된 뒤 구현한다.

## 0단계: 사전 보안 정리

- 저장소에 노출된 AWS, JWT, OAuth와 DB 자격 증명을 폐기·교체한다.
- 실제 secret을 환경 변수 또는 배포 secret으로 이동한다.
- 프론트엔드 빌드에서 client secret을 제거한다.
- CI에서 `.env` 내용을 출력하지 않는다.
- 운영 Actuator endpoint 노출 범위를 제한한다.

완료 조건:

- 저장소와 CI 로그에 실제 secret이 없다.
- 브라우저 bundle에 OAuth client secret이 포함되지 않는다.
- public health 응답이 내부 상세 정보를 노출하지 않는다.

## 1단계: 백엔드 로그 표준화

- 운영 로그 레벨을 INFO/WARN으로 변경한다.
- JSON 구조화 로그를 적용한다.
- 표준 `event` 이름을 적용한다.
- 처리되지 않은 예외에 stack trace를 기록한다.
- Request ID filter와 MDC를 적용한다.
- 접근 로그에 Request ID, status와 duration을 포함한다.
- token, 개인정보와 요청 body가 로그에 남지 않는지 검증한다.

완료 조건:

- 하나의 Request ID로 접근 로그와 애플리케이션 로그를 연결할 수 있다.
- 의도적으로 발생시킨 500 오류의 stack trace를 확인할 수 있다.
- 운영 로그에 DEBUG와 민감정보가 남지 않는다.

## 2단계: Alloy와 Grafana Cloud Logs

- Grafana Cloud Free stack을 생성한다.
- EC2에 Alloy를 별도 systemd 서비스로 설치한다.
- Spring Boot, Nginx access/error 로그를 수집한다.
- 필요한 고정 label만 부여한다.
- Alloy 재시작과 EC2 재부팅 후 자동 기동을 검증한다.
- Grafana Explore에서 로그 검색을 검증한다.

완료 조건:

- 백엔드 배포와 Alloy 실행이 독립적이다.
- Grafana에서 application, environment, level과 event로 검색할 수 있다.
- Request ID로 단일 요청의 로그를 찾을 수 있다.
- 로그 수집 실패가 사용자 API 응답에 영향을 주지 않는다.

## 3단계: 로그 대시보드와 알람

초기 대시보드:

- 분당 전체 요청 수
- 분당 4xx/5xx 요청 수
- ERROR/WARN 추이
- 응답시간 p95
- event별 오류 수
- 최근 ERROR 로그

초기 알람:

- 일정 시간 동안 5xx 급증
- `unhandled_exception` 발생
- ERROR 로그 급증
- S3 또는 FCM 실패 급증
- Alloy 로그 전송 오류

외부 가용성:

- Grafana Synthetic Monitoring으로 프론트 URL을 검사한다.
- 상세 정보를 노출하지 않는 public health endpoint를 검사한다.
- 로그 부재만으로 서비스 Down을 판정하지 않는다.

완료 조건:

- 테스트 오류 발생 시 지정한 contact point로 알람을 받는다.
- EC2 또는 애플리케이션 종료 시 외부 health check 알람을 받는다.
- 알람 해소 시 recovery 알림을 받는다.

## 4단계: 프론트엔드 오류와 렌더링 성능

- `web-vitals`와 Performance API를 적용한다.
- LCP, FCP, TTFB와 SPA `ROUTE_TRANSITION`을 측정한다.
- 프론트 telemetry endpoint를 백엔드에 추가한다.
- metric, rating, page와 payload allowlist를 적용한다.
- route의 실제 ID와 query string을 제거한다.
- rate limit, 중복 제한과 필요 시 sampling을 적용한다.
- 제한된 `window.error`, `unhandledrejection`과 API 5xx를 수집한다.

추가 대시보드:

- LCP/FCP/TTFB p75
- route별 `ROUTE_TRANSITION` p75
- metric별 `poor` 비율
- 프론트 오류 추이와 최근 오류

완료 조건:

- 새로고침과 SPA 경로 이동이 서로 다른 성능 이벤트로 기록된다.
- 동적 ID가 제거된 route 단위로 집계된다.
- 사용자 ID, token과 query string이 전송되지 않는다.
- 브라우저 telemetry endpoint 오남용이 사용자 API에 영향을 주지 않는다.

## 5단계: Prometheus 메트릭

- 백엔드에 Micrometer Prometheus registry를 추가한다.
- Actuator management server를 loopback 별도 port에 bind한다.
- `health`와 `prometheus`만 노출한다.
- Alloy로 `/actuator/prometheus`를 scrape한다.
- Alloy Unix exporter로 EC2 시스템 메트릭을 수집한다.
- 인증, 업로드, S3와 FCM의 성공·실패 custom metric을 추가한다.

추가 대시보드:

- HTTP RPS, 5xx 비율과 p50/p95/p99
- JVM heap, GC와 thread
- HikariCP active/idle/pending
- EC2 CPU, 메모리, 디스크와 네트워크
- 프로세스 uptime

추가 알람:

- HTTP 5xx 비율
- p95 응답시간
- JVM heap 사용률
- HikariCP pending connection
- CPU, 메모리와 디스크 사용률
- application `up` 단절

완료 조건:

- metrics endpoint가 외부 네트워크에 직접 공개되지 않는다.
- 고카디널리티 tag가 없다.
- 로그와 메트릭에서 같은 application/environment 값을 사용한다.
- 대표 장애 상황별 dashboard와 alert 동작을 확인한다.

## 6단계: 관리자 애플리케이션

관리자 화면 요구가 구체화되면 루트에 `ZzicGo_admin`을 추가한다.

```text
ZzicGo_admin/
├─ backend/
└─ frontend/
```

초기 관리자 기능:

- 서비스 UP/DOWN과 최근 알람 상태
- 최근 1시간의 오류 수와 5xx 비율
- 백엔드/프론트 오류 구분
- event 종류별 오류 수
- 최근 ERROR 로그
- Request ID 검색
- 주요 프론트 성능 p75
- 상세 Grafana dashboard 링크

관리자 백엔드 구현 원칙:

- Grafana Cloud 읽기 전용 자격 증명을 서버에서만 보관한다.
- 브라우저가 임의 PromQL/LogQL을 실행할 수 없게 한다.
- 조회 기간과 결과 건수를 제한한다.
- 짧은 cache로 Grafana API 호출을 줄인다.
- 관리자 인증·인가와 조회 감사 로그를 적용한다.

완료 조건:

- 관리자 프론트 bundle과 네트워크 응답에 Grafana token이 없다.
- 일반 사용자는 관리자 API에 접근할 수 없다.
- Grafana 장애나 timeout이 사용자 API에 영향을 주지 않는다.

## 보류 항목

다음 항목은 현재 범위에서 구현하지 않는다.

- 세션 리플레이
- 전체 브라우저 로그 수집
- 분산 trace
- Grafana Faro
- 관리자 화면에서 임의 PromQL/LogQL 실행
- 장기 로그 보관
- 자체 Prometheus/Grafana/Loki 운영

