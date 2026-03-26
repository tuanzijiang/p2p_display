const TIMESTAMP_PATTERN =
  /\b\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}(?:Z|[+-]\d{2}:\d{2})\b/;

export type ParsedTimestamp = {
  timestampText: string;
  timestampMs: number;
};

export function parseTimestamp(line: string): ParsedTimestamp | null {
  const match = line.match(TIMESTAMP_PATTERN);

  if (!match) {
    return null;
  }

  const timestampText = match[0];
  const timestampMs = new Date(timestampText).getTime();

  if (Number.isNaN(timestampMs)) {
    return null;
  }

  return {
    timestampText,
    timestampMs,
  };
}
