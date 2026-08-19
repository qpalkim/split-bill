import { X } from 'lucide-react'
import { ICON_SIZE_SM } from '@/constants/icon'
import { formatSessionDate } from '@/lib/date'

interface RestoredSessionBannerProps {
  /** 복원된 모임 이름(미입력 시 "이름 없는 모임"으로 표시) */
  sessionName: string
  /** 세션 생성 일시(ISO 문자열) */
  createdAt: string
  /** 배너 닫기 버튼 클릭 핸들러 */
  onDismiss: () => void
}

/** 새로고침 등으로 기존 세션을 복원했을 때 안내하는 배너 */
function RestoredSessionBanner({ sessionName, createdAt, onDismiss }: RestoredSessionBannerProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/50 px-4 py-3">
      <p className="min-w-0 truncate text-sm text-foreground">
        이전 정산을 이어서 진행 중이에요 · {sessionName || '이름 없는 모임'} ·{' '}
        {formatSessionDate(createdAt)}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="안내 닫기"
        className="relative shrink-0 rounded-full p-1.5 outline-none hover:bg-muted-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <X size={ICON_SIZE_SM} />
      </button>
    </div>
  )
}

export default RestoredSessionBanner
