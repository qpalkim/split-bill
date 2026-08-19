import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ICON_SIZE_SM } from '@/constants/icon'
import { cn } from '@/lib/utils'

interface ParticipantChipProps {
  /** 참여자 이름 */
  name: string
  /** 삭제 버튼 표시 여부 */
  isRemovable?: boolean
  /** 삭제 버튼 클릭 핸들러(isRemovable이 true일 때만 사용) */
  onRemove?: () => void
  className?: string
}

/** 참여자 이름을 칩 형태로 보여주는 공통 컴포넌트 */
function ParticipantChip({ name, isRemovable = false, onRemove, className }: ParticipantChipProps) {
  return (
    <Badge variant="secondary" className={cn('h-7 gap-1 px-2.5 text-sm', className)}>
      {name}
      {isRemovable ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${name} 삭제`}
          className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
        >
          <X size={ICON_SIZE_SM} />
        </button>
      ) : null}
    </Badge>
  )
}

export default ParticipantChip
