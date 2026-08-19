import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router'
import RootLayout from '@/layouts/RootLayout'
import RouteErrorBoundary from '@/components/common/RouteErrorBoundary'
import ParticipantRegisterPage from '@/pages/ParticipantRegisterPage'
import {
  ExpenseFormPage,
  ExpenseListPage,
  NotFoundPage,
  ResultPage,
  RouteFallback,
} from '@/router/lazyRoutes'

/** 코드 스플리팅된 라우트 엘리먼트를 Suspense로 감싼다 */
function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

/** History API 기반 browser router. Vercel 정적 배포 시 리라이트는 Task024에서 설정한다. */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <ParticipantRegisterPage /> },
      { path: 'expenses', element: withSuspense(<ExpenseListPage />) },
      { path: 'expenses/new', element: withSuspense(<ExpenseFormPage />) },
      { path: 'expenses/:expenseId', element: withSuspense(<ExpenseFormPage />) },
      { path: 'result', element: withSuspense(<ResultPage />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
])
