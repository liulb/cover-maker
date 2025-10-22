import { Undo, Redo } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';
import FontSelector from './FontSelector';
import ColorPicker from './ColorPicker';
import ShapeStyleEditor from './ShapeStyleEditor';

const RightPanel = () => {
  const { selectedObject, updateTextStyle, canUndo, canRedo, undo, redo } = useCanvasStore();

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextStyle('fontSize', parseInt(e.target.value));
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextStyle('opacity', parseFloat(e.target.value));
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">属性设置</h2>

        {/* 撤销/重做 */}
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
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
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
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
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedObject && selectedObject.type === 'textbox' && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">文字设置</h3>

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

        {selectedObject && selectedObject.type !== 'textbox' && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">图形设置</h3>
            <ShapeStyleEditor />
          </div>
        )}

        {!selectedObject && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">选择画布中的元素</p>
            <p className="text-sm">查看和编辑属性</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
