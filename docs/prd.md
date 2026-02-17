# Product Requirements Document (PRD)

## DeeperDive Publisher Configuration Tool

### 1. Overview

**DeeperDive Publisher Config Tool** is a web-based internal tool designed for **Taboola Support Engineers** to safely view, edit, and manage publisher configuration files without directly manipulating raw JSON.

The tool transforms complex and error-prone JSON configurations into a **structured, visual, and guarded editing experience**, enabling faster work, fewer mistakes, and higher confidence.

---

### 2. Problem Statement

Support engineers frequently need to update publisher configurations stored as JSON files.
While they understand the data conceptually, editing raw JSON causes friction due to:

* Syntax errors (missing commas, brackets, quotes)
* Difficulty understanding deeply nested structures
* Inconsistent configuration schemas between publishers
* Lack of visibility into what changed before saving

These issues lead to wasted time, errors, and reduced confidence.

---

### 3. Goals & Success Criteria

#### Product Goals

* Make configuration editing **safe by default**
* Reduce JSON syntax errors to zero
* Improve speed and confidence of configuration updates
* Support schema variations gracefully

#### Success Metrics (Qualitative)

* Support engineers can complete common edits without touching raw JSON
* Users clearly understand what they changed before saving
* No broken configuration files due to syntax issues

---

### 4. Target Users

**Primary Users: Taboola Support Engineers**

Characteristics:

* Technical and data-oriented
* Familiar with dashboards and tools
* Basic understanding of JSON structure
* Limited tolerance for syntax-heavy workflows
* Work under time pressure
* Value clarity, safety, and efficiency over flexibility

---

### 5. User Needs & Jobs-to-be-Done

| User Need                | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| Browse publishers        | Quickly locate the correct publisher configuration      |
| Understand configuration | Easily read and understand current settings             |
| Edit safely              | Modify values without breaking structure or syntax      |
| Handle variation         | Edit configs even when fields differ between publishers |
| Track changes            | See exactly what changed before saving                  |
| Save/export              | Persist updated configuration confidently               |

---

### 6. Core User Flows

#### 6.1 Browse & Select Publisher

1. User opens the tool
2. Sees a searchable list of publishers
3. Selects a publisher to load its configuration

#### 6.2 View Configuration

* Configuration is displayed in a **structured, readable format**
* Sections are grouped logically (Basic Info, Pages, Dashboards, Optional Fields)
* Read-only fields are clearly distinguished from editable fields

#### 6.3 Edit Configuration

* Users edit values through:

  * Form inputs (text, toggle, checkbox, list editor)
  * Controlled editors for arrays and nested objects
* Invalid inputs are prevented at the UI level
* Optional fields can be added or removed safely

#### 6.4 Review Changes

* A “Changes Summary” panel shows:

  * What fields were modified
  * Old value → new value
* Visual indicators highlight modified fields inline

#### 6.5 Save / Export

* User saves changes
* Tool validates structure before saving
* Configuration is saved or exported as valid JSON

---

### 7. Key Features (High-Level)

#### 7.1 Publisher List

* Searchable list of publishers
* Clear publisher identifiers (ID + alias)
* Status indicator (active / inactive)

#### 7.2 Structured Configuration Editor

* JSON represented as a **form-based editor**
* Logical grouping of fields
* Expandable sections for nested objects and arrays
* Safe editors for lists (add/remove items via UI controls)

#### 7.3 Schema-Aware Flexibility

* Tool does not assume a single rigid schema
* Unknown or uncommon fields are still displayed in a safe, editable way
* Optional fields handled dynamically

#### 7.4 Change Tracking

* Inline indicators for modified fields
* Centralized change summary
* Ability to review changes before saving

#### 7.5 Validation & Safety

* Prevent invalid JSON generation
* Type-aware inputs (boolean, string, array)
* Required fields clearly marked
* Save action disabled when validation fails

---

### 8. UX & Design Principles

* **Safety First**: Users should never be able to break JSON syntax
* **Clarity Over Power**: Prefer guided editing over free-form flexibility
* **Progressive Disclosure**: Show complexity only when needed
* **Consistency**: Similar data structures behave the same across publishers
* **Confidence**: Users should always know what they changed and why

---

### 9. Non-Goals (Out of Scope for Initial Version)

* Advanced schema editing
* Permission management / roles
* Version history or rollback
* Multi-user collaboration
* Automated validation against external systems

---

### 10. Assumptions & Constraints

* Tool is internal and used by trained Support engineers
* JSON files are the source of truth
* Configuration schemas may vary between publishers
* No external UI frameworks are used
* Performance requirements are moderate (dozens to hundreds of publishers)

---

### 11. Risks & Mitigations

| Risk                 | Mitigation                    |
| -------------------- | ----------------------------- |
| Schema inconsistency | Dynamic rendering of fields   |
| User confusion       | Clear grouping and labels     |
| Accidental changes   | Change summary + confirmation |
| Over-complex UI      | Progressive disclosure        |

---

### 12. Future Enhancements (Optional)

* Version history & diff viewer
* Inline documentation per field
* Preset templates for common configurations
* Role-based editing permissions
* Server-side validation & audit logs
