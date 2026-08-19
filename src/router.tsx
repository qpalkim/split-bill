import { createBrowserRouter } from 'react-router'
import RootLayout from '@/layouts/RootLayout'
import RouteErrorBoundary from '@/components/common/RouteErrorBoundary'
import ParticipantRegisterPage from '@/pages/ParticipantRegisterPage'
import ExpenseListPage from '@/pages/ExpenseListPage'
import ExpenseFormPage from '@/pages/ExpenseFormPage'
import ResultPage from '@/pages/ResultPage'
import NotFoundPage from '@/pages/NotFoundPage'

/** History API 기반 browser router. Vercel 정적 배포 시 리라이트는 Task024에서 설정한다. */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <ParticipantRegisterPage /> },
      { path: 'expenses', element: <ExpenseListPage /> },
      { path: 'expenses/new', element: <ExpenseFormPage /> },
      { path: 'expenses/:expenseId', element: <ExpenseFormPage /> },
      { path: 'result', element: <ResultPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
