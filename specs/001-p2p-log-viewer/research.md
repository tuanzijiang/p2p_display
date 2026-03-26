# Research: Local P2P Log Viewer

## Decision 1: Parse logs in-browser using line-by-line text scanning with targeted field extraction

- Decision: Read the uploaded file with the browser File API and parse it in the client using line splitting plus targeted extraction of timestamp and `_msg=` content.
- Rationale: The feature is explicitly local-only, the knowledge base already defines the log anatomy, and the viewer only needs a bounded subset of fields for v1. A focused parser keeps the implementation simple, deterministic, and aligned with the no-backend constraint.
- Alternatives considered:
  - Ship raw lines to a server for parsing. Rejected because it violates the local-analysis assumption and adds unnecessary infrastructure.
  - Parse every key-value field eagerly into a rich schema. Rejected because v1 only needs timestamp, core message, original line, and ordering; full-field extraction would slow delivery and increase memory cost.

## Decision 2: Model timeline selection as an exact timestamp value decoupled from record timestamps

- Decision: Represent the active timeline point as a numeric timestamp within the inclusive min/max range, even when no record exists at that exact moment.
- Rationale: The spec explicitly allows selecting any exact time in the range, not only event timestamps. Keeping selection independent from records makes the slider behavior predictable and supports smooth pointer interaction.
- Alternatives considered:
  - Snap selection to nearest log record. Rejected because it conflicts with the clarified requirement for arbitrary exact time selection.
  - Restrict selection to discrete parsed timestamps. Rejected for the same reason and because it creates uneven interaction on sparse logs.

## Decision 3: Position the text panel with binary search over sorted parsed timestamps

- Decision: Maintain parsed records in file order and use binary search to locate the first record whose timestamp is greater than or equal to the selected timeline value.
- Rationale: Parsed timestamps are naturally ordered by log sequence for the target files, and binary search keeps timeline-to-list jumps efficient on very large inputs.
- Alternatives considered:
  - Linear scan from the beginning on every selection. Rejected because it scales poorly for large files.
  - Re-sort records independently from file order. Rejected because the spec requires subsequent rows to continue in original file order after the first matching record.

## Decision 4: Use virtualization for the text panel and keep expansion state row-local

- Decision: Render the text panel with `@tanstack/react-virtual`, using variable-height row measurement so wrapped messages and inline expanded raw lines remain compatible with large datasets.
- Rationale: The spec requires continuous browsing across very large files without rendering the entire result set. A proven virtualization layer is lower risk than hand-rolled windowing for mixed-height content.
- Alternatives considered:
  - Render the entire list. Rejected because it will not scale to representative large files.
  - Build a custom virtual scroller from scratch. Rejected because it increases implementation risk without clear value over a focused library.

## Decision 5: Centralize viewer state in a dedicated Zustand store

- Decision: Store file metadata, parse status, parsed records, timeline bounds/selection, panel mode, and parse warnings in Zustand.
- Rationale: The repository already uses Zustand, and this feature needs shared state across header, upload surface, timeline, panel switcher, and text list.
- Alternatives considered:
  - Keep all state inside one route component. Rejected because the feature spans multiple coordinated UI regions and future additions such as topology will need shared state.
  - Introduce a heavier state framework. Rejected because Zustand already exists in the project and is sufficient.

## Decision 6: Treat the topology tab as a first-class placeholder route state, not hidden unfinished UI

- Decision: Implement the topology panel selector and render a full placeholder view that preserves the designed layout while clearly marking topology analysis as unavailable.
- Rationale: The spec requires the topology panel to be selectable and visually complete, even though topology functionality is deferred.
- Alternatives considered:
  - Omit the topology tab entirely. Rejected because it violates FR-011 and FR-015.
  - Show a one-line inline message in the content area. Rejected because FR-015A requires a full-page placeholder treatment.

## Decision 7: Validate accepted files by parseability, not extension alone

- Decision: Allow `.log`, `.txt`, and extension-less files in the picker/drop zone, but make final acceptance depend on whether at least one valid record can be parsed.
- Rationale: The spec ties acceptance to supported content, not only file naming. This also supports partially valid files and explicit failure messaging for fully invalid uploads.
- Alternatives considered:
  - Trust extension-only checks. Rejected because extension-less files are allowed and bad-content `.log` files must still fail gracefully.
  - Accept any text file without validation. Rejected because the viewer must keep the unloaded state when no valid records are found.
