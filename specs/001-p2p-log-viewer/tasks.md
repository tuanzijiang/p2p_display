# Tasks: Local P2P Log Viewer

**Input**: Design documents from `/specs/001-p2p-log-viewer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include unit, integration, and e2e coverage because the feature spec defines mandatory user-scenario testing and the plan explicitly selects Vitest, React Testing Library, and Playwright.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3)
- Every task includes exact file paths so the work is directly executable

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the dependencies, test harness, and feature scaffolding required by the implementation plan.

- [X] T001 Update runtime and test dependencies plus `dev`, `build`, `test`, and `test:e2e` scripts in `/Users/bytedance/dev/study/p2p_display/package.json`
- [X] T002 Configure Vitest, jsdom, and shared aliases in `/Users/bytedance/dev/study/p2p_display/vite.config.js` and `/Users/bytedance/dev/study/p2p_display/tsconfig.json`
- [X] T003 [P] Create the shared test bootstrap in `/Users/bytedance/dev/study/p2p_display/src/test/setup.ts`
- [X] T004 [P] Create reusable upload and parsing fixtures in `/Users/bytedance/dev/study/p2p_display/tests/fixtures/p2pLogSamples.ts`
- [X] T005 [P] Create the feature folder skeleton and shared viewer type definitions in `/Users/bytedance/dev/study/p2p_display/src/features/log-parser/types.ts` and `/Users/bytedance/dev/study/p2p_display/src/features/log-viewer/types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared parser, store, route shell, and styling foundation that all user stories depend on.

**⚠️ CRITICAL**: No user story work should start until this phase is complete.

- [X] T006 [P] Implement timestamp parsing and `_msg` extraction helpers in `/Users/bytedance/dev/study/p2p_display/src/features/log-parser/parseTimestamp.ts` and `/Users/bytedance/dev/study/p2p_display/src/features/log-parser/extractMessage.ts`
- [X] T007 Implement the browser log parser and parse-summary builder in `/Users/bytedance/dev/study/p2p_display/src/features/log-parser/parseLogFile.ts`
- [X] T008 [P] Implement timeline range formatting and anchor-index search helpers in `/Users/bytedance/dev/study/p2p_display/src/features/log-viewer/timeRange.ts` and `/Users/bytedance/dev/study/p2p_display/src/features/log-viewer/findAnchorRecord.ts`
- [X] T009 [P] Create the shared log viewer Zustand store with file session, timeline, and panel state in `/Users/bytedance/dev/study/p2p_display/src/store/logViewerStore.ts`
- [X] T010 Create the viewer route shell and replace the demo routing entry points in `/Users/bytedance/dev/study/p2p_display/src/routes/LogViewerPage.tsx`, `/Users/bytedance/dev/study/p2p_display/src/router.tsx`, and `/Users/bytedance/dev/study/p2p_display/src/App.tsx`
- [X] T011 [P] Add Pencil-aligned layout tokens and base blue theme styles in `/Users/bytedance/dev/study/p2p_display/src/styles.css` and `/Users/bytedance/dev/study/p2p_display/src/features/log-viewer/logViewer.css`

**Checkpoint**: Foundation ready. User story phases can now proceed.

---

## Phase 3: User Story 1 - Upload and Parse a Local Log (Priority: P1) 🎯 MVP

**Goal**: Let the operator load a local log file through click or drag-and-drop, parse valid log records locally, and see the file path, parse feedback, timeline bounds, and initial records.

**Independent Test**: Load a supported local log file and verify that the header shows the absolute file path, the parse result populates timeline bounds, and the initial text records appear without any backend dependency.

### Tests for User Story 1

- [X] T012 [P] [US1] Add parser coverage for valid, invalid, partial, and extension-less inputs in `/Users/bytedance/dev/study/p2p_display/tests/unit/log-parser/parseLogFile.test.ts`
- [X] T013 [P] [US1] Add upload-flow integration coverage for header upload and drag-drop entry points in `/Users/bytedance/dev/study/p2p_display/tests/integration/log-viewer/uploadFlow.test.tsx`

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement the header upload control and hidden file input in `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/HeaderBar.tsx`
- [X] T015 [P] [US1] Implement the dashed drag-and-drop upload area with instructional content in `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/UploadDropZone.tsx`
- [X] T016 [US1] Wire shared file loading, path capture, parse execution, and replacement-file resets in `/Users/bytedance/dev/study/p2p_display/src/store/logViewerStore.ts` and `/Users/bytedance/dev/study/p2p_display/src/routes/LogViewerPage.tsx`
- [X] T017 [US1] Implement parse feedback for complete failure, partial success, and loaded states in `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/ParseStatusBanner.tsx`
- [X] T018 [US1] Render the header, upload area, initial timeline summary, and initial text-record loading state in `/Users/bytedance/dev/study/p2p_display/src/routes/LogViewerPage.tsx` and `/Users/bytedance/dev/study/p2p_display/src/features/log-viewer/logViewer.css`

