import { Type, Square, Image, Palette } from 'lucide-react';

interface LeftToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LeftToolbar = ({ activeTab, onTabChange }: LeftToolbarProps) => {
  const tools = [
    { id: 'text', icon: Type, label: '文字' },
    { id: 'shape', icon: Square, label: '图形' },
    { id: 'image', icon: Image, label: '图片' },
    { id: 'background', icon: Palette, label: '画布' },
  ];

  return (
    <div className="w-16 bg-gray-800 flex flex-col items-center py-4 gap-2">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            onClick={() => onTabChange(tool.id)}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-colors ${
              activeTab === tool.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            title={tool.label}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LeftToolbar;
