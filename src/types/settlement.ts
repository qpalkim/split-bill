/** 참여자별 결제/부담 합계와 순잔액 */
export interface ParticipantBalance {
  participantId: string
  paidAmount: number
  owedAmount: number
  netBalance: number
}

/** 정산을 위해 한 참여자가 다른 참여자에게 보내야 할 송금 내역 */
export interface Settlement {
  fromId: string
  toId: string
  amount: number
}
