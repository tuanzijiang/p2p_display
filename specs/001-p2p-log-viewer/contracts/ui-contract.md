# UI Contract: Local P2P Log Viewer

## Purpose

Define the externally observable UI behavior for the local P2P log viewer so implementation, testing, and future refactors preserve the same interaction contract.

## Route Contract

- Primary route: `/`
- Rendering mode: single desktop page with three vertical regions
  - header
  - timeline/upload section
  - lower content section

## Input Contracts

### File Upload

- Header upload action label: `上传日志文件` when no file is loaded.
- Drag-and-drop upload area accepts:
  - `.log`
  - `.txt`
  - extension-less files
- Final acceptance rule: the file is only considered successfully loaded if parsing yields at least one valid `ParsedLogRecord`.

### Timeline Interaction

- Timeline is disabled before successful parse.
- Active timeline allows selecting any exact timestamp between `TimelineRange.startMs` and `TimelineRange.endMs`.
- Hovering the selected point shows a tooltip for the currently selected time.

### Panel Switching

- Lower content switcher exposes exactly two destinations:
  - `text`
  - `topology`

## Output Contracts

### Header Region

- Before successful parse:
  - show upload affordance with the label `上传日志文件`
- After successful parse:
  - show absolute local path exactly as provided by the runtime

### Timeline Region

- Disabled state:
  - visually muted
  - rejects pointer and keyboard changes
- Ready state:
  - left label shows earliest parsed timestamp
  - right label shows latest parsed timestamp
  - selected point has highlighted visual state

### Upload Drop Zone

- Must present a dashed boundary, upload icon, and instructional text.
- Dropping a supported file must invoke the same processing flow as header upload.

### Text Panel

- Each row shows:
  - timestamp on the left
  - parsed `_msg` value on the right
- Message content may wrap to multiple lines.
- Full original log line is revealed inline when the row is expanded.
- The list supports virtualized continuous scrolling for large inputs.

### Topology Panel

- Panel remains selectable.
- Panel body renders a full placeholder state that clearly indicates topology analysis is not yet available.

### Parse Feedback

- Complete failure:
  - show clear failure messaging
  - timeline remains disabled
  - lower content uses unloaded/error state, not stale previous results
- Partial success:
  - show parsed records
  - surface a warning that some lines were skipped

## State Contract

```ts
type ViewerLoadStatus = 'idle' | 'loading' | 'ready' | 'error';
type ActivePanel = 'text' | 'topology';

interface ViewerState {
  loadStatus: ViewerLoadStatus;
  sourcePath: string | null;
  records: ParsedLogRecord[];
  parseSummary: ParseSummary | null;
  timelineRange: TimelineRange | null;
  selectedTimestampMs: number | null;
  anchorRecordIndex: number;
  activePanel: ActivePanel;
}
```

## Behavioral Invariants

- Loading a new file replaces all previous file-derived state.
- `selectedTimestampMs` is null whenever the timeline is disabled.
- `anchorRecordIndex` always points to the first record at or after the selected time when records exist.
- The UI must not require all parsed rows to be mounted at once.
