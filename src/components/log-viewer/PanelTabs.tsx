import type { ActivePanel } from '@/features/log-viewer/types';

type PanelTabsProps = {
  activePanel: ActivePanel;
  onChange: (panel: ActivePanel) => void;
};

export function PanelTabs({ activePanel, onChange }: PanelTabsProps) {
  return (
    <div className="panel-tabs" role="tablist" aria-label="日志内容视图">
      <button
        aria-selected={activePanel === 'text'}
        className={`panel-tabs__button ${activePanel === 'text' ? 'is-active' : ''}`}
        role="tab"
        type="button"
        onClick={() => onChange('text')}
      >
        文本面板
      </button>
      <button
        aria-selected={activePanel === 'topology'}
        className={`panel-tabs__button ${activePanel === 'topology' ? 'is-active' : ''}`}
        role="tab"
        type="button"
        onClick={() => onChange('topology')}
      >
        拓扑面板
      </button>
    </div>
  );
}
