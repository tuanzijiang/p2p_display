import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { ParsedLogRecord } from '@/features/log-parser/types';
import { TextLogRow } from './TextLogRow';

type TextLogPanelProps = {
  records: ParsedLogRecord[];
  anchorRecordIndex: number;
  onToggleRecord: (recordId: string) => void;
};

export function TextLogPanel({ records, anchorRecordIndex, onToggleRecord }: TextLogPanelProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const startIndex = Math.min(anchorRecordIndex, records.length);
  const visibleRecords = useMemo(() => records.slice(startIndex), [records, startIndex]);
  const useVirtualizedList = visibleRecords.length > 200;

  const virtualizer = useVirtualizer({
    count: visibleRecords.length,
    estimateSize: (index) => (visibleRecords[index]?.isExpanded ? 176 : 88),
    getScrollElement: () => parentRef.current,
    overscan: 8,
    getItemKey: (index) => visibleRecords[index]?.id ?? index,
  });

  return (
    <section className="text-log-panel">
      <div className="text-log-panel__summary">
        <p className="section-label">日志正文</p>
        <h2>从所选时间点开始连续浏览文本记录</h2>
        <span>{visibleRecords.length} 条可见记录</span>
      </div>

      <div
        ref={parentRef}
        className="text-log-panel__viewport"
        data-anchor-index={anchorRecordIndex}
        data-testid="text-log-panel"
      >
        {useVirtualizedList ? (
          <div
            className="text-log-panel__content"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualizer.getVirtualItems().map((item) => {
              const record = visibleRecords[item.index];

              if (!record) {
                return null;
              }

              return (
                <div
                  key={item.key}
                  className="text-log-panel__item"
                  data-index={record.orderIndex}
                  ref={virtualizer.measureElement}
                  style={{
                    transform: `translateY(${item.start}px)`,
                  }}
                >
                  <TextLogRow record={record} onToggle={onToggleRecord} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-log-panel__static-list">
            {visibleRecords.map((record) => (
              <TextLogRow key={record.id} record={record} onToggle={onToggleRecord} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
