import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ICON_SIZE_SM } from '@/constants/icon'
import { cn } from '@/lib/utils'

interface ParticipantChipProps {
  /** 참여자 이름 */
  name: string
  /** 삭제 버튼 표시 여부 */
  isRemovable?: boolean
  /** 삭제 버튼 비활성화 여부(지출에서 참조 중인 참여자 등) */
  isDisabled?: boolean
  /** 비활성화 사유 안내 문구(isDisabled가 true일 때만 노출) */
  disabledReason?: string
  /** 삭제 버튼 클릭 핸들러(isRemovable이 true일 때만 사용) */
  onRemove?: () => void
  className?: string
}

/** 참여자 이름을 칩 형태로 보여주는 공통 컴포넌트 */
function ParticipantChip({
  name,
  isRemovable = false,
  isDisabled = false,
  disabledReason,
  onRemove,
  className,
}: ParticipantChipProps) {
  return (
    <Badge variant="secondary" className={cn('h-7 gap-1 px-2.5 text-sm', className)}>
      {name}
      {isRemovable ? (
        <button
          type="button"
          onClick={onRemove}
          disabled={isDisabled}
          aria-label={`${name} 삭제`}
          title={isDisabled ? disabledReason : undefined}
          className="relative ml-0.5 rounded-full p-0.5 outline-none after:absolute after:-inset-3 hover:bg-muted-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <X size={ICON_SIZE_SM} />
        </button>
      ) : null}
    </Badge>
  )
}

export default ParticipantChip
