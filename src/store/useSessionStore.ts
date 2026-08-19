import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PersistStorage, StorageValue } from 'zustand/middleware'
import { toast } from 'sonner'
import type { Expense, ExpenseShare, Participant, Session } from '@/types'

/**
 * 세션/참여자/지출 상태를 관리하는 Zustand 스토어.
 *
 * persist 미들웨어로 localStorage(키: split-bill-session)에 자동 저장/복원된다.
 * 참조 무결성 검사, 항목별 배분 합계 검증 등 나머지 비즈니스 로직은 Phase3의 이후 태스크(013~)에서 구현한다.
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
  updateSessionName: (name: string) => void
  addParticipant: (name: string) => void
  removeParticipant: (id: string) => void
  addExpense: (expense: Omit<Expense, 'id'>) => string
  updateExpense: (id: string, patch: Partial<Omit<Expense, 'id'>>) => void
  removeExpense: (id: string) => void
  setSharesForExpense: (expenseId: string, shares: Omit<ExpenseShare, 'id' | 'expenseId'>[]) => void
  resetSession: () => void
}

const initialState: SessionState = {
  session: null,
  participants: [],
  expenses: [],
  expenseShares: [],
}

const STORAGE_KEY = 'split-bill-session'

interface HydrationState {
  isHydrated: boolean
  setHydrated: () => void
}

/**
 * useSessionStore의 hydration(localStorage 복원) 완료 여부를 별도로 추적하는 비영속 스토어.
 * RootLayout이 hydration 완료 전까지 빈 화면을 렌더링해 깜빡임을 방지하는 데 사용한다.
 */
export const useHydrationStore = create<HydrationState>((set) => ({
  isHydrated: false,
  setHydrated: () => set({ isHydrated: true }),
}))

let hasWarnedAboutStorageFailure = false

/**
 * localStorage 접근 실패(시크릿 모드, 용량 초과, 손상된 JSON 등)를 안전하게 처리하는 커스텀 storage.
 * 읽기 실패 시 null을 반환해 초기 상태로 폴백하고, 쓰기 실패 시 조용히 무시하되 최초 1회만 토스트로 안내한다.
 */
const safeSessionStorage: PersistStorage<SessionState> = {
  getItem: (name) => {
    try {
      const raw = window.localStorage.getItem(name)
      return raw === null ? null : (JSON.parse(raw) as StorageValue<SessionState>)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, JSON.stringify(value))
    } catch {
      if (!hasWarnedAboutStorageFailure) {
        hasWarnedAboutStorageFailure = true
        toast.warning('브라우저 저장 공간에 접근할 수 없어 이번 세션은 저장되지 않아요.')
      }
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name)
    } catch {
      // 접근 실패 시 별도 처리 없이 무시
    }
  },
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

      updateSessionName: (name) =>
        set((state) =>
          state.session ? { session: { ...state.session, name } } : {},
        ),

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

      addExpense: (expense) => {
        const id = crypto.randomUUID()
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id }],
        }))
        return id
      },

      updateExpense: (id, patch) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...patch } : expense,
          ),
        })),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
          expenseShares: state.expenseShares.filter((share) => share.expenseId !== id),
        })),

      setSharesForExpense: (expenseId, shares) =>
        set((state) => ({
          expenseShares: [
            ...state.expenseShares.filter((share) => share.expenseId !== expenseId),
            ...shares.map((share) => ({ ...share, id: crypto.randomUUID(), expenseId })),
          ],
        })),

      resetSession: () => set(initialState),
    }),
    {
      name: STORAGE_KEY,
      storage: safeSessionStorage,
      version: 1,
      partialize: (state) => ({
        session: state.session,
        participants: state.participants,
        expenses: state.expenses,
        expenseShares: state.expenseShares,
      }),
      migrate: (persistedState) => persistedState as SessionState,
      onRehydrateStorage: () => () => {
        useHydrationStore.getState().setHydrated()
      },
    },
  ),
)
