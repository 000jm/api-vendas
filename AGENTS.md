# Repository Guidelines

## Project Structure & Module Organization

This is a TypeScript/Express API organized by domain modules. `src/users` and `src/products` contain domain models and repository interfaces, application use cases, and infrastructure adapters. HTTP routes, controllers, schemas, validation, and middleware live under each module's `infrastructure/http`; TypeORM entities, repositories, and migrations live under `infrastructure/typeorm`. Shared providers, errors, configuration, routing, and server setup are in `src/common`. Email templates and renderers are in `src/users/infrastructure/views`. Unit specs sit beside their implementation; integration specs use the `.int-spec.ts` suffix.

## Build, Test, and Development Commands

- `npm ci` installs the lockfile-defined dependencies.
- `npm run dev` starts the API using `.env.development` with TypeScript path aliases enabled.
- `npm run lint` runs ESLint across the repository.
- `npm test -- --runTestsByPath path/to/file.spec.ts` runs unit tests through Jest with `.env.test`.
- `npm run test:int -- --runTestsByPath path/to/file.int-spec.ts` runs integration tests with the integration Jest config. Confirm `.env.test` points to a disposable, isolated test database before running integration tests or migrations.
- `npm run typeorm -- migration:run` invokes the TypeORM CLI using development configuration; verify the target database before changing it.

## Coding Style & Naming Conventions

Use TypeScript and the existing module layers: route → controller → schema validation → use case → domain repository interface → infrastructure repository. Controllers should not query TypeORM directly. Follow the configured Prettier/ESLint style (two-space indentation, single quotes in formatted files, trailing commas). Use kebab-case filenames such as `check-email-status.usecase.ts`; name unit and integration specs `*.spec.ts` and `*.int-spec.ts`. Keep HTTP schemas and Swagger route documentation aligned with the actual contract.

## Testing Guidelines

Jest with `ts-jest` is used for unit and integration tests. Add unit tests for validation and use-case outcomes, and integration tests for persistence or HTTP behavior when a safe isolated database is available. Run focused unit tests with the command above; do not point tests at development or production data. No repository-wide coverage threshold is configured.

## Commit & Pull Request Guidelines

Recent commits use short imperative subjects, often with a module prefix, for example `feat[users]: add avatar update` or `fix[users]: ...`. Keep changes focused and describe the affected module. Pull requests should summarize behavior and API changes, list verification commands and their results, link related issues when applicable, and include request/response examples for endpoint changes. Add screenshots only when a visible UI changes.

## Security & Configuration

Keep secrets out of source control and use the environment files required by each script. Treat email addresses, credentials, tokens, and user records as sensitive. Public account-related endpoints must document enumeration risk, return only required fields, and apply abuse controls. Avoid logging request bodies containing personal data.
