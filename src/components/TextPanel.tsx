import { Type } from 'lucide-react';
import { fabric } from 'fabric';
import { useCanvasStore } from '../store/useCanvasStore';

const TextPanel = () => {
  const { canvas, saveState } = useCanvasStore();

  const handleAddText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox('双击编辑文字', {
      left: 100,
      top: 100,
      fontSize: 40,
      fill: '#000000',
      fontFamily: 'PingFang SC, Inter, sans-serif',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveState();
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Type size={20} />
        添加文字
      </h3>

      <button
        onClick={handleAddText}
        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        添加文本框
      </button>

      <p className="mt-4 text-sm text-gray-500">
        点击添加文本框后,在画布上双击可编辑文字内容
      </p>
    </div>
  );
};

export default TextPanel;
