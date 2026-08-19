import type { Expense, ExpenseShare, Participant, ParticipantBalance, Settlement } from '@/types'

/**
 * 참여자별 결제/부담 합계와 순잔액을 계산한다.
 * paidAmount는 해당 참여자가 결제자인 지출 합계, owedAmount는 해당 참여자의 부담 합계다.
 * UI/스토어에 의존하지 않는 순수 함수.
 */
export function calculateBalances(
  participants: Participant[],
  expenses: Expense[],
  expenseShares: ExpenseShare[],
): ParticipantBalance[] {
  const balances = participants.map((participant) => {
    const paidAmount = expenses
      .filter((expense) => expense.payerId === participant.id)
      .reduce((sum, expense) => sum + expense.amount, 0)
    const owedAmount = expenseShares
      .filter((share) => share.participantId === participant.id)
      .reduce((sum, share) => sum + share.amount, 0)

    return {
      participantId: participant.id,
      paidAmount,
      owedAmount,
      netBalance: paidAmount - owedAmount,
    }
  })

  assertBalancesAreConsistent(balances)

  return balances
}

/**
 * 채권자/채무자를 그리디 매칭해 최소 송금 횟수로 정리한 송금 목록을 도출한다.
 * 모든 참여자의 잔액이 0이면 빈 배열을 반환한다.
 */
export function calculateSettlements(balances: ParticipantBalance[]): Settlement[] {
  const debtors = balances
    .filter((balance) => balance.netBalance < 0)
    .map((balance) => ({ ...balance }))
    .sort((a, b) => a.netBalance - b.netBalance)
  const creditors = balances
    .filter((balance) => balance.netBalance > 0)
    .map((balance) => ({ ...balance }))
    .sort((a, b) => b.netBalance - a.netBalance)

  const settlements: Settlement[] = []
  let debtorIndex = 0
  let creditorIndex = 0

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex]
    const creditor = creditors[creditorIndex]
    const amount = Math.min(-debtor.netBalance, creditor.netBalance)

    settlements.push({ fromId: debtor.participantId, toId: creditor.participantId, amount })

    debtor.netBalance += amount
    creditor.netBalance -= amount

    if (debtor.netBalance === 0) {
      debtorIndex += 1
    }
    if (creditor.netBalance === 0) {
      creditorIndex += 1
    }
  }

  return settlements
}

/** 잔액 합계가 0인지 확인하는 내부 정합성 가드(불변식이 깨지면 콘솔 경고만 남기고 계산은 계속 진행) */
function assertBalancesAreConsistent(balances: ParticipantBalance[]): void {
  const total = balances.reduce((sum, balance) => sum + balance.netBalance, 0)

  if (total !== 0) {
    console.warn(`정산 잔액 합계가 0이 아닙니다(${total}원). 데이터 정합성을 확인해주세요.`)
  }
}
