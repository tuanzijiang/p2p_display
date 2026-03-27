import { create } from 'zustand';
import { parseLogFile } from '@/features/log-parser/parseLogFile';
import type { ParseStageTiming, ParsedLogRecord } from '@/features/log-parser/types';
import type { ActivePanel, ViewerState } from '@/features/log-viewer/types';
import { findAnchorRecord } from '@/features/log-viewer/findAnchorRecord';
import { clampTimelineValue } from '@/features/log-viewer/timeRange';

type LogViewerActions = {
  resetViewer: () => void;
  loadFile: (file: File) => Promise<void>;
  setActivePanel: (panel: ActivePanel) => void;
  setSelectedTimestamp: (timestampMs: number) => void;
  toggleRecordExpanded: (recordId: string) => void;
};

type LogViewerStore = ViewerState & LogViewerActions;
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

const INITIAL_STATE: ViewerState = {
  sourcePath: null,
  fileName: null,
  fileSizeBytes: 0,
  loadStatus: 'idle',
  records: [],
  parseSummary: null,
  timelineRange: null,
  selectedTimestampMs: null,
  anchorRecordIndex: 0,
  activePanel: 'text',
};

async function readFileContent(file: File) {
  if (typeof file.text === 'function') {
    return file.text();
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function resolveFilePath(file: File) {
  const runtimeFile = file as File & {
    path?: string;
    webkitRelativePath?: string;
  };

  return runtimeFile.path || runtimeFile.webkitRelativePath || file.name;
}

function collapseOtherRows(records: ParsedLogRecord[], recordId: string) {
  return records.map((record) => ({
    ...record,
    isExpanded: record.id === recordId ? !record.isExpanded : false,
  }));
}

function withReadStage(stageTimings: ParseStageTiming[], durationMs: number) {
  const readStage = {
    key: 'read-file',
    label: '读取文件内容',
    durationMs: Math.round(durationMs * 1000) / 1000,
  };

  return [readStage, ...stageTimings];
}

export const useLogViewerStore = create<LogViewerStore>((set, get) => ({
  ...INITIAL_STATE,
  resetViewer: () => set(INITIAL_STATE),
  async loadFile(file) {
    set({
      ...INITIAL_STATE,
      loadStatus: 'loading',
      fileName: file.name,
      fileSizeBytes: file.size,
    });

    try {
      const readStartedAt = now();
      const content = await readFileContent(file);
      const readDurationMs = now() - readStartedAt;
      const result = parseLogFile(content);
      const stageTimings = withReadStage(result.parseSummary.stageTimings, readDurationMs);
      const parseSummary = {
        ...result.parseSummary,
        stageTimings,
        totalDurationMs: Math.round(stageTimings.reduce((total, stage) => total + stage.durationMs, 0) * 1000) / 1000,
      };

      if (!result.timelineRange || result.records.length === 0) {
        set({
          ...INITIAL_STATE,
          loadStatus: 'error',
          parseSummary,
        });
        return;
      }

      set({
        sourcePath: resolveFilePath(file),
        fileName: file.name,
        fileSizeBytes: file.size,
        loadStatus: 'ready',
        records: result.records,
        parseSummary,
        timelineRange: result.timelineRange,
        selectedTimestampMs: result.timelineRange.startMs,
        anchorRecordIndex: 0,
        activePanel: 'text',
      });
    } catch {
      set({
        ...INITIAL_STATE,
        loadStatus: 'error',
        parseSummary: {
          totalLines: 0,
          validRecordCount: 0,
          invalidLineCount: 0,
          status: 'failed',
          message: '文件读取失败，请重试。',
          stageTimings: [],
          totalDurationMs: 0,
        },
      });
    }
  },
  setActivePanel(panel) {
    set({ activePanel: panel });
  },
  setSelectedTimestamp(timestampMs) {
    const { timelineRange, records } = get();

    if (!timelineRange) {
      return;
    }

    const nextTimestamp = clampTimelineValue(timestampMs, timelineRange);
    const anchorRecordIndex = findAnchorRecord(records, nextTimestamp);

    set({
      selectedTimestampMs: nextTimestamp,
      anchorRecordIndex,
    });
  },
  toggleRecordExpanded(recordId) {
    set((state) => ({
      records: collapseOtherRows(state.records, recordId),
    }));
  },
}));
