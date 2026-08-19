import { memo } from 'react'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

interface AmountTextProps {
  /** 표시할 금액(원 단위) */
  amount: number
  className?: string
}

/** 금액을 "12,345원" 형태로 표시하는 공통 컴포넌트(숫자 정렬을 위해 tabular-nums 적용) */
function AmountText({ amount, className }: AmountTextProps) {
  return (
    <span className={cn('tabular-nums', className)}>
      {formatCurrency(amount)}
    </span>
  )
}

export default memo(AmountText)
