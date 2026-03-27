import { HeaderBar } from '@/components/log-viewer/HeaderBar';
import { EmptyState } from '@/components/log-viewer/EmptyState';
import { PanelTabs } from '@/components/log-viewer/PanelTabs';
import { ParseStatusBanner } from '@/components/log-viewer/ParseStatusBanner';
import { TextLogPanel } from '@/components/log-viewer/TextLogPanel';
import { TimelineSection } from '@/components/log-viewer/TimelineSection';
import { TopologyPlaceholder } from '@/components/log-viewer/TopologyPlaceholder';
import { UploadDropZone } from '@/components/log-viewer/UploadDropZone';
import { useLogViewerStore } from '@/store/logViewerStore';
import '@/features/log-viewer/logViewer.css';

export function LogViewerPage() {
  const sourcePath = useLogViewerStore((state) => state.sourcePath);
  const loadStatus = useLogViewerStore((state) => state.loadStatus);
  const parseSummary = useLogViewerStore((state) => state.parseSummary);
  const timelineRange = useLogViewerStore((state) => state.timelineRange);
  const selectedTimestampMs = useLogViewerStore((state) => state.selectedTimestampMs);
  const activePanel = useLogViewerStore((state) => state.activePanel);
  const panelScrollTops = useLogViewerStore((state) => state.panelScrollTops);
  const records = useLogViewerStore((state) => state.records);
  const anchorRecordIndex = useLogViewerStore((state) => state.anchorRecordIndex);
  const loadFile = useLogViewerStore((state) => state.loadFile);
  const setActivePanel = useLogViewerStore((state) => state.setActivePanel);
  const setPanelScrollTop = useLogViewerStore((state) => state.setPanelScrollTop);
  const setSelectedTimestamp = useLogViewerStore((state) => state.setSelectedTimestamp);
  const toggleRecordExpanded = useLogViewerStore((state) => state.toggleRecordExpanded);

  const timelineDisabled = loadStatus !== 'ready' || !timelineRange || selectedTimestampMs === null;

  return (
    <main className="log-viewer-page">
      <HeaderBar isLoading={loadStatus === 'loading'} sourcePath={sourcePath} onFileSelected={loadFile} />

      <ParseStatusBanner loadStatus={loadStatus} parseSummary={parseSummary} />

      <section className="viewer-top-grid">
        <TimelineSection
          disabled={timelineDisabled}
          endLabel={timelineRange?.endLabel ?? '结束时间'}
          rangeEndMs={timelineRange?.endMs ?? 1}
          rangeStartMs={timelineRange?.startMs ?? 0}
          selectedTimestampMs={selectedTimestampMs ?? 0}
          startLabel={timelineRange?.startLabel ?? '开始时间'}
          onChange={setSelectedTimestamp}
        />
        <UploadDropZone isLoading={loadStatus === 'loading'} onFileSelected={loadFile} />
      </section>

      <section className="viewer-content-shell">
        <PanelTabs activePanel={activePanel} onChange={setActivePanel} />

        {loadStatus === 'error' ? (
          <EmptyState message={parseSummary?.message} variant="error" />
        ) : loadStatus !== 'ready' ? (
          <EmptyState />
        ) : activePanel === 'topology' ? (
          <TopologyPlaceholder
            scrollTop={panelScrollTops.topology}
            onScrollTopChange={(scrollTop) => setPanelScrollTop('topology', scrollTop)}
          />
        ) : (
          <TextLogPanel
            anchorRecordIndex={anchorRecordIndex}
            records={records}
            scrollTop={panelScrollTops.text}
            onScrollTopChange={(scrollTop) => setPanelScrollTop('text', scrollTop)}
            onToggleRecord={toggleRecordExpanded}
          />
        )}
      </section>
    </main>
  );
}
