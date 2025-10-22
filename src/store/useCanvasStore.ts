import { create } from 'zustand';

interface CanvasState {
  canvas: any | null;
  selectedObject: any | null;
  backgroundColor: string;
  canvasWidth: number;
  canvasHeight: number;
  history: string[];
  historyStep: number;
  canUndo: boolean;
  canRedo: boolean;
  // 预览模式：contain/cover/fitWidth/fitHeight
  previewMode: 'contain' | 'cover' | 'fitWidth' | 'fitHeight';
  // 待放置的图片 URL（用户选择后，点击画布放置）
  pendingImageUrl?: string | null;
  // 待放置的图形类型（用户选择后，点击画布放置）
  pendingShapeType?: string | null;
  setCanvas: (canvas: any) => void;
  setSelectedObject: (obj: any | null) => void;
  setBackgroundColor: (color: string) => void;
  setCanvasSize: (width: number, height: number) => void;
  // 新建画布（清空、设定尺寸并重置历史）
  newCanvas: (width: number, height: number) => void;
  // 重置当前画布（清空对象，保留尺寸与背景）
  resetCanvas: () => void;
  setPreviewMode: (mode: 'contain' | 'cover' | 'fitWidth' | 'fitHeight') => void;
  setPendingImageUrl: (url: string | null) => void;
  setPendingShapeType: (type: string | null) => void;
  updateTextStyle: (property: string, value: any) => void;
  updateShapeStyle: (property: string, value: any) => void;
  saveState: () => void;
  undo: () => void;
  redo: () => void;
  loadFromStorage: () => void;
  deleteSelected: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvas: null,
  selectedObject: null,
  backgroundColor: '#f5f5f5',
  canvasWidth: 1920,
  canvasHeight: 1080,
  history: [],
  historyStep: -1,
  canUndo: false,
  canRedo: false,
  previewMode: 'contain',
  pendingImageUrl: null,
  pendingShapeType: null,

  setCanvas: (canvas) => {
    set({ canvas });
    // 加载保存的数据
    get().loadFromStorage();
  },

  setSelectedObject: (obj) => set({ selectedObject: obj }),
  setPendingImageUrl: (url) => set({ pendingImageUrl: url }),
  setPendingShapeType: (type) => set({ pendingShapeType: type }),
  setPreviewMode: (mode) => set({ previewMode: mode }),

  setBackgroundColor: (color) => {
    const { canvas } = get();
    if (canvas) {
      canvas.backgroundColor = color;
      canvas.renderAll();
      get().saveState();
    }
    set({ backgroundColor: color });
  },

  setCanvasSize: (width, height) => {
    const { canvas } = get();
    if (canvas) {
      canvas.setDimensions({ width, height });
      canvas.renderAll();
      get().saveState();
    }
    set({ canvasWidth: width, canvasHeight: height });
  },

  // 新建画布：清空对象、设置尺寸与默认背景、重置历史
  newCanvas: (width: number, height: number) => {
    const { canvas } = get();
    const defaultBg = '#f5f5f5';
    if (canvas) {
      canvas.clear();
      canvas.setDimensions({ width, height });
      canvas.backgroundColor = defaultBg;
      canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
      canvas.renderAll();
    }
    set({
      canvasWidth: width,
      canvasHeight: height,
      backgroundColor: defaultBg,
      selectedObject: null,
      history: [],
      historyStep: -1,
      canUndo: false,
      canRedo: false,
      pendingImageUrl: null,
      pendingShapeType: null,
    });
    get().saveState();
  },

  // 重置当前画布：清空对象，保留当前尺寸，可选择保留背景色
  resetCanvas: () => {
    const { canvas, canvasWidth, canvasHeight, backgroundColor } = get();
    if (canvas) {
      canvas.clear();
      canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
      canvas.backgroundColor = backgroundColor || '#f5f5f5';
      canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
      canvas.renderAll();
    }
    set({
      selectedObject: null,
      history: [],
      historyStep: -1,
      canUndo: false,
      canRedo: false,
      pendingImageUrl: null,
      pendingShapeType: null,
    });
    get().saveState();
  },

