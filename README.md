# 🚀 DeeperDive Publisher Configuration Tool

A modern, intuitive web-based tool for Taboola Support Engineers to safely view, edit, and manage publisher configurations without directly manipulating raw JSON.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Design System](#-design-system)

---

## 🎯 Overview


You can see a demo of the tool in the included `demo.mp4` file.

### The Problem

Support engineers frequently need to update publisher configurations stored as JSON files. While they understand the data conceptually, editing raw JSON causes friction due to:

- **Syntax errors** — missing commas, brackets, quotes
- **Complex structures** — difficulty navigating deeply nested objects
- **Schema variations** — inconsistent fields between publishers
- **No visibility** — unclear what changed before saving

### The Solution

DeeperDive transforms complex JSON configurations into a **structured, visual, and guarded editing experience**, enabling faster work, fewer mistakes, and higher confidence.

---

## ✨ Features

### Publisher Management

| Feature | Description |
|---------|-------------|
| 📋 **Publisher List** | Searchable, filterable grid view of all publishers with pagination |
| 🔍 **Smart Search** | Real-time search with debouncing across publisher IDs and names |
| 🏷️ **Status Filtering** | Filter publishers by active/inactive status |
| 📄 **Pagination** | Configurable page sizes with smooth navigation |

### Configuration Viewing

| Feature | Description |
|---------|-------------|
| 👁️ **Structured View** | Clean, organized display of publisher configurations |
| 📊 **Stats Dashboard** | At-a-glance metrics for pages, dashboards, and domains |
| 🔗 **Dashboard Links** | Quick access to publisher, monitor, and QA dashboards |
| 🏷️ **Tags & Domains** | Visual display of tags and allowed domains |

### Configuration Editing

| Feature | Description |
|---------|-------------|
| ✏️ **Form-Based Editor** | Safe, guided editing through intuitive forms |
| ➕ **Create Publisher** | Add new publishers with full validation |
| 📝 **Edit Publisher** | Modify existing configurations safely |
| 📋 **Duplicate Publisher** | Clone existing publishers as templates |
| 📥 **Download JSON** | Export configurations as formatted JSON files |

### Pages Configuration

| Feature | Description |
|---------|-------------|
| 📄 **Pages Editor** | Add, edit, and remove page configurations |
| 🎯 **Page Types** | Configure page type, CSS selector, and position |
| ✅ **Inline Validation** | Real-time validation of page entries |

### Safety & Validation

| Feature | Description |
|---------|-------------|
| ✅ **Real-time Validation** | Instant feedback on invalid inputs |
| 🔗 **URL Validation** | Automatic validation of dashboard URLs |
| ⚠️ **Unsaved Changes Warning** | Confirmation dialogs prevent accidental data loss |
| 🔄 **Change Tracking** | Visual indicators for modified fields |

### Audit & History

| Feature | Description |
|---------|-------------|
| 📜 **Audit Log Panel** | Complete history of all configuration changes |
| 🔍 **Change Details** | Field-level tracking with old → new values |
| 👤 **User Attribution** | Track who made each change and when |

### User Experience

| Feature | Description |
|---------|-------------|
| 🌙 **Dark Mode** | Toggle between light and dark themes |
| 🧭 **Breadcrumb Navigation** | Clear navigation hierarchy |
| 📱 **Responsive Design** | Works on desktop and tablet devices |
| ⌨️ **Keyboard Accessible** | Full keyboard navigation support |

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Router    │  │    Store    │  │     Theme Service       │  │
│  │ (Hash-based)│  │ (State Mgmt)│  │ (Light/Dark)            │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘  │
│         │                │                                       │
│  ┌──────▼────────────────▼──────────────────────────────────┐   │
│  │                      Pages                                │   │
│  │  ┌──────────────────┐  ┌────────────────────────────┐    │   │
│  │  │ Publishers List  │  │     Publisher Page         │    │   │
│  │  │   - Search       │  │  ┌─────────┐ ┌──────────┐  │    │   │
│  │  │   - Filter       │  │  │  View   │ │   Form   │  │    │   │
│  │  │   - Pagination   │  │  │  Mode   │ │   Mode   │  │    │   │
│  │  └──────────────────┘  │  └─────────┘ └──────────┘  │    │   │
│  │                        └────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Express Server                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    REST API Endpoints                    │    │
│  │  GET  /api/publishers      - List with pagination/search │    │
│  │  GET  /api/publishers/:id  - Get single publisher        │    │
│  │  POST /api/publishers      - Create new publisher        │    │
│  │  PUT  /api/publishers/:id  - Update publisher            │    │
│  │  GET  /api/audit-logs/:id  - Get audit history           │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                   │
│  ┌───────────────────────────▼─────────────────────────────┐    │
│  │                    Repositories                          │    │
│  │  ┌──────────────────┐  ┌────────────────────────────┐   │    │
│  │  │ Publisher Repo   │  │    Audit Log Repo          │   │    │
│  │  │ - CRUD ops       │  │    - Change tracking       │   │    │
│  │  │ - Search/filter  │  │    - Diff calculation      │   │    │
│  │  └──────────────────┘  └────────────────────────────┘   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                   │
│  ┌───────────────────────────▼─────────────────────────────┐    │
│  │                    SQLite Database                       │    │
│  │  ┌──────────────┐ ┌──────────┐ ┌──────────────────┐     │    │
│  │  │  publishers  │ │  pages   │ │   audit_logs     │     │    │
│  │  └──────────────┘ └──────────┘ └──────────────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Client-Side State Management

The application uses a **custom reactive store pattern** (no external frameworks):

```typescript
// Simple publish-subscribe pattern
const state = {
    publishers: [],
    loading: false,
    search: '',
    filterStatus: 'all',
    pagination: { ... },
    theme: 'light'
};

// Components subscribe to state changes
subscribe(render);  // Re-render on state change
```

### Routing

Simple in-memory state-based routing (URL does not change):

- **`publishers`** — Publishers list page
- **`publisher-page`** — Single publisher view/edit page (with `publisherId` param)

The router uses a publish-subscribe pattern to notify components of route changes:

```typescript
// Navigate to a publisher
navigate('publisher-page', { publisherId: 'pub-aurora' });

// Get current route
const { route, params } = useRoute();
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe JavaScript |
| **Vanilla DOM** | No frameworks - pure DOM manipulation |
| **CSS Custom Properties** | Design tokens & theming |
| **CSS Grid/Flexbox** | Responsive layouts |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express** | HTTP server & routing |
| **better-sqlite3** | SQLite database driver |
| **TypeScript** | Type-safe server code |

### Development & Testing

| Technology | Purpose |
|------------|---------|
| **Vitest** | Unit testing |
| **Playwright** | End-to-end testing |
| **ESLint** | Code linting |
| **tsx** | TypeScript execution |
| **concurrently** | Parallel script running |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd deeper-dive-interview-test

# Install dependencies
npm install
```

### Running the Application

#### Development Mode (with hot reload)

```bash
npm run dev
```

This starts:
- **Server**: Express server with API endpoints (port 3000)
- **Client**: TypeScript compiler in watch mode

Open http://localhost:3000 in your browser.

#### Production Mode

```bash
# Build TypeScript
npm run build

# Start server
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run dev:server` | Start only the server (with watch) |
| `npm run dev:client` | Start only the TypeScript compiler (watch) |
| `npm start` | Start production server |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run test:e2e:ui` | Run E2E tests with UI |

---

## 📁 Project Structure

```
├── public/                     # Frontend application
│   ├── index.html             # Entry HTML file
│   ├── src/
│   │   ├── main.ts            # Application entry point
│   │   ├── constants/         # Shared constants
│   │   ├── handlers/          # Event handlers
│   │   ├── pages/             # Page components
│   │   │   ├── publishersListPage.ts
│   │   │   └── publisherPage.ts
│   │   ├── services/          # API & business logic
│   │   │   ├── apiClient.ts
│   │   │   ├── publisherService.ts
│   │   │   └── themeService.ts
│   │   ├── state/             # State management
│   │   │   ├── router.ts      # Client-side routing
│   │   │   ├── store.ts       # Reactive state store
│   │   │   └── routePages.ts  # Route-to-page mapping
│   │   ├── types/             # TypeScript interfaces
│   │   ├── ui/                # UI components
│   │   │   ├── auditLogPanel/ # Audit log side panel
│   │   │   ├── breadcrumbs/   # Navigation breadcrumbs
│   │   │   ├── publisherForm/ # Form editor components
│   │   │   │   ├── logic/     # Form logic (validation, submission)
│   │   │   │   └── sections/  # Form sections (basic info, pages, etc.)
│   │   │   ├── publisherListComponents/  # List page components
│   │   │   └── publisherView/ # Read-only view components
│   │   └── utils/             # Utility functions
│   └── styles/                # CSS stylesheets
│       ├── design-tokens.css  # Design system tokens
│       ├── components.css     # Component styles
│       ├── layout.css         # Layout styles
│       └── pages.css          # Page-specific styles
│
├── server/                    # Backend application
│   └── src/
│       ├── server.ts          # Express server setup
│       ├── database/
│       │   └── sqlite.ts      # Database initialization
│       ├── repositories/      # Data access layer
│       │   ├── publisherRepository.ts
│       │   ├── auditLogRepository.ts
│       │   └── auditDiffCalculator.ts
│       └── types/             # Server-side types
│
├── data/                      # Sample JSON data files
│   ├── publishers.json        # Publisher registry
│   └── publisher-*.json       # Individual configs
│
├── tests/                     # E2E tests
│   ├── helpers/               # Test utilities
│   ├── page-objects/          # Page object models
│   └── *.spec.ts              # Test files
│
└── docs/                      # Documentation
    ├── prd.md                 # Product requirements
    └── style-guide.md         # Design system guide
```

---

## 📡 API Reference

### Publishers

#### List Publishers

```http
GET /api/publishers?search=&isActive=&page=1&limit=9
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search term for ID or alias |
| `isActive` | boolean | Filter by active status |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 9, max: 100) |

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "pageSize": 9,
    "totalItems": 25,
    "totalPages": 3
  }
}
```

#### Get Publisher

```http
GET /api/publishers/:publisherId
```

**Response:**
```json
{
  "publisherId": "pub-aurora",
  "aliasName": "Aurora Media",
  "isActive": true,
  "pages": [...],
  "publisherDashboard": "https://...",
  "monitorDashboard": "https://...",
  "qaStatusDashboard": "https://...",
  "tags": ["premium", "news"],
  "allowedDomains": ["aurora.com"],
  "notes": "..."
}
```

#### Create Publisher

```http
POST /api/publishers
Content-Type: application/json

