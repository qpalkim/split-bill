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

/** isParticipantReferenced 판정에 필요한 상태 슬라이스 */
interface ReferenceCheckState {
  expenses: Expense[]
  expenseShares: ExpenseShare[]
}

/** 참여자가 지출의 결제자 또는 부담자로 참조 중인지 확인(참조 중이면 삭제를 차단해야 함) */
export const isParticipantReferenced = (
  state: ReferenceCheckState,
  participantId: string,
): boolean =>
  state.expenses.some((expense) => expense.payerId === participantId) ||
  state.expenseShares.some((share) => share.participantId === participantId)
