import type { TimelineRange } from '@/features/log-parser/types';

function pad(value: number, size = 2) {
  return String(value).padStart(size, '0');
}

export function formatTimelineTimestamp(timestampMs: number) {
  const date = new Date(timestampMs);

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`,
  ].join(' ');
}

export function formatTimelineRange(range: TimelineRange | null) {
  if (!range) {
    return '等待解析日志';
  }

  return `${range.startLabel} - ${range.endLabel}`;
}

export function clampTimelineValue(timestampMs: number, range: TimelineRange) {
  return Math.min(range.endMs, Math.max(range.startMs, timestampMs));
}
