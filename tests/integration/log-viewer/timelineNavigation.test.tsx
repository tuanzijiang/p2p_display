import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { LogViewerPage } from '@/routes/LogViewerPage';
import { useLogViewerStore } from '@/store/logViewerStore';
import { makeFile, VALID_LOG_TEXT } from '@tests/fixtures/p2pLogSamples';

describe('timeline navigation', () => {
  beforeEach(() => {
    useLogViewerStore.getState().resetViewer();
  });

  it('keeps the timeline disabled before a file is loaded', () => {
    render(<LogViewerPage />);

    expect(screen.getByTestId('timeline-slider')).toBeDisabled();
  });

  it('moves the text panel anchor when a timeline point is selected', async () => {
    const user = userEvent.setup();
    render(<LogViewerPage />);

    await user.upload(
      screen.getByTestId('header-file-input'),
      makeFile(VALID_LOG_TEXT, 'timeline.log', 'text/plain', '/Users/demo/timeline.log'),
    );

    const slider = await screen.findByTestId('timeline-slider');
    fireEvent.change(slider, {
      target: { value: String(new Date('2026-03-26 14:30:10.100+08:00').getTime()) },
    });

    await waitFor(() => {
      expect(screen.getByTestId('text-log-panel')).toHaveAttribute('data-anchor-index', '1');
    });

    expect(screen.getByText('[P2P]PeerConnected')).toBeInTheDocument();
  });
});
