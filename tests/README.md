# E2E Tests

Comprehensive end-to-end tests for the DeeperDive Publisher Configuration Tool using Playwright.

## Test Coverage

### Test Suites

1. **Publishers List** (`publishers-list.spec.ts`)
   - Loading and displaying publishers
   - Search functionality with debouncing
   - Publisher card interactions
   - Navigation to different views
   - Empty and error states

2. **CRUD Operations** (`publisher-crud.spec.ts`)
   - Create new publishers (with required and optional fields)
   - Edit existing publishers
   - Duplicate publishers
   - Download publisher JSON files
   - Navigation between views

3. **Form Validation** (`form-validation.spec.ts`)
   - Required field validation (alias, pages, dashboard URLs)
   - URL format validation
   - Pages editor (add/remove, validation)
   - Custom fields editor
   - Optional fields handling

4. **Navigation & Modals** (`navigation.spec.ts`)
   - Hash-based routing
   - Browser back/forward buttons
   - Breadcrumb navigation
   - Modal confirmations
   - Unsaved changes warnings
   - Error handling

## Running Tests

### Prerequisites

```bash
npm install
```

### Run all tests (headless)
```bash
npm test
# or
npm run test:e2e
```

### Run with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run with headed browser (visible)
```bash
npm run test:e2e:headed
```

### Run in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test publishers-list.spec.ts
```

### Run specific test
```bash
npx playwright test -g "should create a new publisher"
```

## Test Configuration

Tests are configured in `playwright.config.ts`:
- **Browsers**: Chromium, Firefox, WebKit
- **Base URL**: http://localhost:3000
- **Auto-start server**: Server starts automatically via `npm start`
- **Retries**: 2 retries on CI, 0 locally
- **Parallel execution**: Disabled on CI (serial), enabled locally
- **Reporters**: HTML report, list output, GitHub Actions report (CI only)

## Page Object Models

Tests use the Page Object Model pattern for better maintainability:

- **PublishersListPage**: Interactions with the publishers list view
- **PublisherViewPage**: Interactions with the read-only publisher view
- **PublisherFormPage**: Interactions with the create/edit form

Located in `tests/page-objects/`

## Test Utilities

Helper functions in `tests/helpers/testUtils.ts`:
- `generateTestPublisherName()`: Generate unique test publisher names
- `createTestPublisher()`: Create test publisher objects
- `waitForNavigation()`: Wait for navigation to complete
- `waitForApiResponse()`: Wait for specific API responses

## CI/CD

Tests run automatically on GitHub Actions:
- On push to main/master branches
- On pull requests
- Includes linting before tests
- Uploads test reports and artifacts on failure

See `.github/workflows/ci.yml` for configuration.

## Viewing Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Debugging Failed Tests

1. **Run in UI mode**: `npm run test:e2e:ui`
2. **Run in debug mode**: `npm run test:e2e:debug`
3. **View trace**: Check `test-results/` folder for traces
4. **Screenshots**: Captured automatically on failure

## Notes

- Tests run against the **real backend** (not mocked)
- Test data is created with timestamps to avoid conflicts
- Tests run in serial on CI to prevent race conditions
- All tests wait for network idle before assertions
