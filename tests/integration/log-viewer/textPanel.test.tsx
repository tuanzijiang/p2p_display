import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { LogViewerPage } from '@/routes/LogViewerPage';
import { useLogViewerStore } from '@/store/logViewerStore';
import { makeFile, VALID_LOG_TEXT, VALID_LOG_LINES } from '@tests/fixtures/p2pLogSamples';

describe('text panel states', () => {
  beforeEach(() => {
    useLogViewerStore.getState().resetViewer();
  });

  it('shows the unloaded empty state before any file is uploaded', () => {
    render(<LogViewerPage />);

    expect(screen.getByText('上传本地日志后即可开始分析')).toBeInTheDocument();
  });

  it('supports panel switching and row expansion', async () => {
    const user = userEvent.setup();
    render(<LogViewerPage />);

    await user.upload(
      screen.getByTestId('header-file-input'),
      makeFile(VALID_LOG_TEXT, 'panel.log', 'text/plain', '/Users/demo/panel.log'),
    );

    await user.click(await screen.findByRole('tab', { name: '拓扑面板' }));
    expect(screen.getByText('拓扑分析能力尚未开放')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: '文本面板' }));
    await user.click(screen.getByText('[P2P]StartMatch'));

    expect(screen.getByText(VALID_LOG_LINES[0])).toBeInTheDocument();
  });
});
