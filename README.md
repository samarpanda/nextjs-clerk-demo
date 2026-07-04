# Nextjs & Clerk

1. Added pnpm instead of npm
1. Clerk for authentication & user management for the nextjs app
1. Logger using winston
1. Postgres with Drizzle ORM
1. Nextjs standalone self hosted build using Dockerfile
1. Push the image to the dockerhub
1. Deployment using k8s

## Add vitest for testing

1. Install required dependencies

`pnpm i -D @testing-library/jest-dom@6.9.1 @testing-library/react@16.3.2 @vitejs/plugin-react@6.0.3 jsdom@29.1.1 vitest@4.1.9`

```json
{
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.2",
  "@vitejs/plugin-react": "^6.0.3",
  "jsdom": "^29.1.1",
  "vitest": "^4.1.9"
}
```

2. Few more dependencies for test coverage and ui triggers

`pnpm i -D @vitest/coverage-v8@4.1.9 @vitest/ui@4.1.9`

```json
{
  "@vitest/coverage-v8": "^4.1.9",
  "@vitest/ui": "^4.1.9"
}
```

3. Add all required scripts to trigger the tests

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

4. Found the test was broken due to test environment not getting loaded and tsconfig not included in vite.config.ts. So, fixed it now. The test is working fine.

## Validate client & server environments

1. Client is build time environment variables. This gets embeded to the client build. Any change in these values would required a rebuild with the new values.

1. `src/env/client.ts` also helps in validating if all required environments are passed during the build step.

1. Server environment variables is verified before starting the application. This is done by using the `instrumentation.ts` file. This triggers the validation at the runtime. Especially before accepting any request.
