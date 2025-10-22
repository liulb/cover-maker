# Cover Maker

一个轻量、开箱即用的封面/海报制作工具。基于 React + Vite + TypeScript + TailwindCSS + Fabric.js + Zustand。

## 功能
- 画布：自定义尺寸与背景（纯色/渐变）。
- 图形/图片/文本：添加、选择、缩放、旋转、删除。
- 预览模式：
  - 完整边界（contain）
  - 铺满裁切（cover）
  - 按宽度适配（纵向滚动）
  - 按高度适配（横向滚动）
- 导出：按真实画布尺寸导出 PNG（忽略预览缩放/平移）。
- 历史：撤销/重做。
- 键盘微调：方向键移动（Shift 加速）。
- 字体：支持远程与本地字体动态注册。

## 技术栈
- React 18, Vite 7, TypeScript 5
- TailwindCSS 3
- Fabric.js 5（画布与对象操作）
- Zustand（全局状态）

## 开发
```bash
# 使用 pnpm（推荐）
pnpm install
pnpm run dev

# 或使用 npm
yarn # 或 npm install
npm run dev
```
启动后访问：http://localhost:5173

## 构建与预览
```bash
pnpm run build
pnpm run preview # 本地预览构建产物
```

## 使用说明
- 画布尺寸与背景：左侧/右侧面板中设置；支持渐变预设。
- 预览模式：在“画布设置 > 预览模式”中切换，影响页面展示，不影响导出。
- 图片：选择后点击画布放置；默认按“cover”铺满居中（可自行调整策略）。
- 文本：在右侧样式面板中设置字体、字号、颜色等。
- 导出：点击“导出 PNG”，会临时清除 viewportTransform，以真实画布尺寸输出。

### 键盘操作
- Delete/Backspace：删除选中对象
- Ctrl/⌘ + Z：撤销
- Ctrl/⌘ + Shift + Z 或 Ctrl/⌘ + Y：重做
- 方向键：移动 1px
- Shift + 方向键：移动 10px

## 字体支持
项目支持两种方式加载字体：

1) 远程字体（CDN/URL）
- 在 `src/utils/fontLoader.ts` 中的 `registerCustomFont(fontFamily, srcUrl)` 可运行时注册：
```ts
import { registerCustomFont, ensureFontLoaded } from './utils/fontLoader';
registerCustomFont('Noto Serif SC', 'https://example.com/NotoSerifSC.woff2');
await ensureFontLoaded('Noto Serif SC');
```

2) 本地字体（推荐稳定）
- 把 `.woff2/.woff/.ttf` 放置到 `public/fonts/` 目录。
- 在 `src/components/FontSelector.tsx` 中维护映射：
```ts
const map = {
  'Douyin Sans': '/fonts/4902344e48c9c0fabec5fc285cd276c2.woff2',
  'Huiwen-mincho': '/fonts/d57523bf9bd34bc1e6f1c24ed32c5252.woff2',
  'Noto Serif SC': '/fonts/f112ed7f0b91582f-s.p.4d957126.woff2',
};
```
- 选择对应字体时会自动注册 @font-face 并加载。

注意：若需要粗体/斜体变体，请提供对应文件并在注册时设置 `font-weight`/`font-style`。

## 目录结构（简要）
- `src/components/` 主要 UI 与编辑器组件（CanvasEditor、CanvasPanel、FontSelector 等）
- `src/store/useCanvasStore.ts` 全局状态管理（预览模式、历史、选中对象等）
- `src/utils/fontLoader.ts` 字体加载与运行时注册
- `public/fonts/` 本地字体文件

## 许可
请根据实际需求选择许可证（例如 MIT）。当前默认建议使用 MIT 许可：
```
MIT License
Copyright (c) 2025
Permission is hereby granted, free of charge, to any person obtaining a copy...
```
如需替换为其他协议（Apache-2.0/GPL-3.0 等），请自行修改根目录 LICENSE 文件与本说明。

## 贡献
欢迎提 Issue 和 PR：
- Bug 修复与优化
- 新增组件/预设
- 性能与可访问性改进

## 致谢
- Fabric.js, TailwindCSS, Google Fonts 等开源项目。
