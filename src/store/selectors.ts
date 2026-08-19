import type { Expense, ExpenseShare, Participant, Session } from '@/types'

/** useSessionStore에서 셀렉터가 참조하는 상태 형태(store 자체와 순환 의존을 피하기 위해 분리) */
interface SessionSelectorState {
  session: Session | null
  participants: Participant[]
  expenses: Expense[]
  expenseShares: ExpenseShare[]
}

/** id로 참여자 조회(조회 전용, 계산 로직 없음) */
export const selectParticipantById = (
  state: SessionSelectorState,
  id: string,
): Participant | undefined =>
  state.participants.find((participant) => participant.id === id)

/** 특정 지출 항목에 속한 ExpenseShare 목록 조회(조회 전용, 계산 로직 없음) */
export const selectSharesByExpenseId = (
  state: SessionSelectorState,
  expenseId: string,
): ExpenseShare[] =>
  state.expenseShares.filter((share) => share.expenseId === expenseId)
