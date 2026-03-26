# Implementation Plan: Local P2P Log Viewer

**Branch**: `001-p2p-log-viewer` | **Date**: 2026-03-26 | **Spec**: [/Users/bytedance/dev/study/p2p_display/specs/001-p2p-log-viewer/spec.md](/Users/bytedance/dev/study/p2p_display/specs/001-p2p-log-viewer/spec.md)
**Input**: Feature specification from `/specs/001-p2p-log-viewer/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a desktop-only local P2P log viewer in the existing Vite + React SPA that follows the Pencil design, accepts local log files through click or drag-and-drop, parses timestamps and `_msg` values using the repository log guidance, exposes a slider-style timeline for exact timestamp selection, and renders a high-volume text panel using virtualization plus binary-search positioning.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x  
**Primary Dependencies**: Vite 5, React 19, React Router 6, Zustand 5, `@tanstack/react-virtual` for large-list rendering, browser File API, Pencil design at `specs/001-p2p-log-viewer/log_viewer.pen`  
**Storage**: N/A; all file contents and derived viewer state remain in browser memory for the active session  
**Testing**: Vitest + React Testing Library for component/store/parser tests; Playwright for upload, drag-drop, timeline, and large-list integration coverage  
**Target Platform**: Desktop web browsers running the existing SPA locally  
**Project Type**: Frontend web application  
**Performance Goals**: Parse a typical troubleshooting file and show initial results within 5 seconds; keep timeline updates and scrolling responsive at interactive frame rates on large files; avoid rendering the full result set at once  
**Constraints**: Local-only processing, no backend, desktop-only v1, exact local path must be surfaced if available from runtime, timeline remains disabled until valid parse succeeds, UI should preserve Pencil visual hierarchy and states  
**Scale/Scope**: One active file per session, single operator workflow, support for partially valid files, support for very large record sets on the order of hundreds of thousands of lines

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The current `/Users/bytedance/dev/study/p2p_display/.specify/memory/constitution.md` is still the default placeholder template and does not define enforceable principles or gates.

- Gate status before Phase 0: PASS, with no active constitutional constraints to validate.
- Risk note: once the constitution is formalized, this plan should be re-checked against the finalized principles.
- Gate status after Phase 1: PASS, unchanged for the same reason.

## Project Structure

### Documentation (this feature)

```text
specs/001-p2p-log-viewer/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
```text
src/
├── App.tsx
├── main.tsx
├── router.tsx
├── routes/
│   ├── DashboardPage.tsx
│   └── HomePage.tsx
├── store/
│   └── appStore.ts
└── styles.css

knowledge/
└── 01-how-to-parse-logs.md

specs/001-p2p-log-viewer/
└── log_viewer.pen

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Use the existing single-project frontend structure rooted at `src/`, extend it with feature-focused folders such as `components/log-viewer`, `features/log-parser`, `features/timeline`, and `store/` slices as implementation proceeds, and add a new `tests/` tree for parser, state, and browser-flow coverage. No backend or separate frontend package is needed because all parsing and viewing stay in the browser.

## Complexity Tracking

No constitution violations require justification because the constitution file does not yet define project-specific gates.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
