import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useNavigate } from 'react-router'
import AppHeader from '@/components/common/AppHeader'
import StepIndicator from '@/components/common/StepIndicator'
import { Toaster } from '@/components/ui/sonner'
import { useHydrationStore, useSessionStore } from '@/store/useSessionStore'

/** 전체 라우트 공통 루트 레이아웃(모바일 전용 max-width 컨테이너) */
function RootLayout() {
  const navigate = useNavigate()
  const isHydrated = useHydrationStore((state) => state.isHydrated)
  const session = useSessionStore((state) => state.session)
  const createSession = useSessionStore((state) => state.createSession)
  const resetSession = useSessionStore((state) => state.resetSession)
  const participants = useSessionStore((state) => state.participants)
  const expenses = useSessionStore((state) => state.expenses)

  /** hydration 완료 후 세션이 없으면 첫 진입으로 간주해 새 세션을 자동 생성한다 */
  useEffect(() => {
    if (isHydrated && session === null) {
      createSession()
    }
  }, [isHydrated, session, createSession])

  /** 세션 초기화 확인 시 스토어를 비우고 첫 화면으로 이동한다(재진입 시 자동으로 새 세션 생성) */
  const handleResetSession = () => {
    resetSession()
    navigate('/', { replace: true })
  }

  if (!isHydrated) {
    return <div className="min-h-dvh w-full bg-background" />
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background">
      <AppHeader
        sessionName={session?.name}
        participantCount={participants.length}
        expenseCount={expenses.length}
        onResetSession={handleResetSession}
      />
      <StepIndicator />
      <main className="flex-1">
        <Outlet />
      </main>
      <ScrollRestoration />
      <Toaster />
    </div>
  )
}

export default RootLayout
