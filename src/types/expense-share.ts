/** 지출 항목 하나에 대한 참여자별 부담 금액 */
export interface ExpenseShare {
  id: string
  expenseId: string
  participantId: string
  amount: number
}
