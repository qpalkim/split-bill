/** ISO 날짜 문자열을 "2026년 8월 19일" 형태의 한국어 날짜로 변환 */
export function formatSessionDate(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
