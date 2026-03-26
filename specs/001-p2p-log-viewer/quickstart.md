# Quickstart: Local P2P Log Viewer

## Goal

Implement the desktop local log viewer in the existing React SPA with browser-only parsing, Pencil-driven layout, timeline navigation, and a virtualized text panel.

## Prerequisites

- Node.js 20+ recommended for the Vite 5 toolchain
- Existing repository checkout on branch `001-p2p-log-viewer`
- Pencil design file available at `specs/001-p2p-log-viewer/log_viewer.pen`

## 1. Install or update dependencies

The feature now uses these added packages:

- `@tanstack/react-virtual`
- `vitest`
- `@testing-library/react`
- `@testing-library/user-event`
- `jsdom`
- `playwright`

## 2. Start from the design and parsing guidance

- UI source of truth: `specs/001-p2p-log-viewer/log_viewer.pen`
- Parsing source of truth: `knowledge/01-how-to-parse-logs.md`
- Feature requirements: `specs/001-p2p-log-viewer/spec.md`

## 3. Implemented slices

1. The SPA root route now renders the desktop log viewer layout from the Pencil design direction.
2. `src/features/log-parser/` provides timestamp parsing, `_msg` extraction, supported-file checks, and parse-summary generation.
3. `src/store/logViewerStore.ts` centralizes file loading, parse state, timeline selection, and panel switching.
4. `src/components/log-viewer/` contains the header upload control, drag-drop zone, timeline, tabs, text rows, and topology placeholder.
5. `src/components/log-viewer/TextLogPanel.tsx` uses `@tanstack/react-virtual` for large sets and a direct list fallback for small sets and tests.
6. Unit, integration, and Playwright e2e coverage are wired through `npm run test` and `npm run test:e2e`.

## 4. Suggested file layout additions

```text
src/
├── components/log-viewer/
├── features/log-parser/
├── features/timeline/
├── routes/
├── store/
└── styles/
```

## 5. Verification targets

- Upload via click and drag-drop both succeed on valid files.
- Invalid files show failure messaging and keep the timeline disabled.
- Partial files show records plus a skipped-lines warning.
- Timeline selection jumps the text list to the first record at or after the selected time.
- Large files remain responsive while scrolling.

## 6. Local commands

```bash
npm install
npm run dev
npm run test
npm run test:e2e
```

If Playwright browsers are missing on a new machine:

```bash
npx playwright install chromium
```
