/** 고유 ID를 생성(crypto.randomUUID 우선, 미지원 환경은 폴백 로직 사용) */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
