import { isRouteErrorResponse, useRouteError } from 'react-router'

/** 라우트 렌더링/로딩 중 발생한 에러를 보여주는 바운더리 골격 */
function RouteErrorBoundary() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : '알 수 없는 오류가 발생했습니다.'

  return (
    <div>
      <h1>문제가 발생했습니다</h1>
      <p>{message}</p>
    </div>
  )
}

export default RouteErrorBoundary
