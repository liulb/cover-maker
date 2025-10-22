import { Undo, Redo, Type } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';
import FontSelector from './FontSelector';
import ColorPicker from './ColorPicker';
import ShapeSelector from './ShapeSelector';
import ShapeStyleEditor from './ShapeStyleEditor';
import { fabric } from 'fabric';

const Toolbar = () => {
  const { selectedObject, updateTextStyle, canvas, canUndo, canRedo, undo, redo, saveState } = useCanvasStore();

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextStyle('fontSize', parseInt(e.target.value));
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextStyle('opacity', parseFloat(e.target.value));
  };

  const handleAddText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox('新文字', {
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
    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">CoverMaker</h2>

      {/* 撤销/重做按钮 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            canUndo
              ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title="撤销 (Ctrl+Z)"
        >
          <Undo size={16} />
          撤销
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            canRedo
              ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title="重做 (Ctrl+Y)"
        >
          <Redo size={16} />
          重做
        </button>
      </div>

      {/* 添加文字按钮 */}
      <button
        onClick={handleAddText}
        className="w-full mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
      >
        <Type size={18} />
        添加文字
      </button>

      {/* 图形选择器 */}
      <ShapeSelector />

      {/* 文字样式编辑器 */}
      {selectedObject && selectedObject.type === 'textbox' && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">文字样式</h3>

          <FontSelector />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              字号: {(selectedObject as any).fontSize || 40}
            </label>
            <input
              type="range"
              min="12"
              max="200"
              value={(selectedObject as any).fontSize || 40}
              onChange={handleFontSizeChange}
              className="w-full"
            />
          </div>

          <ColorPicker />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              不透明度: {Math.round(((selectedObject as any).opacity || 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={(selectedObject as any).opacity || 1}
              onChange={handleOpacityChange}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* 图形样式编辑器 */}
      <ShapeStyleEditor />

      {!selectedObject && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">选择画布中的元素以编辑样式</p>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
