import { useCanvasStore } from '../store/useCanvasStore';
import { ensureFontLoaded } from '../utils/fontLoader';

const FontSelector = () => {
  const { selectedObject, updateTextStyle } = useCanvasStore();

  const fonts = [
    'LXGW WenKai',
    'Huiwen-mincho',
    'Douyin Sans',
    'Noto Sans SC',
    'Noto Serif SC',
    'ZCOOL KuaiLe',
    'Maple Mono CN Medium',
    'hongleixingshu',
    // 备用常见字体
    'PingFang SC',
    'Inter',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
  ];

  const handleFontChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    await ensureFontLoaded(font);
    updateTextStyle('fontFamily', font);
  };

  if (!selectedObject || selectedObject.type !== 'textbox') {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">字体</label>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        onChange={handleFontChange}
        defaultValue="PingFang SC"
      >
        {fonts.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector;
