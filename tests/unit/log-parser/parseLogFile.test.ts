import { describe, expect, it } from 'vitest';
import { parseLogFile, isSupportedLogFile } from '@/features/log-parser/parseLogFile';
import {
  EXTENSIONLESS_FILE_NAME,
  INVALID_LOG_TEXT,
  PARTIAL_LOG_TEXT,
  VALID_LOG_TEXT,
} from '@tests/fixtures/p2pLogSamples';

describe('parseLogFile', () => {
  it('parses valid log lines into timeline records', () => {
    const result = parseLogFile(VALID_LOG_TEXT);

    expect(result.records).toHaveLength(3);
    expect(result.parseSummary.status).toBe('complete');
    expect(result.timelineRange?.startLabel).toBe('2026-03-26 14:29:54.055+08:00');
    expect(result.records[0].message).toContain('[P2P]StartMatch');
    expect(result.parseSummary.stageTimings.map((stage) => stage.key)).toEqual([
      'split-lines',
      'extract-records',
      'build-summary',
    ]);
    expect(result.parseSummary.totalDurationMs).toBeGreaterThanOrEqual(0);
  });

  it('reports partial success when some lines are malformed', () => {
    const result = parseLogFile(PARTIAL_LOG_TEXT);

    expect(result.records).toHaveLength(2);
    expect(result.parseSummary.status).toBe('partial');
    expect(result.parseSummary.invalidLineCount).toBe(1);
  });

  it('fails gracefully when no valid records are found', () => {
    const result = parseLogFile(INVALID_LOG_TEXT);

    expect(result.records).toHaveLength(0);
    expect(result.timelineRange).toBeNull();
    expect(result.parseSummary.status).toBe('failed');
  });

  it('accepts extensionless file names as supported inputs', () => {
    expect(isSupportedLogFile(EXTENSIONLESS_FILE_NAME)).toBe(true);
    expect(isSupportedLogFile('sample.log')).toBe(true);
    expect(isSupportedLogFile('sample.txt')).toBe(true);
    expect(isSupportedLogFile('sample.json')).toBe(false);
  });
});
