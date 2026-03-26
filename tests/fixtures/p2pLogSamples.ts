export const VALID_LOG_LINES = [
  'Info 2026-03-26 14:29:54.055+08:00 utils.go:34 10.150.52.215 byteview.media.schedule_test _msg=[P2P]StartMatch _params={"step":1}',
  'Info 2026-03-26 14:30:10.100+08:00 utils.go:35 10.150.52.215 byteview.media.schedule_test _msg=[P2P]PeerConnected _params={"step":2}',
  'Info 2026-03-26 14:31:00.999+08:00 utils.go:36 10.150.52.215 byteview.media.schedule_test _msg=[P2P]PublishDone _params={"step":3}',
] as const;

export const PARTIAL_LOG_LINES = [
  VALID_LOG_LINES[0],
  'Info malformed line without message field',
  VALID_LOG_LINES[1],
] as const;

export const INVALID_LOG_LINES = [
  'Info no timestamp and no message',
  'Debug just some unrelated output',
] as const;

export const VALID_LOG_TEXT = `${VALID_LOG_LINES.join('\n')}\n`;
export const PARTIAL_LOG_TEXT = `${PARTIAL_LOG_LINES.join('\n')}\n`;
export const INVALID_LOG_TEXT = `${INVALID_LOG_LINES.join('\n')}\n`;
export const EXTENSIONLESS_FILE_NAME = 'p2p-session';

export function makeFile(
  text,
  name = 'viewer.log',
  type = 'text/plain',
  absolutePath = `/tmp/${name}`,
) {
  const file = new File([text], name, { type });
  Object.defineProperty(file, 'path', {
    configurable: true,
    value: absolutePath,
  });
  return file;
}
