export type ParsedLogRecord = {
  id: string;
  lineNumber: number;
  orderIndex: number;
  timestampText: string;
  timestampMs: number;
  message: string;
  rawLine: string;
  isExpanded?: boolean;
};

export type ParseSummaryStatus = 'empty' | 'partial' | 'complete' | 'failed';

export type ParseSummary = {
  totalLines: number;
  validRecordCount: number;
  invalidLineCount: number;
  status: ParseSummaryStatus;
  message: string;
};

export type TimelineRange = {
  startMs: number;
  endMs: number;
  startLabel: string;
  endLabel: string;
};

export type ParseLogFileResult = {
  records: ParsedLogRecord[];
  parseSummary: ParseSummary;
  timelineRange: TimelineRange | null;
};
