import type { ParsedLogRecord } from '@/features/log-parser/types';

type TextLogRowProps = {
  record: ParsedLogRecord;
  onToggle: (recordId: string) => void;
};

export function TextLogRow({ record, onToggle }: TextLogRowProps) {
  return (
    <article className={`text-log-row ${record.isExpanded ? 'is-expanded' : ''}`} data-testid="text-log-row">
      <button className="text-log-row__button" type="button" onClick={() => onToggle(record.id)}>
        <time className="text-log-row__time">{record.timestampText}</time>
        <span className="text-log-row__message">{record.message}</span>
      </button>
      {record.isExpanded ? <pre className="text-log-row__raw">{record.rawLine}</pre> : null}
    </article>
  );
}
