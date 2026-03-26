export function TopologyPlaceholder() {
  return (
    <section className="topology-placeholder">
      <div className="topology-placeholder__graphic" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="topology-placeholder__body">
        <p className="section-label">Topology</p>
        <h2>拓扑分析能力尚未开放</h2>
        <p>当前版本先提供可选入口与完整占位布局，后续会在此处补充节点关系、链路分组与异常拓扑视图。</p>
      </div>
    </section>
  );
}
