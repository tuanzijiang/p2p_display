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
        <p className="viewer-header__file-state" title={sourcePath ?? undefined}>
          <span className="viewer-header__file-label">当前日志文件：</span>
          <span className="viewer-header__file-path">{sourcePath ?? '未选择文件'}</span>
        </p>
      </div>

      <div className="viewer-header__actions">
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
      </div>
    </header>
  );
}
