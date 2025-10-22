import { fabric } from 'fabric';

// 创建矩形
export const createRect = (canvas: any, left: number = 100, top: number = 100) => {
  const rect = new fabric.Rect({
    left,
    top,
    width: 200,
    height: 150,
    fill: 'transparent',
    stroke: '#000000',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  return rect;
};

// 创建圆形
export const createCircle = (canvas: any, left: number = 100, top: number = 100) => {
  const circle = new fabric.Circle({
    left,
    top,
    radius: 80,
    fill: 'transparent',
    stroke: '#000000',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  return circle;
};

// 创建三角形
export const createTriangle = (canvas: any, left: number = 100, top: number = 100) => {
  const triangle = new fabric.Triangle({
    left,
    top,
    width: 150,
    height: 150,
    fill: 'transparent',
    stroke: '#000000',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
  });
  canvas.add(triangle);
  canvas.setActiveObject(triangle);
  return triangle;
};

// 创建线条
export const createLine = (canvas: any, left: number = 100, top: number = 100) => {
  // 构造一条以 (left, top) 为中心的水平线
  const half = 100;
  const line = new fabric.Line([left - half, top, left + half, top], {
    stroke: '#000000',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
  });
  canvas.add(line);
  canvas.setActiveObject(line);
  return line;
};

// 创建箭头（单一 Path：stroke/strokeWidth 控制整体）
export const createArrow = (canvas: any, left: number = 100, top: number = 100) => {
  const total = 200;
  const head = 18; // 箭头尺寸
  const x1 = left - total / 2, y1 = top;
  const x2 = left + total / 2, y2 = top;
  const pathData = `M ${x1} ${y1} L ${x2} ${y2} M ${x2} ${y2} L ${x2 - head} ${y2 - head / 2} M ${x2} ${y2} L ${x2 - head} ${y2 + head / 2}`;
  const arrow = new fabric.Path(pathData, {
    left,
    top,
    stroke: '#000000',
    strokeWidth: 2,
    fill: 'transparent',
    originX: 'center',
    originY: 'center',
  });
  (arrow as any).name = 'arrow';
  canvas.add(arrow);
  canvas.setActiveObject(arrow);
  return arrow;
};

// 创建星形
export const createStar = (canvas: any, left: number = 150, top: number = 150) => {
  const points = [];
  const spikes = 5;
  const outerRadius = 80;
  const innerRadius = 40;

  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / spikes) * i;
    points.push({
      x: radius * Math.sin(angle),
      y: -radius * Math.cos(angle),
    });
  }

  const star = new fabric.Polygon(points, {
    left,
    top,
    fill: 'transparent',
    stroke: '#000000',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
  });

  canvas.add(star);
  canvas.setActiveObject(star);
  return star;
};

// 创建爱心
export const createHeart = (canvas: any, left: number = 150, top: number = 150) => {
  const heartPath = 'M 0,-30 C -20,-50 -50,-50 -50,-30 C -50,-10 -30,10 0,30 C 30,10 50,-10 50,-30 C 50,-50 20,-50 0,-30 Z';

  const heart = new fabric.Path(heartPath, {
    left,
    top,
    fill: 'transparent',
    stroke: '#000000',
    strokeWidth: 2,
    scaleX: 2,
    scaleY: 2,
    originX: 'center',
    originY: 'center',
  });

  canvas.add(heart);
  canvas.setActiveObject(heart);
  return heart;
};

// 创建六边形
export const createHexagon = (canvas: any, left: number = 150, top: number = 150) => {
  const points = [];
  const sides = 6;
  const radius = 80;

  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI / 3) * i;
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }

  const hexagon = new fabric.Polygon(points, {
    left,
    top,
    fill: 'transparent',
    stroke: '#000000',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
  });

  canvas.add(hexagon);
  canvas.setActiveObject(hexagon);
  return hexagon;
};
