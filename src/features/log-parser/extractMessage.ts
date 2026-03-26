const MESSAGE_MARKER = '_msg=';
const MESSAGE_BOUNDARIES = [' _params=', ' __', ' _podname=', ' ctx_', ' device_id=', ' meeting_id='];

export function extractMessage(line: string): string | null {
  const markerIndex = line.indexOf(MESSAGE_MARKER);

  if (markerIndex === -1) {
    return null;
  }

  const startIndex = markerIndex + MESSAGE_MARKER.length;
  let endIndex = line.length;

  for (const boundary of MESSAGE_BOUNDARIES) {
    const boundaryIndex = line.indexOf(boundary, startIndex);

    if (boundaryIndex !== -1) {
      endIndex = Math.min(endIndex, boundaryIndex);
    }
  }

  const message = line.slice(startIndex, endIndex).trim();
  return message.length > 0 ? message : null;
}
