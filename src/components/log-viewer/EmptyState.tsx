type EmptyStateProps = {
  variant?: 'idle' | 'error';
  message?: string | null;
};

export function EmptyState({ variant = 'idle', message }: EmptyStateProps) {
  return (
    <section className={`empty-state empty-state--${variant}`}>
      <div className="empty-state__illustration" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="empty-state__body">
        <p className="section-label">{variant === 'error' ? '解析失败' : '等待日志输入'}</p>
        <h2>{variant === 'error' ? '未找到有效日志记录' : '上传本地日志后即可开始分析'}</h2>
        <p>
          {message ||
            '通过顶部按钮或右侧拖拽区域导入日志文件。解析完成后，这里会显示可滚动的文本记录和后续拓扑占位视图。'}
        </p>
      </div>
    </section>
  );
}
