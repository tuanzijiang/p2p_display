# Data Model: Local P2P Log Viewer

## Entity: LogFileSession

- Purpose: Represents the currently loaded local file and the viewer state derived from it.
- Fields:
  - `sourcePath: string`
  - `fileName: string`
  - `fileSizeBytes: number`
  - `rawText?: string`
  - `loadStatus: 'idle' | 'loading' | 'ready' | 'error'`
  - `parseSummary: ParseSummary`
  - `timelineRange?: TimelineRange`
  - `selectedTimestampMs?: number`
  - `activePanel: 'text' | 'topology'`
- Validation:
  - `sourcePath` must be the absolute path provided by the runtime when a file has loaded successfully.
  - `loadStatus='ready'` requires at least one parsed valid record.
  - `selectedTimestampMs`, when present, must be within `timelineRange.startMs` and `timelineRange.endMs`.
- Relationships:
  - Owns many `ParsedLogRecord` entries.
  - Owns one `ParseSummary`.
  - Owns zero or one `TimelineRange`.

## Entity: ParsedLogRecord

- Purpose: Represents one valid parsed log line available to the text panel.
- Fields:
  - `id: string`
  - `lineNumber: number`
  - `orderIndex: number`
  - `timestampText: string`
  - `timestampMs: number`
  - `message: string`
  - `rawLine: string`
  - `isExpanded?: boolean`
- Validation:
  - `lineNumber` and `orderIndex` must be non-negative integers with stable file order.
  - `timestampMs` must be parseable from the source line timestamp.
  - `message` must come from the `_msg=` field and should be non-empty for a valid parsed record.
- Relationships:
  - Belongs to one `LogFileSession`.

## Entity: TimelineRange

- Purpose: Defines the active selectable time span for the slider.
- Fields:
  - `startMs: number`
  - `endMs: number`
  - `startLabel: string`
  - `endLabel: string`
- Validation:
  - `startMs <= endMs`
  - For a single-timestamp file, `startMs === endMs` is allowed.
- Relationships:
  - Belongs to one `LogFileSession`.

## Entity: TimelineSelection

- Purpose: Captures the current exact time point chosen on the slider.
- Fields:
  - `selectedTimestampMs: number`
  - `displayLabel: string`
  - `anchorRecordIndex: number`
- Validation:
  - `selectedTimestampMs` must fall within `TimelineRange`.
  - `anchorRecordIndex` must resolve to the first record whose `timestampMs >= selectedTimestampMs`, or the record count when no later record exists.
- Relationships:
  - Derived from one `TimelineRange` and many `ParsedLogRecord` items.

## Entity: ParseSummary

- Purpose: Summarizes the parsing outcome for user feedback and error states.
- Fields:
  - `totalLines: number`
  - `validRecordCount: number`
  - `invalidLineCount: number`
  - `status: 'empty' | 'partial' | 'complete' | 'failed'`
  - `message: string`
- Validation:
  - `validRecordCount + invalidLineCount <= totalLines`
  - `status='failed'` when `validRecordCount === 0`
  - `status='partial'` when both valid and invalid lines exist
- Relationships:
  - Belongs to one `LogFileSession`.

## Entity: ContentPanelState

- Purpose: Tracks which lower panel is active.
- Fields:
  - `activePanel: 'text' | 'topology'`
- Validation:
  - Only one panel may be active at a time.
- Relationships:
  - Belongs to one `LogFileSession`.

## State Transitions

### File Session Lifecycle

1. `idle` -> `loading`
   - Trigger: user selects or drops a candidate file.
   - Effect: reset prior viewer state and begin file read.
2. `loading` -> `ready`
   - Trigger: parse produces at least one valid record.
   - Effect: store parsed records, derive timeline bounds, set default selected timestamp to `startMs`, activate text panel content.
3. `loading` -> `error`
   - Trigger: file cannot be read or parse yields zero valid records.
   - Effect: clear interactive timeline state, show failure message, preserve unloaded-style UI.
4. `ready` -> `loading`
   - Trigger: user loads a replacement file.
   - Effect: discard previous file-derived data before processing the new file.

### Timeline Selection Lifecycle

1. `undefined` -> `startMs`
   - Trigger: first successful parse.
   - Effect: text panel anchors to the first parsed record in file order.
2. `current` -> `next`
   - Trigger: user drags or clicks the active slider.
   - Effect: recompute `anchorRecordIndex` with binary search and scroll the virtual list to that row.

### Record Expansion Lifecycle

1. `collapsed` -> `expanded`
   - Trigger: user expands a text row.
   - Effect: reveal the original raw log line inline for that row.
2. `expanded` -> `collapsed`
   - Trigger: user toggles the same row closed or expands a different row if single-expand behavior is chosen.

## Derived Views

- `visibleRows`: computed from the virtualizer window and `anchorRecordIndex`.
- `timelineDisabled`: `true` unless `LogFileSession.loadStatus === 'ready'`.
- `emptyStateVariant`: `illustration` when no file is loaded; `error` when parsing fully fails; `partial-warning` banner when parsing is partial.
