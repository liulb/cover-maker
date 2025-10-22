import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useCanvasStore } from '../store/useCanvasStore';
import { createStar, createHeart, createHexagon } from '../utils/shapes';

const CanvasEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, setSelectedObject, backgroundColor, canvasWidth, canvasHeight, previewMode, saveState, deleteSelected, undo, redo } = useCanvasStore();
  // 将 applyGradientBackground 方法暴露到 window，供面板调用
  (window as any).applyGradientBackground = (stops: string[]) => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvasInst = (useCanvasStore.getState().canvas as any);
    if (!canvasInst) return;
    const width = canvasInst.getWidth();
    const height = canvasInst.getHeight();

    // 使用离屏画布生成渐变图片
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const ctx = off.getContext('2d');
    if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    stops.forEach((stop) => {
      const parts = stop.trim().split(' ');
      const color = parts[0];
      const posStr = parts[1] || '0%';
      const pos = parseFloat(posStr) / 100;
      grad.addColorStop(isNaN(pos) ? 0 : pos, color);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const dataUrl = off.toDataURL('image/png');
    fabric.Image.fromURL(dataUrl, (img: any) => {
      img.set({ left: 0, top: 0, originX: 'left', originY: 'top', selectable: false });
      img.scale(1);
      canvasInst.setBackgroundImage(img, canvasInst.renderAll.bind(canvasInst));
      useCanvasStore.getState().saveState();
    });
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // 初始化画布
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: backgroundColor,
    });
    // 当画布尺寸或背景变更时同步更新
    canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
    canvas.backgroundColor = backgroundColor;

    // 按容器宽高比缩放，避免滚动条，居中预览
    const container = canvasRef.current.parentElement as HTMLElement | null;
    const applyFitScale = () => {
      if (!container) return;
      const rectWidth = container.clientWidth;
      const rectHeight = container.clientHeight;
      const targetWidth = canvas.getWidth();
      const targetHeight = canvas.getHeight();

      let scale = 1, cssWidth = rectWidth, cssHeight = rectHeight, tx = 0, ty = 0;
      switch (useCanvasStore.getState().previewMode) {
        case 'contain': {
          scale = Math.min(rectWidth / targetWidth, rectHeight / targetHeight);
          cssWidth = Math.floor(targetWidth * scale);
          cssHeight = Math.floor(targetHeight * scale);
          tx = Math.floor((rectWidth - cssWidth) / 2);
          ty = Math.floor((rectHeight - cssHeight) / 2);
          break;
        }
        case 'cover': {
          scale = Math.max(rectWidth / targetWidth, rectHeight / targetHeight);
          cssWidth = rectWidth;
          cssHeight = rectHeight;
          tx = Math.floor((rectWidth - targetWidth * scale) / 2);
          ty = Math.floor((rectHeight - targetHeight * scale) / 2);
          break;
        }
        case 'fitWidth': {
          scale = rectWidth / targetWidth;
          cssWidth = rectWidth;
          cssHeight = Math.floor(targetHeight * scale);
          tx = 0;
          ty = 0;
          break;
        }
        case 'fitHeight': {
          scale = rectHeight / targetHeight;
          cssWidth = Math.floor(targetWidth * scale);
          cssHeight = rectHeight;
          tx = 0;
          ty = 0;
          break;
        }
      }
      try {
        (canvas as any).setDimensions({ width: cssWidth, height: cssHeight }, { cssOnly: true });
      } catch {}
      canvas.viewportTransform = [scale, 0, 0, scale, tx, ty];
      canvas.requestRenderAll();
    };
    applyFitScale();
    const ro = new ResizeObserver(applyFitScale);
    if (container) ro.observe(container);
    const onWinResize = () => applyFitScale();
    window.addEventListener('resize', onWinResize);

    // 监听选中事件
    canvas.on('selection:created', (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // 监听对象修改事件，自动保存
    canvas.on('object:modified', () => {
      saveState();
    });

    // 拖拽绘制：按下开始，移动过程中预览，松开完成
    const drawingRef: any = { mode: null, startX: 0, startY: 0, temp: null };

    canvas.on('mouse:down', (e: any) => {
      const pointer = canvas.getPointer(e.e);
      const pendingShape = useCanvasStore.getState().pendingShapeType;
      const pendingUrl = useCanvasStore.getState().pendingImageUrl;

      if (pendingShape) {
        drawingRef.mode = pendingShape;
        drawingRef.startX = pointer.x;
        drawingRef.startY = pointer.y;
        // 创建临时对象
        switch (pendingShape) {
          case 'rect': {
            const temp = new fabric.Rect({ left: pointer.x, top: pointer.y, width: 0, height: 0, fill: 'transparent', stroke: '#000000', strokeWidth: 2, originX: 'left', originY: 'top' });
            drawingRef.temp = temp; canvas.add(temp); break;
          }
          case 'circle': {
            const temp = new fabric.Ellipse({ left: pointer.x, top: pointer.y, rx: 0, ry: 0, fill: 'transparent', stroke: '#000000', strokeWidth: 2, originX: 'left', originY: 'top' });
            drawingRef.temp = temp; canvas.add(temp); break;
          }
          case 'triangle': {
            const temp = new fabric.Triangle({ left: pointer.x, top: pointer.y, width: 0, height: 0, fill: 'transparent', stroke: '#000000', strokeWidth: 2, originX: 'left', originY: 'top' });
            drawingRef.temp = temp; canvas.add(temp); break;
          }
          case 'line': {
            const temp = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], { stroke: '#000000', strokeWidth: 2 });
            drawingRef.temp = temp; canvas.add(temp); break;
          }
          case 'arrow': {
            // 拖拽过程中用线预览，松开后生成箭头 Path
            const temp = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], { stroke: '#000000', strokeWidth: 2 });
            drawingRef.temp = temp; canvas.add(temp); break;
          }
          default: {
            // 其它复杂图形：点击放置在起点
            if (pendingShape === 'star') {
              createStar(canvas, pointer.x, pointer.y);
              useCanvasStore.getState().setPendingShapeType(null);
            } else if (pendingShape === 'heart') {
              createHeart(canvas, pointer.x, pointer.y);
              useCanvasStore.getState().setPendingShapeType(null);
            } else if (pendingShape === 'hexagon') {
              createHexagon(canvas, pointer.x, pointer.y);
              useCanvasStore.getState().setPendingShapeType(null);
            }
            break;
          }
        }
        return;
      }

      // 图片放置（非绘制模式）
      if (pendingUrl) {
        fabric.Image.fromURL(pendingUrl, (img: any) => {
          // 将图片按画布尺寸进行等比“铺满”缩放（cover），导出时不会留白
          const cw = canvas.getWidth();
          const ch = canvas.getHeight();
          const scaleX = cw / (img.width || 1);
          const scaleY = ch / (img.height || 1);
          const scale = Math.max(scaleX, scaleY); // cover：至少覆盖一个维度，另一维溢出

          // 铺满时居中放置，保证四周均匀裁切/溢出；若需以点击点为中心可改为 pointer.x/pointer.y
          img.set({ left: cw / 2, top: ch / 2, originX: 'center', originY: 'center' });
          img.scale(scale);
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.requestRenderAll();
          saveState();
          useCanvasStore.getState().setPendingImageUrl(null);
        });
      }
    });

    canvas.on('mouse:move', (e: any) => {
      if (!drawingRef.mode || !drawingRef.temp) return;
      const pointer = canvas.getPointer(e.e);
      const sx = drawingRef.startX, sy = drawingRef.startY;
      const tx = pointer.x, ty = pointer.y;
      const minX = Math.min(sx, tx), minY = Math.min(sy, ty);
      const w = Math.abs(tx - sx), h = Math.abs(ty - sy);
      switch (drawingRef.mode) {
        case 'rect': {
          drawingRef.temp.set({ left: minX, top: minY, width: w, height: h });
          break;
        }
        case 'circle': {
          drawingRef.temp.set({ left: minX, top: minY, rx: w / 2, ry: h / 2 });
          break;
        }
        case 'triangle': {
          drawingRef.temp.set({ left: minX, top: minY, width: w, height: h });
          break;
        }
        case 'line': {
          drawingRef.temp.set({ x1: sx, y1: sy, x2: tx, y2: ty });
          break;
        }
        case 'arrow': {
          drawingRef.temp.set({ x1: sx, y1: sy, x2: tx, y2: ty });
          break;
        }
      }
      canvas.requestRenderAll();
    });

    canvas.on('mouse:up', (e: any) => {
      if (!drawingRef.mode) return;
      const pointer = canvas.getPointer(e.e);
      const sx = drawingRef.startX, sy = drawingRef.startY;
      const tx = pointer.x, ty = pointer.y;
      const mode = drawingRef.mode;

      // 完成箭头：用 Path 替换临时线
      if (mode === 'arrow') {
        const head = 18;
        const angle = Math.atan2(ty - sy, tx - sx);
        const ux = Math.cos(angle), uy = Math.sin(angle);
        const hx = tx - head * ux, hy = ty - head * uy;
        const nx = -uy, ny = ux; // 垂直向量用于箭头两翼
        const wing = head / 2;
        const pathData = `M ${sx} ${sy} L ${tx} ${ty} M ${tx} ${ty} L ${hx + wing * nx} ${hy + wing * ny} M ${tx} ${ty} L ${hx - wing * nx} ${hy - wing * ny}`;
        const arrow = new fabric.Path(pathData, { stroke: '#000000', strokeWidth: 2, fill: 'transparent' });
        canvas.add(arrow);
        canvas.remove(drawingRef.temp);
        canvas.setActiveObject(arrow);
      }

      // 完成后清理状态
      drawingRef.mode = null;
      drawingRef.startX = 0;
      drawingRef.startY = 0;
      drawingRef.temp = null;
      useCanvasStore.getState().setPendingShapeType(null);
      canvas.requestRenderAll();
      saveState();
    });

    canvas.on('object:added', () => {
      // 延迟保存，避免初始加载时触发
      setTimeout(() => saveState(), 100);
    });

    canvas.on('object:removed', () => {
      saveState();
    });

    // 键盘事件
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete 键删除选中对象
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          deleteSelected();
        }
      }

      // 方向键微调位置（Shift 加速 10px）
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          const canvas = useCanvasStore.getState().canvas as any;
          const active = canvas?.getActiveObject?.();
          if (canvas && active) {
            if (active.type === 'line') {
              // 直线：移动两端点
              const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
              const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
              active.set({ x1: active.x1 + dx, y1: active.y1 + dy, x2: active.x2 + dx, y2: active.y2 + dy });
            } else {
              // 常规对象：left/top 移动
              const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
              const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
              active.set({ left: (active.left || 0) + dx, top: (active.top || 0) + dy });
            }
            active.setCoords?.();
            canvas.requestRenderAll();
            useCanvasStore.getState().saveState();
            // 同步选中对象到 store，便于右侧面板实时显示
            useCanvasStore.setState({ selectedObject: active });
          }
        }
      }

      // Ctrl+Z 撤销
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl+Shift+Z 或 Ctrl+Y 重做
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    setCanvas(canvas);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', onWinResize);
      ro.disconnect();
      canvas.dispose();
    };
  }, [canvasWidth, canvasHeight, backgroundColor, previewMode]);

  return (
    <div className="h-full overflow-auto">
      <div
        className="shadow-2xl bg-white"
        style={{
          overflow: 'visible',
          width: 'auto',
          height: 'auto',
          display: 'inline-block',
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
    </div>
  );
};

export default CanvasEditor;
