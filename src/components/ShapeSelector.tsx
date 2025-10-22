import { Square, Circle, Triangle, Minus, ArrowRight, Star, Heart, Hexagon } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';


const ShapeSelector = () => {
  const { setPendingShapeType } = useCanvasStore();

  const handleAddShape = (shapeType: string) => {
    // 不直接添加到画布，设置待放置类型，用户到画布点击放置
    setPendingShapeType(shapeType);
  };

  const shapes = [
    { type: 'rect', icon: Square, label: '矩形' },
    { type: 'circle', icon: Circle, label: '圆形' },
    { type: 'triangle', icon: Triangle, label: '三角形' },
    { type: 'line', icon: Minus, label: '线条' },
    { type: 'arrow', icon: ArrowRight, label: '箭头' },
    { type: 'star', icon: Star, label: '五角星' },
    { type: 'heart', icon: Heart, label: '爱心' },
    { type: 'hexagon', icon: Hexagon, label: '六边形' },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">添加图形</h3>
      <div className="grid grid-cols-2 gap-2">
        {shapes.map((shape) => {
          const Icon = shape.icon;
          return (
            <button
              key={shape.type}
              onClick={() => handleAddShape(shape.type)}
              className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs text-gray-600">{shape.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-500">提示：选择形状后，到画布上单击以放置。</p>
    </div>
  );
};

export default ShapeSelector;
