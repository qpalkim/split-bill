import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  /** 빈 상태 제목(예: "참여자가 없어요") */
  title: string
  /** 보조 설명 */
  description?: string
  /** CTA 버튼 등 추가 액션 영역 */
  action?: ReactNode
  className?: string
}

/** 참여자/지출/정산 대상이 없을 때 재사용하는 공통 빈 상태 컴포넌트 */
function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 px-6 py-12 text-center', className)}>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export default EmptyState
