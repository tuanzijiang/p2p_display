import { TimelineSlider } from './TimelineSlider';

type TimelineSectionProps = {
  disabled: boolean;
  startLabel: string;
  endLabel: string;
  selectedTimestampMs: number;
  rangeStartMs: number;
  rangeEndMs: number;
  onChange: (value: number) => void;
};

export function TimelineSection({
  disabled,
  startLabel,
  endLabel,
  selectedTimestampMs,
  rangeStartMs,
  rangeEndMs,
  onChange,
}: TimelineSectionProps) {
  return (
    <section className={`timeline-card ${disabled ? 'is-disabled' : ''}`}>
      <div className="timeline-card__header">
        <div>
          <p className="section-label">时间轴</p>
          <h2>按时间精确定位日志事件</h2>
        </div>
        <span className="timeline-card__state">{disabled ? '等待日志解析' : '已激活'}</span>
      </div>

      <TimelineSlider
        disabled={disabled}
        rangeEndMs={rangeEndMs}
        rangeStartMs={rangeStartMs}
        selectedTimestampMs={selectedTimestampMs}
        onChange={onChange}
      />

      <div className="timeline-card__labels">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </section>
  );
}
