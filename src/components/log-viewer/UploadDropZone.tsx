import { useState } from 'react';

type UploadDropZoneProps = {
  isLoading: boolean;
  onFileSelected: (file: File) => void | Promise<void>;
};

export function UploadDropZone({ isLoading, onFileSelected }: UploadDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      await onFileSelected(file);
    }
  }

  return (
    <section
      className={`upload-drop-zone ${isDragActive ? 'is-drag-active' : ''}`}
      data-testid="upload-drop-zone"
      onDragEnter={() => setIsDragActive(true)}
      onDragLeave={() => setIsDragActive(false)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="upload-drop-zone__icon" aria-hidden="true">
        <span>⇪</span>
      </div>
      <div className="upload-drop-zone__body">
        <p className="upload-drop-zone__title">{isLoading ? '正在读取日志文件' : '上传日志文件'}</p>
        <p className="upload-drop-zone__hint">支持拖拽导入，解析逻辑与顶部上传一致。</p>
      </div>
    </section>
  );
}
