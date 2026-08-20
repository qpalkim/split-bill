/** iPhone·iPad(데스크톱 모드 포함) 여부 — iOS Safari는 `<a download>`를 다운로드로 처리하지 않고 새 탭에서 여는 경우가 많다 */
function isIosDevice(): boolean {
  const isIPhoneOrIPad = /iP(hone|ad|od)/.test(navigator.userAgent)
  const isIPadDesktopMode = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return isIPhoneOrIPad || isIPadDesktopMode
}

/**
 * DOM 노드를 고해상도 PNG로 캡처해 파일로 저장한다.
 * 웹폰트(Pretendard CDN)를 먼저 base64로 임베딩해 캡처 결과에 폰트가 깨지지 않게 한다.
 * `html-to-image`는 이 함수가 실제로 호출되는 시점(다운로드 버튼 클릭)에만 필요하므로 동적 임포트로 초기 번들에서 제외한다.
 *
 * iOS에서만 Web Share API(파일 공유)로 네이티브 저장 시트를 띄운다. 데스크톱 Chrome/Edge 등도
 * `navigator.share`를 지원하지만, 그런 환경은 기존 앵커 다운로드가 이미 정상 동작하므로
 * 굳이 OS 공유 시트를 거치게 하지 않고 기존 방식을 유지한다.
 */
export async function downloadElementAsPng(node: HTMLElement, filename: string): Promise<void> {
  const { getFontEmbedCSS, toBlob } = await import('html-to-image')

  const fontEmbedCSS = await getFontEmbedCSS(node)
  const blob = await toBlob(node, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    cacheBust: true,
    fontEmbedCSS,
  })

  if (blob === null) {
    throw new Error('이미지 생성에 실패했습니다.')
  }

  const file = new File([blob], filename, { type: 'image/png' })

  if (
    isIosDevice() &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  ) {
    await navigator.share({ files: [file] })
    return
  }

  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  link.click()
  URL.revokeObjectURL(objectUrl)
}
