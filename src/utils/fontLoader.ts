export async function ensureFontLoaded(fontFamily: string): Promise<void> {
  // 使用 CSS Font Loading API，尝试加载字体
  // 一些浏览器可能不支持 document.fonts；做兼容处理
  const anyDoc = document as any;
  if (anyDoc.fonts && typeof anyDoc.fonts.load === 'function') {
    try {
      // 触发加载：指定一个合理的字号
      await anyDoc.fonts.load(`16px ${JSON.stringify(fontFamily)}`);
      // 等待字体就绪队列
      await anyDoc.fonts.ready;
      return;
    } catch {
      // 忽略错误，让后续渲染继续
      return;
    }
  }
  // 回退：直接返回，让渲染继续（依赖 @import 或 @font-face 的加载）
  return;
}
