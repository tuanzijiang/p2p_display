import type { ParseSummary, ParsedLogRecord, TimelineRange } from '@/features/log-parser/types';

export type ViewerLoadStatus = 'idle' | 'loading' | 'ready' | 'error';
export type ActivePanel = 'text' | 'topology';

export type ViewerFileMeta = {
  sourcePath: string | null;
  fileName: string | null;
  fileSizeBytes: number;
};

export type ViewerState = ViewerFileMeta & {
  loadStatus: ViewerLoadStatus;
  records: ParsedLogRecord[];
  parseSummary: ParseSummary | null;
  timelineRange: TimelineRange | null;
  selectedTimestampMs: number | null;
  anchorRecordIndex: number;
  activePanel: ActivePanel;
  panelScrollTops: Record<ActivePanel, number>;
};
