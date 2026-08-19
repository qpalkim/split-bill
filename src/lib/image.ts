import { getFontEmbedCSS, toPng } from 'html-to-image'

/**
 * DOM 노드를 고해상도 PNG로 캡처해 파일로 다운로드한다.
 * 웹폰트(Pretendard CDN)를 먼저 base64로 임베딩해 캡처 결과에 폰트가 깨지지 않게 한다.
 */
export async function downloadElementAsPng(node: HTMLElement, filename: string): Promise<void> {
  const fontEmbedCSS = await getFontEmbedCSS(node)
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    cacheBust: true,
    fontEmbedCSS,
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}
