import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router'
import EmptyState from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'

/** 라우트 렌더링/로딩 중 발생한 에러를 보여주는 바운더리. RootLayout 전체를 대체하므로 자체 컨테이너를 갖는다 */
function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  console.error(error)

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : '알 수 없는 오류가 발생했습니다.'

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center bg-background px-4">
      <EmptyState
        title="문제가 발생했어요"
        description={message}
        action={
          <Button type="button" className="h-10" onClick={() => navigate('/')}>
            홈으로 돌아가기
          </Button>
        }
      />
    </div>
  )
}

export default RouteErrorBoundary
