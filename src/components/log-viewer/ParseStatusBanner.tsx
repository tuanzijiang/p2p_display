import type { ParseSummary } from '@/features/log-parser/types';

type ParseStatusBannerProps = {
  loadStatus: 'idle' | 'loading' | 'ready' | 'error';
  parseSummary: ParseSummary | null;
};

export function ParseStatusBanner({ loadStatus, parseSummary }: ParseStatusBannerProps) {
  if (loadStatus === 'idle') {
    return null;
  }

  const tone =
    loadStatus === 'loading'
      ? 'info'
      : parseSummary?.status === 'partial'
        ? 'warning'
        : loadStatus === 'error'
          ? 'danger'
          : 'success';

  const message = loadStatus === 'loading' ? '正在解析日志，请稍候…' : parseSummary?.message;

  if (!message) {
    return null;
  }

  return (
    <section className={`parse-status parse-status--${tone}`} role="status">
      <p>{message}</p>
      {parseSummary ? (
        <>
          <dl className="parse-status__stats">
            <div>
              <dt>总行数</dt>
              <dd>{parseSummary.totalLines}</dd>
            </div>
            <div>
              <dt>有效记录</dt>
              <dd>{parseSummary.validRecordCount}</dd>
            </div>
            <div>
              <dt>跳过行数</dt>
              <dd>{parseSummary.invalidLineCount}</dd>
            </div>
            <div>
              <dt>总耗时</dt>
              <dd>{parseSummary.totalDurationMs} ms</dd>
            </div>
          </dl>

          {loadStatus !== 'loading' && parseSummary.stageTimings.length > 0 ? (
            <dl className="parse-status__timings">
              {parseSummary.stageTimings.map((stage) => (
                <div key={stage.key}>
                  <dt>{stage.label}</dt>
                  <dd>{stage.durationMs} ms</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
