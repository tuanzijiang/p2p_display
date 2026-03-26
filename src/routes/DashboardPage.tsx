import { useAppStore } from '../store/appStore';

export function DashboardPage() {
  const count = useAppStore((state) => state.count);
  const increment = useAppStore((state) => state.increment);
  const reset = useAppStore((state) => state.reset);

  return (
    <section className="card">
      <h2>Dashboard</h2>
      <p className="page-text">这个页面演示了通过全局状态在不同路由间共享数据。</p>
      <div className="counter-panel">
        <strong>{count}</strong>
        <div className="actions">
          <button className="primary button-reset" type="button" onClick={increment}>
            增加
          </button>
          <button className="secondary button-reset" type="button" onClick={reset}>
            重置
          </button>
        </div>
      </div>
    </section>
  );
}