  updateTextStyle: (property, value) => {
    const { canvas, selectedObject } = get();
    if (canvas && selectedObject && selectedObject.type === 'textbox') {
      // 使用 fabric 的 set 方法确保属性更新即时生效
      (selectedObject as any).set(property, value);
      // 更新坐标以避免包围盒滞后
      (selectedObject as any).setCoords();
      // 请求重绘（更可靠）
      canvas.requestRenderAll();
      get().saveState();
      set({ selectedObject });
    }
  },

  updateShapeStyle: (property, value) => {
    const { canvas, selectedObject } = get();
    if (canvas && selectedObject) {
      const obj: any = selectedObject as any;
      // 针对箭头（group，内含 line+triangle）和直线的专门处理
      if (obj.type === 'line' || (obj.type === 'path' && obj.name === 'arrow')) {
        if (property === 'stroke' || property === 'strokeWidth' || property === 'opacity') {
          obj.set(property, value);
        }
      } else if (obj.type === 'group' && Array.isArray(obj._objects)) {
        const line = obj._objects.find((o: any) => o.type === 'line');
        const triangle = obj._objects.find((o: any) => o.type === 'triangle');
        if (property === 'stroke' && line) {
          line.set('stroke', value);
          if (triangle) triangle.set('fill', value); // 箭头三角填充跟随描边颜色
        } else if (property === 'strokeWidth' && line) {
          line.set('strokeWidth', value);
        } else if (property === 'opacity') {
          // 组透明度整体应用
          obj.set('opacity', value);
        } else if (property === 'fill') {
          // 其它情况，统一填充多边形等
          obj._objects.forEach((child: any) => {
            if (child.set && child.type !== 'line') child.set('fill', value);
          });
        }
      } else {
        // 常规图形：填充颜色、边框颜色与宽度
        obj.set(property, value);
      }
      obj.setCoords?.();
      canvas.requestRenderAll();
      get().saveState();
      set({ selectedObject: obj });
    }
  },

  saveState: () => {
    const { canvas, history, historyStep } = get();
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON(['selectable']));
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(json);

    // 限制历史记录为50条
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    const newStep = newHistory.length - 1;
    set({
      history: newHistory,
      historyStep: newStep,
      canUndo: newStep > 0,
      canRedo: false,
    });

    // 保存到 localStorage
    localStorage.setItem('covermaker_canvas', json);
    localStorage.setItem('covermaker_bg', canvas.backgroundColor || '#f5f5f5');
  },

  undo: () => {
    const { canvas, history, historyStep } = get();
    if (!canvas || historyStep <= 0) return;

    const newStep = historyStep - 1;
    const json = history[newStep];

    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      set({
        historyStep: newStep,
        canUndo: newStep > 0,
        canRedo: true,
        backgroundColor: canvas.backgroundColor || '#f5f5f5',
      });
    });
  },

  redo: () => {
    const { canvas, history, historyStep } = get();
    if (!canvas || historyStep >= history.length - 1) return;

    const newStep = historyStep + 1;
    const json = history[newStep];

    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      set({
        historyStep: newStep,
        canUndo: true,
        canRedo: newStep < history.length - 1,
        backgroundColor: canvas.backgroundColor || '#f5f5f5',
      });
    });
  },

  loadFromStorage: () => {
    const { canvas } = get();
    if (!canvas) return;

    const savedCanvas = localStorage.getItem('covermaker_canvas');
    const savedBg = localStorage.getItem('covermaker_bg');

    if (savedCanvas) {
      canvas.loadFromJSON(savedCanvas, () => {
        if (savedBg) {
          canvas.backgroundColor = savedBg;
          set({ backgroundColor: savedBg });
        }
        canvas.renderAll();
        get().saveState();
      });
    } else {
      // 首次加载，保存初始状态
      get().saveState();
    }
  },

  deleteSelected: () => {
    const { canvas } = get();
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects && activeObjects.length > 0) {
      // 删除所有选中的对象
      activeObjects.forEach((obj: any) => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
      get().saveState();
      set({ selectedObject: null });
    }
  },
}));
