import { useCanvasStore } from '../store/useCanvasStore';

const ShapeStyleEditor = () => {
  const { selectedObject, updateShapeStyle } = useCanvasStore();

  if (!selectedObject || selectedObject.type === 'textbox') {
    return null;
  }

  const obj: any = selectedObject as any;
  const isLine = obj.type === 'line';
  const isArrowGroup = obj.type === 'group' && Array.isArray(obj._objects) && obj._objects.some((o: any) => o.type === 'line');
  const isArrowPath = obj.type === 'path' && obj.name === 'arrow';

  const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateShapeStyle('fill', e.target.value);
  };
  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateShapeStyle('stroke', e.target.value);
  };
  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateShapeStyle('strokeWidth', parseInt(e.target.value));
  };

  // 当前值读取：针对箭头组从子线条取描边
  const currentLine = isArrowGroup ? obj._objects.find((o: any) => o.type === 'line') : null;
  const currentFill = isLine || isArrowGroup ? undefined : (obj.fill || 'transparent');
  const currentStroke = (isArrowGroup && currentLine ? currentLine.stroke : obj.stroke) || '#000000';
  const currentStrokeWidth = (isArrowGroup && currentLine ? currentLine.strokeWidth : obj.strokeWidth) || 2;

  return (
    <div>
      {/* 直线/箭头：只展示描边颜色与粗细 */}
      {(isLine || isArrowGroup || isArrowPath) ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">描边颜色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentStroke}
                onChange={handleStrokeChange}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={currentStroke}
                onChange={(e) => updateShapeStyle('stroke', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描边粗细: {currentStrokeWidth}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={currentStrokeWidth}
              onChange={handleStrokeWidthChange}
              className="w-full"
            />
          </div>
        </>
      ) : (
        <>
          {/* 其它图形：填充颜色与边框颜色 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">填充颜色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentFill === 'transparent' ? '#ffffff' : currentFill}
                onChange={handleFillChange}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={currentFill || ''}
                onChange={(e) => updateShapeStyle('fill', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                placeholder="transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">边框颜色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentStroke}
                onChange={handleStrokeChange}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={currentStroke}
                onChange={(e) => updateShapeStyle('stroke', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              边框宽度: {currentStrokeWidth}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={currentStrokeWidth}
              onChange={handleStrokeWidthChange}
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ShapeStyleEditor;
