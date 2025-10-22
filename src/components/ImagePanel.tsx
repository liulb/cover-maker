import { Image as ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

const ImagePanel = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setPendingImageUrl } = useCanvasStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPendingImageUrl(url); // 设置待放置图片：用户需到画布点击以放置
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPendingImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ImageIcon size={20} />
        图片管理（选择后到画布点击放置）
      </h3>

      <div className="mb-4">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleSelectImage} />
      </div>

      {previewUrl && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">预览（实际大小以上限缩放后放置）：</div>
          <img src={previewUrl} alt="预览" className="max-w-full h-auto border rounded" />
          <div className="mt-2">
            <button onClick={handleClear} className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">清除选择</button>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">提示：选择图片后，在中间画布上单击，即可在点击位置放置图片。</p>
    </div>
  );
};

export default ImagePanel;