**Checkpoint**: User Story 1 should be independently functional and demonstrate the end-to-end local upload and parse flow.

---

## Phase 4: User Story 2 - Navigate Log Events by Time (Priority: P2)

**Goal**: Let the operator use the slider-style timeline to choose any exact time in the parsed range and jump the text panel to the first record at or after that moment.

**Independent Test**: Load a file with multiple timestamps, confirm the timeline is disabled before parsing and active after parsing, then choose different time points and verify the text panel starts at the correct record.

### Tests for User Story 2

- [X] T019 [P] [US2] Add timeline interaction integration coverage for disabled and active states in `/Users/bytedance/dev/study/p2p_display/tests/integration/log-viewer/timelineNavigation.test.tsx`
- [X] T020 [P] [US2] Add browser-level coverage for timeline selection and hover tooltip behavior in `/Users/bytedance/dev/study/p2p_display/tests/e2e/log-viewer/timeline.spec.ts`

### Implementation for User Story 2

- [X] T021 [P] [US2] Implement the slider-style timeline control with selected-point tooltip in `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/TimelineSlider.tsx`
- [X] T022 [P] [US2] Implement the full timeline section with start and end labels plus disabled styling in `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/TimelineSection.tsx`
- [X] T023 [US2] Connect exact timestamp selection and anchor-record updates in `/Users/bytedance/dev/study/p2p_display/src/store/logViewerStore.ts` and `/Users/bytedance/dev/study/p2p_display/src/features/log-viewer/findAnchorRecord.ts`
- [X] T024 [US2] Scroll the text panel to the computed anchor row when the selected time changes in `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/TextLogPanel.tsx` and `/Users/bytedance/dev/study/p2p_display/src/routes/LogViewerPage.tsx`

**Checkpoint**: User Stories 1 and 2 should both work, and timeline navigation should remain independently testable.

---

## Phase 5: User Story 3 - Review Parsed Text Records (Priority: P3)

**Goal**: Let the operator browse large parsed result sets in the text panel, expand a row inline for the full raw log line, switch to the topology placeholder, and see the proper empty state before any upload.

**Independent Test**: Load a representative large log file, switch to the text panel, scroll through many records without UI degradation, expand rows inline for raw lines, and verify the topology tab and unloaded empty state render correctly.

### Tests for User Story 3

- [X] T025 [P] [US3] Add integration coverage for panel switching, row expansion, and unloaded-state rendering in `/Users/bytedance/dev/study/p2p_display/tests/integration/log-viewer/textPanel.test.tsx`
- [X] T026 [P] [US3] Add large-list browser coverage for virtualized scrolling and topology placeholder behavior in `/Users/bytedance/dev/study/p2p_display/tests/e2e/log-viewer/textPanel.spec.ts`

### Implementation for User Story 3

- [X] T027 [P] [US3] Implement the lower-panel tab switcher and empty-state presentation in `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/PanelTabs.tsx` and `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/EmptyState.tsx`
- [X] T028 [P] [US3] Implement the virtualized text log panel using `@tanstack/react-virtual` in `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/TextLogPanel.tsx`
- [X] T029 [P] [US3] Implement expandable log rows with wrapped messages and inline raw-line reveal in `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/TextLogRow.tsx`
- [X] T030 [P] [US3] Implement the selectable topology placeholder panel in `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/TopologyPlaceholder.tsx`
- [X] T031 [US3] Compose the lower content region for text, topology, empty, and partial-warning states in `/Users/bytedance/dev/study/p2p_display/src/routes/LogViewerPage.tsx` and `/Users/bytedance/dev/study/p2p_display/src/store/logViewerStore.ts`

**Checkpoint**: All three user stories should now be independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Tighten performance, documentation, and final validation across all user stories.

