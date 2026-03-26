# Feature Specification: Local P2P Log Viewer

**Feature Branch**: `001-p2p-log-viewer`  
**Created**: 2026-03-26  
**Status**: Draft  
**Input**: User description: "这是一个通过分析本地P2P日志的工具网页，整体页面分成顶部标题栏、时间轴区域和底部主题内容区域：顶部标题栏显示当前解析的日志文件路径，未解析时显示上传日志文件；支持点击上传并按 knowledge/01-how-to-parse-logs.md 解析。时间轴区域左侧为较长时间轴，未上传时禁用并灰色显示，上传后可点击并显示开始时间和结束时间；右侧为可拖拽上传日志文件的区域，与上传功能一致。底部主题区域分为文本面板和拓扑面板，可切换；文本面板显示日志时间和 msg，为可无限虚拟滚动的文本区域；拓扑面板暂不实现。"

## Clarifications

### Session 2026-03-26

- Q: What file identifier must the header display after upload? → A: Show the absolute local file path exactly as stored on disk.
- Q: How precise should timeline selection be? → A: The timeline can select any exact timestamp in the full time range, even if no log exists at that moment.
- Q: How much log detail should the text panel show in the main list? → A: Show timestamp and msg in the main list, with the full original log line available on demand.
- Q: Which upload file types should be accepted? → A: Accept .log, .txt, and extension-less files if contents are parseable.
- Q: After selecting a time point, where should the text panel start? → A: The first row shows the first log at or after the selected time, and following rows show subsequent logs.
- Q: What timeline visual style should the page use? → A: Use a horizontal slider-style timeline.
- Q: How should the selected time state appear on the timeline? → A: Show a highlighted selected point with a hover tooltip.
- Q: How should the drag-and-drop upload area look? → A: Use a dashed upload box with an icon and instructional text.
- Q: How should each text-panel log row be laid out? → A: Show time on the left and msg on the right, with msg allowed to wrap.
- Q: How should the full original log line be revealed? → A: Reveal it by expanding the selected row inline.
- Q: What should the lower content area show before any file is uploaded? → A: Show an illustration with explanatory empty-state text.
- Q: How should the topology panel placeholder appear? → A: Show a full placeholder page style rather than only a short text notice.
- Q: What device range is in scope for v1? → A: Desktop only.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload and Parse a Local Log (Priority: P1)

As an operator, I can load a local P2P log file from the page so that I can immediately inspect its timeline and core messages without relying on external systems.

**Why this priority**: Without local file loading and parsing, the page provides no value. This is the entry point for every other workflow.

**Independent Test**: Can be fully tested by loading a supported local log file and verifying that the file path, timeline bounds, and parsed text records appear on the page.

**Acceptance Scenarios**:

1. **Given** no log file has been loaded, **When** the user clicks the upload control and selects a supported local log file, **Then** the page shows the selected absolute local file path in the header and begins parsing the file contents.
2. **Given** no log file has been loaded, **When** the user drags a supported local log file into the drop zone, **Then** the file is accepted and processed in the same way as the click-to-upload flow.
3. **Given** a log file contains parseable timestamps and message fields, **When** parsing completes, **Then** the page displays the available time range and a browsable text list of parsed records.
4. **Given** the selected file uses `.log`, `.txt`, or no extension, **When** its contents match the supported log structure, **Then** the file is accepted for parsing.

---

### User Story 2 - Navigate Log Events by Time (Priority: P2)

As an operator, I can use the timeline to move to a specific time point so that I can focus the log view on the relevant portion of the investigation window.

**Why this priority**: Time-based navigation is the main way to reduce investigation effort once the file is loaded.

**Independent Test**: Can be tested by loading a log file with multiple timestamps, selecting different timeline positions, and verifying that the visible log content follows the chosen time point.

**Acceptance Scenarios**:

