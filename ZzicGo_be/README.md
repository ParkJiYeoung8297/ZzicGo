# ZzicGo Backend

## Configuration

The backend uses a single `src/main/resources/application.yml` for every
environment. Environment-specific values are supplied as process environment
variables. The `.env` filename is a project convention; Spring Boot does not
load the file automatically.

```text
ZzicGo_be/
├─ .env                 # ignored; real local values
├─ .env.example         # tracked; variable names and safe examples
└─ src/main/resources/application.yml
```

Create local configuration from the example and fill in the missing values:

```bash
cp .env.example .env
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

The production file must use the same variable names as `.env.example`. After
changing it, reload systemd and restart the backend service.
