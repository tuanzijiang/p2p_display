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
      <p className="section-label">时间轴</p>

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
