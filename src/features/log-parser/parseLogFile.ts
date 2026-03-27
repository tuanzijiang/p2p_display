import type { ParseLogFileResult, ParsedLogRecord, ParseStageTiming, ParseSummary } from './types';
import { extractMessage } from './extractMessage';
import { parseTimestamp } from './parseTimestamp';

const SUPPORTED_EXTENSIONS = new Set(['log', 'txt']);
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

export function isSupportedLogFile(fileName: string) {
  const trimmedName = fileName.trim();

  if (!trimmedName) {
    return false;
  }

  const extensionIndex = trimmedName.lastIndexOf('.');

  if (extensionIndex === -1) {
    return true;
  }

  const extension = trimmedName.slice(extensionIndex + 1).toLowerCase();
  return SUPPORTED_EXTENSIONS.has(extension);
}

function measureStage<T>(label: string, key: string, operation: () => T): { result: T; timing: ParseStageTiming } {
  const start = now();
  const result = operation();
  const durationMs = Math.round((now() - start) * 1000) / 1000;

  return {
    result,
    timing: {
      key,
      label,
      durationMs,
    },
  };
}

function sumStageDurations(stageTimings: ParseStageTiming[]) {
  return Math.round(stageTimings.reduce((total, stage) => total + stage.durationMs, 0) * 1000) / 1000;
}

function buildParseSummary(
  totalLines: number,
  validRecordCount: number,
  invalidLineCount: number,
  stageTimings: ParseStageTiming[],
): ParseSummary {
  const stageTimingsSnapshot = [...stageTimings];
  const totalDurationMs = sumStageDurations(stageTimingsSnapshot);

  if (totalLines === 0) {
    return {
      totalLines,
      validRecordCount,
      invalidLineCount,
      status: 'empty',
      message: '日志文件为空，请重新选择内容有效的文件。',
      stageTimings: stageTimingsSnapshot,
      totalDurationMs,
    };
  }

  if (validRecordCount === 0) {
    return {
      totalLines,
      validRecordCount,
      invalidLineCount,
      status: 'failed',
      message: '未找到可解析的 P2P 日志记录。',
      stageTimings: stageTimingsSnapshot,
      totalDurationMs,
    };
  }

  if (invalidLineCount > 0) {
    return {
      totalLines,
      validRecordCount,
      invalidLineCount,
      status: 'partial',
      message: `已解析 ${validRecordCount} 条记录，跳过 ${invalidLineCount} 行无法识别的内容。`,
      stageTimings: stageTimingsSnapshot,
      totalDurationMs,
    };
  }

  return {
    totalLines,
    validRecordCount,
    invalidLineCount,
    status: 'complete',
    message: `日志解析完成，共载入 ${validRecordCount} 条记录。`,
    stageTimings: stageTimingsSnapshot,
    totalDurationMs,
  };
}

export function parseLogFile(content: string): ParseLogFileResult {
  const stageTimings: ParseStageTiming[] = [];
  const { result: lines, timing: splitLinesTiming } = measureStage('切分日志行', 'split-lines', () =>
    content.split(/\r?\n/).filter((line) => line.length > 0),
  );
  stageTimings.push(splitLinesTiming);

  const { result: records, timing: extractRecordsTiming } = measureStage('提取有效记录', 'extract-records', () => {
    const nextRecords: ParsedLogRecord[] = [];

    lines.forEach((line, index) => {
      const parsedTimestamp = parseTimestamp(line);
      const message = extractMessage(line);

      if (!parsedTimestamp || !message) {
        return;
      }

      nextRecords.push({
        id: `log-record-${index}`,
        lineNumber: index + 1,
        orderIndex: nextRecords.length,
        timestampText: parsedTimestamp.timestampText,
        timestampMs: parsedTimestamp.timestampMs,
        message,
        rawLine: line,
        isExpanded: false,
      });
    });

    return nextRecords;
  });
  stageTimings.push(extractRecordsTiming);

  const invalidLineCount = lines.length - records.length;
  const { result: parseSummary, timing: buildSummaryTiming } = measureStage('生成解析汇总', 'build-summary', () =>
    buildParseSummary(lines.length, records.length, invalidLineCount, stageTimings),
  );
  stageTimings.push(buildSummaryTiming);
  parseSummary.stageTimings = [...parseSummary.stageTimings, buildSummaryTiming];
  parseSummary.totalDurationMs = sumStageDurations(parseSummary.stageTimings);

  if (records.length === 0) {
    return {
      records,
      parseSummary,
      timelineRange: null,
    };
  }

  const firstRecord = records[0];
  const lastRecord = records[records.length - 1];

  return {
    records,
    parseSummary,
    timelineRange: {
      startMs: firstRecord.timestampMs,
      endMs: lastRecord.timestampMs,
      startLabel: firstRecord.timestampText,
      endLabel: lastRecord.timestampText,
    },
  };
}
