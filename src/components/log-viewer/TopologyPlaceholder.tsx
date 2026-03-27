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
        <h2>拓扑分析能力尚未开放</h2>
        <p>当前版本保留与设计稿一致的拓扑面板入口，后续会在这里补充节点关系、链路分组和异常链路视图。</p>
      </div>
    </section>
  );
}