- [X] T032 [P] Optimize large-file parsing and virtualized rendering hot paths in `/Users/bytedance/dev/study/p2p_display/src/features/log-parser/parseLogFile.ts` and `/Users/bytedance/dev/study/p2p_display/src/components/log-viewer/TextLogPanel.tsx`
- [X] T033 [P] Update project and feature usage documentation in `/Users/bytedance/dev/study/p2p_display/README.md` and `/Users/bytedance/dev/study/p2p_display/specs/001-p2p-log-viewer/quickstart.md`
- [X] T034 Reconcile the implemented UI against the Pencil design states in `/Users/bytedance/dev/study/p2p_display/specs/001-p2p-log-viewer/log_viewer.pen`, `/Users/bytedance/dev/study/p2p_display/src/styles.css`, and `/Users/bytedance/dev/study/p2p_display/src/routes/LogViewerPage.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** has no dependencies and starts immediately.
- **Phase 2: Foundational** depends on Phase 1 and blocks all user stories.
- **Phase 3: US1** depends on Phase 2 and delivers the MVP.
- **Phase 4: US2** depends on Phase 2 and functionally builds on the parsed records from US1.
- **Phase 5: US3** depends on Phase 2 and should be integrated after US1 because the text panel consumes parsed records; it can overlap with late US2 work once the shared panel shell exists.
- **Phase 6: Polish** depends on the user stories selected for delivery.

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories once the foundation is done.
- **US2 (P2)**: Depends on US1’s parsed records and loaded-state UI being available.
- **US3 (P3)**: Depends on US1’s parsed records; its text-panel scrolling should accommodate US2’s timeline anchoring.

### Within Each User Story

- Tests should be written before or alongside implementation and should fail before the corresponding feature code is completed.
- Shared components come before store wiring when a task depends on their public props and events.
- Store actions and derived selectors come before route-level orchestration.
- UI composition comes after the underlying parser, selection, and panel behaviors are available.

### Parallel Opportunities

- `T003`, `T004`, and `T005` can run in parallel after `T001` and `T002`.
- `T006`, `T008`, `T009`, and `T011` can run in parallel once setup is complete; `T007` depends on `T006`.
- In US1, `T012`, `T013`, `T014`, and `T015` can run in parallel before `T016`.
- In US2, `T019`, `T020`, `T021`, and `T022` can run in parallel before `T023` and `T024` stitch them together.
- In US3, `T025`, `T026`, `T027`, `T028`, `T029`, and `T030` can run in parallel before `T031`.
- `T032` and `T033` can run in parallel during polish.

---

## Parallel Example: User Story 1

```bash
Task: "Add parser coverage for valid, invalid, partial, and extension-less inputs in /Users/bytedance/dev/study/p2p_display/tests/unit/log-parser/parseLogFile.test.ts"
Task: "Add upload-flow integration coverage for header upload and drag-drop entry points in /Users/bytedance/dev/study/p2p_display/tests/integration/log-viewer/uploadFlow.test.tsx"
Task: "Implement the header upload control and hidden file input in /Users/bytedance/dev/study/p2p_display/src/components/log-viewer/HeaderBar.tsx"
Task: "Implement the dashed drag-and-drop upload area with instructional content in /Users/bytedance/dev/study/p2p_display/src/components/log-viewer/UploadDropZone.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "Add timeline interaction integration coverage for disabled and active states in /Users/bytedance/dev/study/p2p_display/tests/integration/log-viewer/timelineNavigation.test.tsx"
Task: "Add browser-level coverage for timeline selection and hover tooltip behavior in /Users/bytedance/dev/study/p2p_display/tests/e2e/log-viewer/timeline.spec.ts"
Task: "Implement the slider-style timeline control with selected-point tooltip in /Users/bytedance/dev/study/p2p_display/src/components/log-viewer/TimelineSlider.tsx"
Task: "Implement the full timeline section with start and end labels plus disabled styling in /Users/bytedance/dev/study/p2p_display/src/components/log-viewer/TimelineSection.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "Add integration coverage for panel switching, row expansion, and unloaded-state rendering in /Users/bytedance/dev/study/p2p_display/tests/integration/log-viewer/textPanel.test.tsx"
Task: "Add large-list browser coverage for virtualized scrolling and topology placeholder behavior in /Users/bytedance/dev/study/p2p_display/tests/e2e/log-viewer/textPanel.spec.ts"
Task: "Implement the lower-panel tab switcher and empty-state presentation in /Users/bytedance/dev/study/p2p_display/src/components/log-viewer/PanelTabs.tsx and /Users/bytedance/dev/study/p2p_display/src/components/log-viewer/EmptyState.tsx"
Task: "Implement the selectable topology placeholder panel in /Users/bytedance/dev/study/p2p_display/src/components/log-viewer/TopologyPlaceholder.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational prerequisites.
3. Complete Phase 3: User Story 1.
4. Validate upload, drag-drop, parse success, partial parse, and invalid-file handling before moving on.

### Incremental Delivery

1. Deliver US1 as the first usable troubleshooting flow.
2. Add US2 to make the parsed result navigable by exact time.
3. Add US3 to complete high-volume browsing, inline raw-line inspection, and the topology placeholder.
4. Finish with Phase 6 performance and design validation work.

### Parallel Team Strategy

1. One engineer handles setup and parser foundations while another prepares test scaffolding and fixtures.
2. After Phase 2, US1 should remain the primary critical path to MVP.
3. Once US1 stabilizes, timeline work and text-panel work can proceed in parallel with coordination on `/Users/bytedance/dev/study/p2p_display/src/store/logViewerStore.ts` and `/Users/bytedance/dev/study/p2p_display/src/routes/LogViewerPage.tsx`.

---

## Notes

- All tasks follow the required checklist format with IDs, optional `[P]` markers, required `[US#]` labels for story phases, and exact file paths.
- The suggested MVP scope is **User Story 1 only** after Setup and Foundational phases complete.
- The highest shared-file contention points are `/Users/bytedance/dev/study/p2p_display/src/store/logViewerStore.ts`, `/Users/bytedance/dev/study/p2p_display/src/routes/LogViewerPage.tsx`, and `/Users/bytedance/dev/study/p2p_display/src/styles.css`; parallel work should branch around those files carefully.
