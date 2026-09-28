# ZzicGo Backend

## Configuration

The backend uses a single `src/main/resources/application.yml` for every
environment. Public settings have safe defaults and can still be overridden by
environment variables. Secrets have no defaults. The `.env` filename is a
project convention; Spring Boot does not load the file automatically.

```text
ZzicGo_be/
├─ .env                 # ignored; real local values
└─ src/main/resources/application.yml
```

The local `.env` only needs the following secret or deployment-specific keys:

```text
DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD
AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_S3_BUCKET_NAME
JWT_SECRET
NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_REDIRECT_URI
KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI
FIREBASE_SERVICE_ACCOUNT
```

Production uses the same variable names, but its `.env` values must be managed
on the server. Do not commit `.env`, `.env.prod`, Firebase service-account JSON,
or any credentials.

For local execution, configure the IDE or shell to inject the values from
`.env` before starting Gradle or the application.

For production, configure the backend systemd unit to load the file explicitly:

```ini
[Service]
EnvironmentFile=/home/ubuntu/backend/app/.env
```

Production may additionally override the values that intentionally differ from
local development, such as `APP_ENVIRONMENT`, `DB_URL_OPTIONS`, JPA options and
the Tomcat access-log base directory. After changing the production `.env`,
reload systemd and restart the backend service.
