import { formatTimelineTimestamp } from '@/features/log-viewer/timeRange';

type TimelineSliderProps = {
  disabled: boolean;
  rangeStartMs: number;
  rangeEndMs: number;
  selectedTimestampMs: number;
  onChange: (value: number) => void;
};

export function TimelineSlider({
  disabled,
  rangeStartMs,
  rangeEndMs,
  selectedTimestampMs,
  onChange,
}: TimelineSliderProps) {
  const progress =
    rangeEndMs === rangeStartMs ? 0 : ((selectedTimestampMs - rangeStartMs) / (rangeEndMs - rangeStartMs)) * 100;

  return (
    <div className={`timeline-slider ${disabled ? 'is-disabled' : ''}`}>
      <div className="timeline-slider__track">
        <div className="timeline-slider__fill" style={{ width: `${progress}%` }} />
      </div>
      <input
        aria-label="日志时间轴"
        className="timeline-slider__input"
        data-testid="timeline-slider"
        disabled={disabled}
        max={rangeEndMs}
        min={rangeStartMs}
        step={1}
        type="range"
        value={selectedTimestampMs}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="timeline-slider__thumb" style={{ left: `${progress}%` }}>
        <span className="timeline-slider__tooltip">{formatTimelineTimestamp(selectedTimestampMs)}</span>
      </div>
    </div>
  );
}
