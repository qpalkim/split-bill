/** iPhone·iPad(데스크톱 모드 포함) 여부 — iOS Safari는 `<a download>`를 다운로드로 처리하지 않고 새 탭에서 여는 경우가 많다 */
function isIosDevice(): boolean {
  const isIPhoneOrIPad = /iP(hone|ad|od)/.test(navigator.userAgent)
  const isIPadDesktopMode = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return isIPhoneOrIPad || isIPadDesktopMode
}

/** 업스케일 배율 — 캡처 결과가 실제 화면 픽셀 크기 그대로라 다소 흐릿해, 별도 캔버스로 확대해 화질을 보완한다 */
const UPSCALE_FACTOR = 2

/**
 * DOM 노드를 PNG로 캡처해 파일로 저장한다.
 * 웹폰트(Pretendard CDN)는 페이지에 이미 로드돼 있는 걸 그대로 사용해 그리므로 별도 임베딩이 필요 없다.
 * `html2canvas-pro`는 이 함수가 실제로 호출되는 시점(다운로드 버튼 클릭)에만 필요하므로 동적 임포트로 초기 번들에서 제외한다.
 *
 * `html-to-image`·`modern-screenshot`을 차례로 시도했지만 iOS Safari에서 카드 배경·그림자가 잘려
 * 보이는 문제가 그대로였다. 두 라이브러리 모두 SVG `<foreignObject>`에 DOM을 넣어 래스터화하는
 * 방식을 공유하는데, 라이브 페이지는 정상인데 캡처 결과만 깨지는 걸로 보아 iOS Safari의
 * `<foreignObject>` 래스터화 자체가 원인으로 보여 `html2canvas-pro`(iframe 복제 + 캔버스 직접 그리기,
 * `<foreignObject>` 미사용)로 교체했다.
 *
 * 다만 `html2canvas-pro`는 `scale` 옵션을 1보다 크게 주면(고해상도 렌더링 시도) 이 앱의 카드
 * 배경·그림자가 아예 사라지는 자체 버그가 있다(데스크톱 Chrome에서도 재현되는, iOS와 무관한
 * 라이브러리 버그). `scale: 1`로 캡처해 이 버그를 피하고, 해상도가 낮아지는 건 캡처 후 별도
 * 캔버스로 `UPSCALE_FACTOR`배 확대해 보완한다.
 *
 * iOS에서만 Web Share API(파일 공유)로 네이티브 저장 시트를 띄운다. 데스크톱 Chrome/Edge 등도
 * `navigator.share`를 지원하지만, 그런 환경은 기존 앵커 다운로드가 이미 정상 동작하므로
 * 굳이 OS 공유 시트를 거치게 하지 않고 기존 방식을 유지한다.
 */
export async function downloadElementAsPng(node: HTMLElement, filename: string): Promise<void> {
  const { default: html2canvas } = await import('html2canvas-pro')

  const captured = await html2canvas(node, {
    scale: 1,
    backgroundColor: '#ffffff',
    useCORS: true,
  })

  const canvas = document.createElement('canvas')
  canvas.width = captured.width * UPSCALE_FACTOR
  canvas.height = captured.height * UPSCALE_FACTOR
  const context = canvas.getContext('2d')

  if (context === null) {
    throw new Error('이미지 생성에 실패했습니다.')
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(captured, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))

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
