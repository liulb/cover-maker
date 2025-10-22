import { useState, useEffect } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

const ColorPicker = () => {
  const { selectedObject, updateTextStyle } = useCanvasStore();
  // 选中文本对象颜色变化应立即生效，无需刷新
  const currentColor = (selectedObject as any)?.fill || '#000000';
  const [color, setColor] = useState(currentColor);

  // 同步当前选中对象的颜色
  useEffect(() => {
    setColor(currentColor);
  }, [currentColor]);

  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#008000', '#000080',
  ];

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    updateTextStyle('fill', newColor);
  };

  if (!selectedObject || selectedObject.type !== 'textbox') {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">文字颜色</label>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="color"
          value={color}
          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
          onChange={(e) => handleColorChange(e.target.value)}
        />
        <input
          type="text"
          value={color}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
          onChange={(e) => handleColorChange(e.target.value)}
          placeholder="#000000"
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            onClick={() => handleColorChange(presetColor)}
            className={`w-full h-8 rounded border-2 ${
              color === presetColor ? 'border-gray-800' : 'border-gray-300'
            }`}
            style={{ backgroundColor: presetColor }}
            title={presetColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
