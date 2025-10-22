import { useState } from 'react';
import CanvasEditor from './components/CanvasEditor';
import LeftToolbar from './components/LeftToolbar';
import RightPanel from './components/RightPanel';
import TextPanel from './components/TextPanel';
import ShapePanel from './components/ShapePanel';
import ImagePanel from './components/ImagePanel';
import CanvasPanel from './components/CanvasPanel';
import ExportButton from './components/ExportButton';

function App() {
  const [activeTab, setActiveTab] = useState('text');

  const renderMiddlePanel = () => {
    switch (activeTab) {
      case 'text':
        return <TextPanel />;
      case 'shape':
        return <ShapePanel />;
      case 'image':
        return <ImagePanel />;
      case 'background':
        return <CanvasPanel />;
      default:
        return <TextPanel />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 左侧图标工具栏 */}
      <LeftToolbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 中间工具面板 */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {renderMiddlePanel()}
        </div>
        <div className="p-4 border-t border-gray-200">
          <ExportButton />
        </div>
      </div>

      {/* 中央画布区域（允许在 Flex 中正确收缩，避免把右侧挤出屏幕） */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 overflow-auto">
          {/* 让内容宽高可超出以触发滚动条 */}
          <div className="min-w-full min-h-full">
            <CanvasEditor />
          </div>
        </main>
      </div>

      {/* 右侧属性面板 */}
      <RightPanel />
    </div>
  );
}

export default App;

