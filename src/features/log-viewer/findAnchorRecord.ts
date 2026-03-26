import type { ParsedLogRecord } from '@/features/log-parser/types';

export function findAnchorRecord(records: ParsedLogRecord[], selectedTimestampMs: number) {
  let left = 0;
  let right = records.length;

  while (left < right) {
    const middle = Math.floor((left + right) / 2);

    if (records[middle].timestampMs < selectedTimestampMs) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }

  return left;
}
