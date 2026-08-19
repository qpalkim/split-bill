/** ISO 날짜 문자열을 "2026년 8월 19일" 형태의 한국어 날짜로 변환 */
export function formatSessionDate(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/** Date 객체를 파일명에 쓸 수 있는 "YYYYMMDD" 형태로 변환 */
export function formatDateForFilename(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}
