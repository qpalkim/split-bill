import { Outlet, ScrollRestoration } from 'react-router'
import AppHeader from '@/components/common/AppHeader'
import StepIndicator from '@/components/common/StepIndicator'

/** 전체 라우트 공통 루트 레이아웃(모바일 전용 max-width 컨테이너) */
function RootLayout() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background">
      <AppHeader />
      <StepIndicator />
      <main className="flex-1">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}

export default RootLayout