1. **Given** no log file has been loaded, **When** the user views the timeline, **Then** the timeline is visibly disabled and cannot be interacted with.
2. **Given** a log file has been parsed successfully, **When** the user views the timeline, **Then** the start time and end time are shown on the two sides of the timeline.
3. **Given** a parsed log file with multiple events, **When** the user selects any time point within the displayed time range on the timeline, **Then** the first row of the text panel shows the first log record at or after the selected time and the following rows continue with subsequent log records.
4. **Given** the user hovers over the selected timeline point, **When** the timeline is active, **Then** a tooltip appears to indicate the currently selected time.

---

### User Story 3 - Review Parsed Text Records (Priority: P3)

As an operator, I can switch to the text panel and continuously browse parsed log records so that I can inspect timestamps and core messages across very large files.

**Why this priority**: The text panel is the main investigation surface after parsing and time selection are available.

**Independent Test**: Can be tested by loading a large log file, switching to the text panel, and confirming that records remain readable and navigable through long continuous scrolling.

**Acceptance Scenarios**:

1. **Given** a log file has been parsed successfully, **When** the user opens the text panel, **Then** each visible record shows the log timestamp and the core message value in the main list.
2. **Given** a log file has been parsed successfully, **When** the user requests more detail for a record, **Then** the full original log line is available on demand without replacing the main list structure.
3. **Given** the log file contains more records than fit on screen, **When** the user continues scrolling through the text panel, **Then** additional records become available without interrupting reading.
4. **Given** the topology panel is selected, **When** the user opens it, **Then** the page clearly indicates that topology analysis is not yet available.
5. **Given** no log file has been loaded, **When** the user views the lower content area, **Then** the page shows an illustrated empty state with explanatory guidance.

### Edge Cases

- What happens when the user uploads a file that does not contain parseable P2P log lines? The page should reject the file gracefully, keep the timeline disabled, and explain that no valid log records were found.
- What happens when the file contains only one valid timestamp? The timeline should still show the single available time value and allow the text panel to display the parsed records.
- How does the system handle partially valid files? Valid records should still be shown, while malformed lines are skipped and reported as partially parsed.
- How does the system handle large local files? The page should remain usable for continuous browsing and should not require the user to wait for the entire file to be rendered at once.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present a three-part page layout consisting of a top header, a timeline section beneath the header, and a lower content section.
- **FR-001A**: The system MUST use a minimalist visual style with blue as the primary color family across the page's main interface elements.
- **FR-001B**: The desktop UI implementation MUST use the Pencil design file at `specs/001-p2p-log-viewer/log_viewer.pen` as the source of truth for page structure, layout hierarchy, spacing, visual styling, and component states.
- **FR-001C**: When implementation constraints require minor UI deviations from the Pencil design, the system MUST preserve the design's information architecture, visual hierarchy, and interaction affordances for the header, timeline area, upload area, segmented panel switcher, and lower content region.
- **FR-002**: The header MUST display the absolute local file path of the currently parsed log file exactly as stored on disk after a file has been loaded successfully.
- **FR-003**: The header MUST show an upload action labeled "上传日志文件" when no log file is currently loaded.
- **FR-004**: The system MUST allow users to load a local log file through the header upload action.
- **FR-005**: The system MUST provide a drag-and-drop file upload area in the right side of the timeline section, and this upload path MUST behave the same as the header upload action.
- **FR-005A**: The system MUST accept `.log` files, `.txt` files, and files without an extension when their contents can be parsed as supported P2P logs.
- **FR-005B**: The drag-and-drop upload area MUST appear as a dashed upload box containing an icon and instructional text.
- **FR-006**: The system MUST parse uploaded files according to the repository log parsing guidance, including extracting each record's timestamp and core message from valid log lines.
- **FR-007**: Before a log file is parsed successfully, the left-side timeline MUST appear disabled, use a non-active visual state, and reject time selection input.
- **FR-008**: After a log file is parsed successfully, the left-side timeline MUST become interactive and MUST show the earliest parsed timestamp and latest parsed timestamp at its two ends.
- **FR-008A**: The active timeline MUST use a horizontal slider-style presentation.
- **FR-009**: The system MUST allow the user to select any exact time point within the active timeline's displayed range.
- **FR-009A**: The selected time point on the timeline MUST have a visible highlighted state and MUST reveal a tooltip with the selected time when hovered.
- **FR-010**: Selecting a time point on the timeline MUST position the text panel so its first visible row is the first parsed log record at or after the selected time.
- **FR-010A**: After timeline-based positioning, the rows following the first visible row MUST continue with the subsequent parsed log records in file order.
- **FR-011**: The lower content section MUST provide two switchable panels: a text panel and a topology panel.
- **FR-012**: The text panel MUST display parsed log records as a scrollable list.
- **FR-013**: Each displayed text record MUST include the parsed timestamp and parsed core message.
- **FR-013A**: The text panel MUST allow the user to view the full original log line for an individual record on demand.
- **FR-013B**: Each text-panel row MUST display the timestamp on the left and the message on the right, and the message area MUST allow line wrapping.
- **FR-013C**: The full original log line MUST be revealed by expanding the selected row inline.
- **FR-014**: The text panel MUST support continuous browsing across the full parsed result set, including very large files, without requiring all records to be visible simultaneously.
- **FR-015**: The topology panel MUST be present as a selectable destination but MUST clearly indicate that topology functionality is not yet available.
- **FR-015A**: The topology panel placeholder MUST use a full-page placeholder treatment rather than only a short inline notice.
- **FR-016**: If parsing fails completely, the system MUST present a clear error message and MUST keep the interface in the unloaded state.
- **FR-017**: If parsing succeeds only partially, the system MUST show the successfully parsed records and MUST inform the user that some lines could not be interpreted.
- **FR-018**: Loading a new file MUST replace the previous parsed result, timeline range, and visible text records with the new file's data.
- **FR-019**: Before any file is uploaded, the lower content area MUST show an illustration with explanatory empty-state text.

