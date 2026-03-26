import type { ParseLogFileResult, ParsedLogRecord, ParseSummary } from './types';
import { extractMessage } from './extractMessage';
import { parseTimestamp } from './parseTimestamp';

const SUPPORTED_EXTENSIONS = new Set(['log', 'txt']);

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

function buildParseSummary(totalLines: number, validRecordCount: number, invalidLineCount: number): ParseSummary {
  if (totalLines === 0) {
    return {
      totalLines,
      validRecordCount,
      invalidLineCount,
      status: 'empty',
      message: '日志文件为空，请重新选择内容有效的文件。',
    };
  }

  if (validRecordCount === 0) {
    return {
      totalLines,
      validRecordCount,
      invalidLineCount,
      status: 'failed',
      message: '未找到可解析的 P2P 日志记录。',
    };
  }

  if (invalidLineCount > 0) {
    return {
      totalLines,
      validRecordCount,
      invalidLineCount,
      status: 'partial',
      message: `已解析 ${validRecordCount} 条记录，跳过 ${invalidLineCount} 行无法识别的内容。`,
    };
  }

  return {
    totalLines,
    validRecordCount,
    invalidLineCount,
    status: 'complete',
    message: `日志解析完成，共载入 ${validRecordCount} 条记录。`,
  };
}

export function parseLogFile(content: string): ParseLogFileResult {
  const lines = content.split(/\r?\n/).filter((line) => line.length > 0);
  const records: ParsedLogRecord[] = [];

  lines.forEach((line, index) => {
    const parsedTimestamp = parseTimestamp(line);
    const message = extractMessage(line);

    if (!parsedTimestamp || !message) {
      return;
    }

    records.push({
      id: `log-record-${index}`,
      lineNumber: index + 1,
      orderIndex: records.length,
      timestampText: parsedTimestamp.timestampText,
      timestampMs: parsedTimestamp.timestampMs,
      message,
      rawLine: line,
      isExpanded: false,
    });
  });

  const invalidLineCount = lines.length - records.length;
  const parseSummary = buildParseSummary(lines.length, records.length, invalidLineCount);

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
