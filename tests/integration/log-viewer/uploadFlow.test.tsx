import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LogViewerPage } from '@/routes/LogViewerPage';
import { useLogViewerStore } from '@/store/logViewerStore';
import { makeFile, VALID_LOG_TEXT } from '@tests/fixtures/p2pLogSamples';

describe('upload flow', () => {
  beforeEach(() => {
    useLogViewerStore.getState().resetViewer();
  });

  afterEach(() => {
    useLogViewerStore.getState().resetViewer();
  });

  it('loads a log through the header upload control', async () => {
    const user = userEvent.setup();
    render(<LogViewerPage />);

    const input = screen.getByTestId('header-file-input');
    const file = makeFile(VALID_LOG_TEXT, 'header.log', 'text/plain', '/Users/demo/header.log');

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('/Users/demo/header.log')).toBeInTheDocument();
    });

    expect(screen.getAllByText('2026-03-26 14:29:54.055+08:00').length).toBeGreaterThan(0);
    expect(screen.getByText('[P2P]StartMatch')).toBeInTheDocument();
    expect(screen.getByText('总耗时')).toBeInTheDocument();
    expect(screen.getByText('读取文件内容')).toBeInTheDocument();
    expect(screen.getByText('切分日志行')).toBeInTheDocument();
    expect(screen.getByText('提取有效记录')).toBeInTheDocument();
    expect(screen.getByText('生成解析汇总')).toBeInTheDocument();
  });

  it('loads a log through the drag and drop entry point', async () => {
    render(<LogViewerPage />);

    const dropZone = screen.getByTestId('upload-drop-zone');
    const file = makeFile(VALID_LOG_TEXT, 'drop.log', 'text/plain', '/Users/demo/drop.log');

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText('/Users/demo/drop.log')).toBeInTheDocument();
    });
  });
});
