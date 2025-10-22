import { useRef } from 'react';
import { Palette, Image as ImageIcon } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';
import { fabric } from 'fabric';

const BackgroundPanel = () => {
  const { canvas, setBackgroundColor, backgroundColor } = useCanvasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;

      fabric.Image.fromURL(imgUrl, (img: any) => {
        const canvasWidth = canvas.width || 1960;
        const canvasHeight = canvas.height || 1280;

        // 缩放图片以填充画布
        const scaleX = canvasWidth / (img.width || 1);
        const scaleY = canvasHeight / (img.height || 1);
        const scale = Math.max(scaleX, scaleY);

        img.scale(scale);
        img.set({
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
        });

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    };

    reader.readAsDataURL(file);
  };

  const handleResetBackground = () => {
    if (!canvas) return;
    canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
    setBackgroundColor('#f5f5f5');
  };

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <h3 className="text-lg font-medium mb-4 text-gray-800">背景设置</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Palette size={16} />
          背景颜色
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={backgroundColor}
            onChange={handleColorChange}
            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="#f5f5f5"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <ImageIcon size={16} />
          背景图片
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          上传图片
        </button>
      </div>

      <button
        onClick={handleResetBackground}
        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        重置背景
      </button>
    </div>
  );
};

export default BackgroundPanel;
