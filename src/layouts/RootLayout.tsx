import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router'
import AppHeader from '@/components/common/AppHeader'
import StepIndicator from '@/components/common/StepIndicator'
import { Toaster } from '@/components/ui/sonner'
import { useHydrationStore, useSessionStore } from '@/store/useSessionStore'

/** 전체 라우트 공통 루트 레이아웃(모바일 전용 max-width 컨테이너) */
function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()
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

  const mainRef = useRef<HTMLElement>(null)
  const previousPathnameRef = useRef<string | null>(null)

  /**
   * 라우트 전환 시 포커스를 main 영역으로 옮긴다.
   * SPA 네비게이션은 브라우저가 자동으로 포커스를 옮겨주지 않아 방치하면 키보드/스크린리더 사용자의
   * 포커스가 body로 유실되고, 매 페이지 전환마다 헤더부터 다시 Tab을 눌러야 하는 문제가 생긴다.
   * 이전 경로와 실제로 달라졌을 때만 포커스를 옮겨, 최초 진입 시 브라우저 기본 포커스(주소창 등)를
   * 존중하고 StrictMode의 개발 모드 이펙트 이중 실행에도 영향받지 않도록 한다.
   */
  useEffect(() => {
    if (previousPathnameRef.current !== null && previousPathnameRef.current !== location.pathname) {
      mainRef.current?.focus()
    }
    previousPathnameRef.current = location.pathname
  }, [location.pathname])

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
      <main ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <ScrollRestoration />
      <Toaster />
    </div>
  )
}

export default RootLayout
