/** 지출 항목의 배분 방식 */
export type SplitType = 'equal' | 'custom'

/** 지출 항목 */
export interface Expense {
  id: string
  title: string
  amount: number
  payerId: string
  splitType: SplitType
}
