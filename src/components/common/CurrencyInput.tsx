import type { ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { formatCurrency, parseAmount } from '@/lib/format'

interface CurrencyInputProps {
  /** 현재 금액(원 단위 숫자) */
  value: number
  /** 금액 변경 핸들러(파싱된 숫자를 전달) */
  onValueChange: (amount: number) => void
  id?: string
  placeholder?: string
  className?: string
}

/** 숫자만 입력받아 천 단위 콤마와 "원" 단위로 표시하는 금액 입력 컴포넌트 */
function CurrencyInput({ value, onValueChange, id, placeholder, className }: CurrencyInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(parseAmount(event.target.value))
  }

  return (
    <Input
      id={id}
      inputMode="numeric"
      placeholder={placeholder}
      className={className}
      value={value === 0 ? '' : formatCurrency(value)}
      onChange={handleChange}
    />
  )
}

export default CurrencyInput
