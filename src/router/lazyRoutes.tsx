import { lazy } from 'react'

export const ExpenseListPage = lazy(() => import('@/pages/ExpenseListPage'))
export const ExpenseFormPage = lazy(() => import('@/pages/ExpenseFormPage'))
export const ResultPage = lazy(() => import('@/pages/ResultPage'))
export const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

/** 지연 로딩 청크 전환 중 레이아웃 흔들림을 막기 위한 빈 화면(RootLayout의 hydration 대기 화면과 동일한 배경) */
export function RouteFallback() {
  return <div className="min-h-dvh w-full bg-background" />
}
