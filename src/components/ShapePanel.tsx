import { Square } from 'lucide-react';
import ShapeSelector from './ShapeSelector';

const ShapePanel = () => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Square size={20} />
        添加图形
      </h3>

      <ShapeSelector />

      <p className="mt-4 text-sm text-gray-500">
        选择图形后可在右侧属性面板编辑样式
      </p>
    </div>
  );
};

export default ShapePanel;