{
  "publisherId": "pub-new",
  "aliasName": "New Publisher",
  "isActive": true,
  ...
}
```

#### Update Publisher

```http
PUT /api/publishers/:publisherId
Content-Type: application/json

{
  "aliasName": "Updated Name",
  ...
}
```

### Audit Logs

#### Get Audit Logs

```http
GET /api/publishers/:publisherId/audit-logs?page=1&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "publisherId": "pub-aurora",
      "action": "update",
      "fieldName": "aliasName",
      "oldValue": "Old Name",
      "newValue": "New Name",
      "changedBy": "support-user",
      "changedAt": "2026-01-10T12:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run unit tests
npm test
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (interactive mode)
npm run test:e2e:ui

# Run specific test file
npx playwright test publishers-list.spec.ts
```

### Test Coverage

| Suite | Coverage |
|-------|----------|
| **Publishers List** | Search, filtering, pagination, navigation |
| **CRUD Operations** | Create, edit, duplicate, download |
| **Form Validation** | Required fields, URL validation, pages editor |
| **Navigation** | Routing, breadcrumbs, modals, unsaved changes |

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1F6FEB` | Primary actions, links |
| `--color-primary-muted` | `#7DA7FF` | Hover states |
| `--color-surface` | `#FFFFFF` | Page background |
| `--color-elevated` | `#F6F8FB` | Cards, panels |
| `--color-success` | `#0F9D58` | Success states |
| `--color-error` | `#D23F3F` | Error states |

### Typography

- **Font**: Inter, system-ui, sans-serif
- **Scale**: 14px (small), 16px (body), 18px (H3), 24px (H2), 32px (H1)

### Spacing

CSS custom properties for consistent spacing:
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
```

### Dark Mode

The application supports light and dark themes via CSS custom properties. Toggle using the theme button in the top-right corner.

---

## 📄 License

This project is private and intended for internal use.

---