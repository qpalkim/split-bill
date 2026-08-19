import { useNavigate } from 'react-router'

/** 존재하지 않는 경로 진입 시 보여주는 404 페이지 */
function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>페이지를 찾을 수 없습니다</h1>
      <button type="button" onClick={() => navigate('/')}>
        처음으로
      </button>
    </div>
  )
}

export default NotFoundPage
