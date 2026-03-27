import { useLayoutEffect, useRef } from 'react';

type TopologyPlaceholderProps = {
  scrollTop: number;
  onScrollTopChange: (scrollTop: number) => void;
};

export function TopologyPlaceholder({ scrollTop, onScrollTopChange }: TopologyPlaceholderProps) {
  const panelRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!panelRef.current) {
      return;
    }

    if (Math.abs(panelRef.current.scrollTop - scrollTop) <= 1) {
      return;
    }

    panelRef.current.scrollTop = scrollTop;
  }, [scrollTop]);

  return (
    <section
      ref={panelRef}
      className="topology-placeholder"
      data-testid="topology-panel"
      onScroll={(event) => onScrollTopChange(event.currentTarget.scrollTop)}
    >
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
