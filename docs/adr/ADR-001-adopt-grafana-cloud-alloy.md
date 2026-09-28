# ADR-001: Grafana Cloud와 Alloy 기반 통합 모니터링 아키텍처 채택

- 상태: 제안됨
- 작성일: 2026-09-28
- 대상: `ZzicGo_be`, `ZzicGo_fe`, 향후 `ZzicGo_admin`

## 배경

ZzicGo는 Spring Boot 백엔드와 React/Vite 기반 브라우저·PWA 프론트엔드를 EC2와 Nginx에서 운영한다.

운영 중 다음 정보를 확인할 수 있어야 한다.

- 백엔드 애플리케이션 오류와 주요 이벤트
- HTTP 요청 상태와 응답시간
- 인증, 이미지 업로드, S3 및 FCM 연동 실패
- EC2, JVM 및 데이터베이스 connection pool 상태
- 프론트엔드 초기 렌더링과 SPA 화면 전환 성능
- 서비스 외부 가용성
- 오류 발생 또는 주요 지표의 임계치 초과 시 운영자 알림

추후 별도의 관리자 화면에서 백엔드와 프론트엔드의 주요 상태와 최근 오류를 조회할 수 있어야 한다.

CloudWatch Logs와 Custom Metrics의 지속 비용은 사용하지 않는다. 자체 Prometheus, Grafana, Loki 전체 스택을 현재 EC2에 설치하는 방식도 운영 부하와 장애 영역 공유 문제로 피한다.

## 결정 요인

- 초기 모니터링 서비스 비용이 없어야 한다.
- 백엔드 모니터링을 우선한다.
- 사용자 서비스와 telemetry 저장소의 장애 영역을 분리한다.
- 프론트엔드 계측은 가벼워야 한다.
- 향후 자체 관리자 화면에서 동일한 데이터를 조회할 수 있어야 한다.
- 모니터링 장애가 사용자 API에 영향을 주면 안 된다.
- 로그와 메트릭 조회 자격 증명이 브라우저에 노출되면 안 된다.

## 결정

1. Grafana Cloud Free를 로그·메트릭 저장, 대시보드, 알람 및 외부 health check 플랫폼으로 사용한다.
2. Grafana Alloy를 EC2의 독립 systemd 서비스로 실행해 로그와 메트릭을 Grafana Cloud로 전송한다.
3. 애플리케이션 문맥이 필요한 계측 코드는 각각 `ZzicGo_be`와 `ZzicGo_fe`에 둔다.
4. Alloy, dashboard 및 alert 설정은 저장소 루트의 `monitoring/`에서 관리한다.
5. 초기에는 구조화 로그 기반으로 구현하고, 이후 Actuator/Micrometer 기반 Prometheus 메트릭을 추가한다.
6. 향후 관리자 애플리케이션은 Grafana Cloud 데이터를 읽는 별도 백엔드와 프론트엔드로 구성한다.

`ZzicGo_be` 내부에 Gradle `module-monitoring`을 만들지 않는다. 같은 JVM에 포함되는 라이브러리 모듈은 코드만 분리할 뿐 운영 장애 영역을 분리하지 못한다. 여러 실행 애플리케이션에서 공통 계측 코드가 필요해지면 별도 라이브러리 모듈을 다시 검토한다.

상세 실행 구조는 [모니터링 아키텍처](../monitoring/architecture.md), 수집 데이터 규약은 [로깅 및 프론트 telemetry 규약](../monitoring/logging-convention.md), 도입 순서는 [모니터링 도입 계획](../monitoring/plan.md)에서 관리한다.

## 검토한 대안

### CloudWatch Agent와 CloudWatch Logs/Custom Metrics

AWS 환경과 쉽게 통합되지만 로그와 커스텀 메트릭의 지속 비용을 피하려는 요구와 맞지 않아 선택하지 않는다.

### EC2에 Prometheus, Grafana, Loki 전체 설치

라이선스 비용은 없지만 사용자 서비스와 CPU·메모리·디스크 및 장애 영역을 공유한다. 데이터 보관, 백업과 업그레이드도 직접 운영해야 하므로 현재 규모에서는 선택하지 않는다.

### `ZzicGo_be` 내부의 모니터링 Gradle 모듈

계측 코드의 물리적 분리는 가능하지만 같은 JVM에서 실행되므로 운영 분리가 되지 않는다. 현재는 패키지 수준 분리로 충분하다.

### Grafana 대시보드를 관리자 화면에 직접 삽입

Grafana Cloud의 embedding 제약과 인증 복잡도가 있으며, 세부 Grafana 기능이 관리자 화면에 강하게 결합된다. 관리자 백엔드가 읽기 전용 API로 필요한 데이터만 조회하는 방식을 선택한다.

### Grafana Faro 즉시 도입

프론트엔드 오류, 세션과 trace까지 수집할 수 있지만 초기 요구보다 범위가 넓다. 초기에는 `web-vitals`와 브라우저 Performance API로 필요한 성능 데이터만 수집하고 필요해질 때 재검토한다.

## 결과

### 장점

- 모니터링 저장소와 대시보드가 EC2 장애 영역 밖에 존재한다.
- 사용자 API, 수집기와 향후 관리자 앱의 실행 생명주기를 분리한다.
- 로그부터 작게 시작하고 메트릭과 프론트 telemetry로 확장할 수 있다.
- Grafana 데이터로 현재 대시보드와 향후 관리자 화면을 함께 지원할 수 있다.
- 프론트엔드에 무거운 세션 리플레이나 tracing SDK를 추가하지 않는다.

### 단점

- Grafana Cloud 무료 플랜의 사용량과 보관 기간 제한을 관리해야 한다.
- EC2에서 Alloy를 설치하고 업데이트해야 한다.
- 로그만 사용하는 초기 단계에서는 JVM과 connection pool 상태를 충분히 확인하기 어렵다.
- 관리자 화면 구현 시 Grafana 조회 API와 응답 변환 계층이 추가된다.
- 클라이언트 telemetry는 조작 가능하므로 감사 또는 과금 데이터로 사용할 수 없다.

## 재검토 조건

- Grafana Cloud 무료 사용량을 지속적으로 초과한다.
- 무료 보관 기간보다 긴 로그 보관이 필수 요구가 된다.
- 보안 또는 규정상 telemetry를 외부 SaaS에 저장할 수 없게 된다.
- 여러 백엔드가 공통 계측 라이브러리를 필요로 한다.
- 프론트엔드 세션, 오류 stack trace 또는 분산 trace가 필수 요구가 된다.
- 관리자 화면에 Grafana 수준의 자유로운 탐색 기능이 필요해진다.

