import { Download } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';

const ExportButton = () => {
  const { canvas, canvasWidth, canvasHeight } = useCanvasStore();

  const handleExport = () => {
    if (!canvas) return;

    // 生成文件名
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const fileName = `covermaker_${year}${month}${day}_${hours}${minutes}.png`;

    // 导出时忽略预览缩放/平移，按真实画布尺寸输出
    const vt = (canvas as any).viewportTransform ? [...(canvas as any).viewportTransform] : [1, 0, 0, 1, 0, 0];
    (canvas as any).setViewportTransform([1, 0, 0, 1, 0, 0]);

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
      width: canvasWidth,
      height: canvasHeight,
    });

    // 恢复视图变换
    (canvas as any).setViewportTransform(vt);

    // 触发下载
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
    >
      <Download size={20} />
      导出 PNG
    </button>
  );
};

export default ExportButton;