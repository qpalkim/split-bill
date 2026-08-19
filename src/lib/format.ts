/** 숫자 금액을 "12,345원" 형태의 한국어 원화 문자열로 변환 */
export function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('ko-KR').format(amount)}원`
}

/** 사용자가 입력한 문자열에서 숫자만 추출해 금액으로 변환(빈 문자열은 0) */
export function parseAmount(raw: string): number {
  const digitsOnly = raw.replace(/[^0-9]/g, '')
  return digitsOnly === '' ? 0 : Number(digitsOnly)
}
