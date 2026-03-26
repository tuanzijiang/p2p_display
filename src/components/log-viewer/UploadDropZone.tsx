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
        <span />
      </div>
      <div className="upload-drop-zone__body">
        <p className="upload-drop-zone__title">{isLoading ? '正在读取日志文件' : '拖拽日志文件到此处'}</p>
        <p className="upload-drop-zone__hint">支持 .log、.txt 和无扩展名文件，解析逻辑与顶部上传一致。</p>
      </div>
    </section>
  );
}