### Key Entities *(include if feature involves data)*

- **Log File**: A local file selected or dropped by the user for analysis, including its source path, file name, and raw contents.
- **Parsed Log Record**: A single valid log line extracted from the uploaded file, including at minimum its timestamp, core message, original line content, and ordering within the file.
- **Timeline Range**: The available time span derived from the earliest and latest parsed timestamps in the current file.
- **Timeline Selection**: The currently chosen time point used to position the text panel within the parsed records.
- **Content Panel State**: The active lower-panel mode, either text view or topology view placeholder.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can load a supported local log file and see the parsed file path, timeline bounds, and initial text records within 5 seconds for a typical investigation file.
- **SC-002**: At least 95% of valid log lines in a supported file are surfaced in the text panel with both timestamp and core message visible.
- **SC-003**: In usability checks, 90% of users can move from file upload to a chosen time point in under 30 seconds without guidance.
- **SC-004**: In representative large-file testing, users can continue scrolling and reading records through the full result set without the page becoming unresponsive.
- **SC-005**: 100% of fully invalid uploads result in a visible failure message and do not leave the timeline in an active state.
- **SC-006**: In design review against `specs/001-p2p-log-viewer/log_viewer.pen`, the delivered desktop UI matches the approved Pencil design in overall layout regions, key visual states, and primary interaction entry points.

## Assumptions

- The first release is intended for a single local user operating the page in a desktop browser during troubleshooting.
- The visual direction for v1 is defined by `specs/001-p2p-log-viewer/log_viewer.pen`, which currently uses a minimalist desktop layout with blue as the dominant color tone.
- The interface scope for v1 is desktop only and does not need tablet or mobile adaptations.
- Uploaded files are processed locally within the browser session and are not required to be sent to an external service.
- The runtime environment used for this feature can provide the uploaded file's absolute local path to the page so the header can display it exactly as stored on disk.
- The parsing scope for v1 is limited to timestamp and core message extraction from log lines that match the repository's documented P2P log structure.
- The topology panel is intentionally a placeholder in this release and does not need to provide graph or relationship analysis yet.
- When the user selects a time point, the text panel starts from the first parsed log record at or after that selected time and continues forward in file order.
