import type {
  Expense,
  ExpenseShare,
  Participant,
  ParticipantBalance,
  Session,
  Settlement,
} from '@/types'

/** Task010 UI 시연에 사용할 더미 정산 세션(더치페이 모임) */
export const dummySession: Session = {
  id: 'mock-session-1',
  name: '제주도 여행',
  createdAt: '2026-08-15T09:00:00.000Z',
}

/** 더미 참여자 5명 */
export const dummyParticipants: Participant[] = [
  { id: 'mock-participant-1', name: '김민준' },
  { id: 'mock-participant-2', name: '이서연' },
  { id: 'mock-participant-3', name: '박도윤' },
  { id: 'mock-participant-4', name: '최지우' },
  { id: 'mock-participant-5', name: '정하은' },
]

/** 더미 지출 항목 6건(균등 배분 4건 + 항목별 배분 2건) */
export const dummyExpenses: Expense[] = [
  {
    id: 'mock-expense-1',
    title: '저녁 식사',
    amount: 45000,
    payerId: 'mock-participant-1',
    splitType: 'equal',
  },
  {
    id: 'mock-expense-2',
    title: '카페',
    amount: 10000,
    payerId: 'mock-participant-2',
    splitType: 'equal',
  },
  {
    id: 'mock-expense-3',
    title: '택시비',
    amount: 32000,
    payerId: 'mock-participant-3',
    splitType: 'equal',
  },
  {
    id: 'mock-expense-4',
    title: '숙소',
    amount: 100000,
    payerId: 'mock-participant-4',
    splitType: 'equal',
  },
  {
    id: 'mock-expense-5',
    title: '기념품',
    amount: 18000,
    payerId: 'mock-participant-5',
    splitType: 'custom',
  },
  {
    id: 'mock-expense-6',
    title: '입장료',
    amount: 27000,
    payerId: 'mock-participant-1',
    splitType: 'custom',
  },
]

/**
 * 더미 지출별 참여자 부담 금액.
 * 균등 배분은 floor(금액/인원)로 나눈 뒤 나머지를 결제자에게 가산했고,
 * 항목별 배분은 참여자별 금액 합계가 Expense.amount와 정확히 일치하도록 수기로 구성했다.
 */
export const dummyExpenseShares: ExpenseShare[] = [
  // mock-expense-1: 45000원 / 5명(전원) = 9000원씩(나머지 없음)
  { id: 'mock-share-1-1', expenseId: 'mock-expense-1', participantId: 'mock-participant-1', amount: 9000 },
  { id: 'mock-share-1-2', expenseId: 'mock-expense-1', participantId: 'mock-participant-2', amount: 9000 },
  { id: 'mock-share-1-3', expenseId: 'mock-expense-1', participantId: 'mock-participant-3', amount: 9000 },
  { id: 'mock-share-1-4', expenseId: 'mock-expense-1', participantId: 'mock-participant-4', amount: 9000 },
  { id: 'mock-share-1-5', expenseId: 'mock-expense-1', participantId: 'mock-participant-5', amount: 9000 },

  // mock-expense-2: 10000원 / 3명(1,2,3) = 3333원씩 + 나머지 1원은 결제자(2)가 부담
  { id: 'mock-share-2-1', expenseId: 'mock-expense-2', participantId: 'mock-participant-1', amount: 3333 },
  { id: 'mock-share-2-2', expenseId: 'mock-expense-2', participantId: 'mock-participant-2', amount: 3334 },
  { id: 'mock-share-2-3', expenseId: 'mock-expense-2', participantId: 'mock-participant-3', amount: 3333 },

  // mock-expense-3: 32000원 / 4명(2,3,4,5) = 8000원씩(나머지 없음)
  { id: 'mock-share-3-2', expenseId: 'mock-expense-3', participantId: 'mock-participant-2', amount: 8000 },
  { id: 'mock-share-3-3', expenseId: 'mock-expense-3', participantId: 'mock-participant-3', amount: 8000 },
  { id: 'mock-share-3-4', expenseId: 'mock-expense-3', participantId: 'mock-participant-4', amount: 8000 },
  { id: 'mock-share-3-5', expenseId: 'mock-expense-3', participantId: 'mock-participant-5', amount: 8000 },

  // mock-expense-4: 100000원 / 5명(전원) = 20000원씩(나머지 없음)
  { id: 'mock-share-4-1', expenseId: 'mock-expense-4', participantId: 'mock-participant-1', amount: 20000 },
  { id: 'mock-share-4-2', expenseId: 'mock-expense-4', participantId: 'mock-participant-2', amount: 20000 },
  { id: 'mock-share-4-3', expenseId: 'mock-expense-4', participantId: 'mock-participant-3', amount: 20000 },
  { id: 'mock-share-4-4', expenseId: 'mock-expense-4', participantId: 'mock-participant-4', amount: 20000 },
  { id: 'mock-share-4-5', expenseId: 'mock-expense-4', participantId: 'mock-participant-5', amount: 20000 },

  // mock-expense-5(항목별 배분): 8000 + 6000 + 4000 = 18000원
  { id: 'mock-share-5-1', expenseId: 'mock-expense-5', participantId: 'mock-participant-1', amount: 8000 },
  { id: 'mock-share-5-2', expenseId: 'mock-expense-5', participantId: 'mock-participant-2', amount: 6000 },
  { id: 'mock-share-5-4', expenseId: 'mock-expense-5', participantId: 'mock-participant-4', amount: 4000 },

  // mock-expense-6(항목별 배분): 10000 + 9000 + 8000 = 27000원
  { id: 'mock-share-6-2', expenseId: 'mock-expense-6', participantId: 'mock-participant-2', amount: 10000 },
  { id: 'mock-share-6-3', expenseId: 'mock-expense-6', participantId: 'mock-participant-3', amount: 9000 },
  { id: 'mock-share-6-5', expenseId: 'mock-expense-6', participantId: 'mock-participant-5', amount: 8000 },
]

/**
 * ResultPage UI 시연용 더미 정산 결과.
 * dummyExpenses/dummyExpenseShares로부터 paidAmount(결제 합계)-owedAmount(부담 합계)=netBalance를
 * 수기로 계산했다(실제 계산 엔진 lib/settlement.ts는 Phase3 Task017에서 구현 예정).
 */
export const dummyParticipantBalances: ParticipantBalance[] = [
  { participantId: 'mock-participant-1', paidAmount: 72000, owedAmount: 40333, netBalance: 31667 },
  { participantId: 'mock-participant-2', paidAmount: 10000, owedAmount: 56334, netBalance: -46334 },
  { participantId: 'mock-participant-3', paidAmount: 32000, owedAmount: 49333, netBalance: -17333 },
  { participantId: 'mock-participant-4', paidAmount: 100000, owedAmount: 41000, netBalance: 59000 },
  { participantId: 'mock-participant-5', paidAmount: 18000, owedAmount: 45000, netBalance: -27000 },
]

/** 위 잔액을 채권자/채무자 그리디 매칭으로 정리한 최소 송금 내역(4건) */
export const dummySettlements: Settlement[] = [
  { fromId: 'mock-participant-2', toId: 'mock-participant-4', amount: 46334 },
  { fromId: 'mock-participant-5', toId: 'mock-participant-1', amount: 27000 },
  { fromId: 'mock-participant-3', toId: 'mock-participant-4', amount: 12666 },
  { fromId: 'mock-participant-3', toId: 'mock-participant-1', amount: 4667 },
]
