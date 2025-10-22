import { Palette } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';

const CanvasPanel = () => {
  const { backgroundColor, setBackgroundColor, canvasWidth, canvasHeight, setCanvasSize, newCanvas, resetCanvas, previewMode, setPreviewMode } = useCanvasStore();

  const presets = [
    { name: '1920×1080 (16:9)', width: 1920, height: 1080 },
    { name: '960×1280 (3:4)', width: 960, height: 1280 },
    { name: '1080×1080 (1:1)', width: 1080, height: 1080 },
    { name: '720×720 (1:1)', width: 720, height: 720 },
    { name: '1280×720 (16:9)', width: 1280, height: 720 },
    { name: '768×1024 (4:3)', width: 768, height: 1024 },
  ];

  // 保留当前背景色条的基础样式，但替换为更丰富的渐变与多色示例
  const gradientPresets = [
    { name: '三色渐变', style: 'linear-gradient(135deg, rgb(239,68,68) 0%, rgb(234,179,8) 50%, rgb(59,130,246) 100%)', stops: ['#ef4444 0%', '#eab308 50%', '#3b82f6 100%'] },
    { name: '薄荷粉', style: 'linear-gradient(135deg, rgb(168, 237, 234) 0%, rgb(254, 214, 227) 100%)', stops: ['#a8edea 0%', '#fed6e3 100%'] },
    { name: '珊瑚粉', style: 'linear-gradient(135deg, rgb(255, 154, 158) 0%, rgb(254, 207, 239) 100%)', stops: ['#ff9a9e 0%', '#fecfeF 100%'] },
    { name: '暖阳橘', style: 'linear-gradient(135deg, rgb(255, 236, 210) 0%, rgb(252, 182, 159) 100%)', stops: ['#ffecd2 0%', '#fcb69f 100%'] },
    { name: '樱花蓝', style: 'linear-gradient(135deg, rgb(251, 194, 235) 0%, rgb(166, 193, 238) 100%)', stops: ['#fbc2eb 0%', '#a6c1ee 100%'] },
    { name: '淡紫雾', style: 'linear-gradient(135deg, rgb(253, 203, 241) 0%, rgb(230, 222, 233) 100%)', stops: ['#fdcbf1 0%', '#e6dee9 100%'] },
    { name: '金黄', style: 'linear-gradient(135deg, rgb(255, 234, 167) 0%, rgb(253, 203, 110) 100%)', stops: ['#ffeaa7 0%', '#fdcb6e 100%'] },
    { name: '莓果', style: 'linear-gradient(135deg, rgb(162, 155, 254) 0%, rgb(108, 92, 231) 100%)', stops: ['#a29bfe 0%', '#6c5ce7 100%'] },
    { name: '朝霞', style: 'linear-gradient(135deg, rgb(253, 121, 168) 0%, rgb(253, 203, 110) 100%)', stops: ['#fd79a8 0%', '#fdcb6e 100%'] },
    { name: '蔚蓝', style: 'linear-gradient(135deg, rgb(116, 185, 255) 0%, rgb(9, 132, 227) 100%)', stops: ['#74b9ff 0%', '#0984e3 100%'] },
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Palette size={20} />
        画布设置
      </h3>

      {/* 画布尺寸与新建/重置 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">画布尺寸</h4>
        <div className="text-sm text-gray-600 mb-3">
          当前: {canvasWidth} × {canvasHeight}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setCanvasSize(preset.width, preset.height)}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                canvasWidth === preset.width && canvasHeight === preset.height
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => newCanvas(canvasWidth, canvasHeight)}
            className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
            title="新建画布（清空并重置为当前尺寸）"
          >
            新建画布
          </button>
          <button
            onClick={resetCanvas}
            className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
            title="重置当前画布（清空对象，保留尺寸与背景）"
          >
            重置画布
          </button>
        </div>
      </div>

      {/* 预览模式 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">预览模式</h4>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { key: 'contain', label: '完整边界' },
            { key: 'cover', label: '铺满裁切' },
            { key: 'fitWidth', label: '按宽度适配' },
            { key: 'fitHeight', label: '按高度适配' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setPreviewMode(m.key as any)}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                previewMode === m.key
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 背景颜色 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">背景颜色（支持纯色与渐变）</h4>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            placeholder="#f5f5f5"
          />
        </div>

        {/* 渐变背景（点击后应用为画布背景图像）*/}
        <div className="grid grid-cols-3 gap-2">
          {gradientPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => (window as any).applyGradientBackground?.(preset.stops)}
              className="h-16 rounded-md border-2 border-gray-300 hover:border-blue-500 transition-colors"
              style={{ background: preset.style }}
              title={preset.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CanvasPanel;