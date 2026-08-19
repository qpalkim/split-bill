import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Expense, ExpenseShare, Participant, Session } from '@/types'

/**
 * 세션/참여자/지출 상태를 관리하는 Zustand 스토어 골격.
 *
 * 참조 무결성 검사, 항목별 배분 합계 검증, 캐스케이드 삭제 등 실제 비즈니스 로직과
 * partialize/migrate 저장 전략은 Phase3(Task012~013)에서 구현한다.
 * 계산 로직(배분/정산 등)은 이 스토어가 아닌 src/lib/에 위치시킨다.
 */
interface SessionState {
  session: Session | null
  participants: Participant[]
  expenses: Expense[]
  expenseShares: ExpenseShare[]
}

interface SessionActions {
  createSession: (name?: string) => void
  addParticipant: (name: string) => void
  removeParticipant: (id: string) => void
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, patch: Partial<Omit<Expense, 'id'>>) => void
  removeExpense: (id: string) => void
  resetSession: () => void
}

const initialState: SessionState = {
  session: null,
  participants: [],
  expenses: [],
  expenseShares: [],
}

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      ...initialState,

      createSession: (name) =>
        set({
          session: {
            id: crypto.randomUUID(),
            name: name ?? '',
            createdAt: new Date().toISOString(),
          },
        }),

      addParticipant: (name) =>
        set((state) => ({
          participants: [
            ...state.participants,
            { id: crypto.randomUUID(), name },
          ],
        })),

      removeParticipant: (id) =>
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id),
        })),

      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id: crypto.randomUUID() }],
        })),

      updateExpense: (id, patch) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...patch } : expense,
          ),
        })),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      resetSession: () => set(initialState),
    }),
    {
      name: 'split-bill-session',
      version: 1,
    },
  ),
)
