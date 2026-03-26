import { useId, useRef } from 'react';
import type { ChangeEvent } from 'react';

type HeaderBarProps = {
  sourcePath: string | null;
  isLoading: boolean;
  onFileSelected: (file: File) => void | Promise<void>;
};

export function HeaderBar({ sourcePath, isLoading, onFileSelected }: HeaderBarProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      await onFileSelected(file);
    }

    event.target.value = '';
  }

  return (
    <header className="viewer-header">
      <div className="viewer-header__title">
        <p className="viewer-header__eyebrow">P2P Local Viewer</p>
        <h1>本地 P2P 日志查看器</h1>
      </div>

      <div className="viewer-header__path">
        {sourcePath ? (
          <p className="viewer-header__path-value" title={sourcePath}>
            {sourcePath}
          </p>
        ) : (
          <>
            <input
              id={inputId}
              ref={inputRef}
              className="sr-only"
              data-testid="header-file-input"
              type="file"
              onChange={handleChange}
            />
            <button className="viewer-header__upload" type="button" onClick={openPicker} disabled={isLoading}>
              {isLoading ? '解析中...' : '上传日志文件'}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
