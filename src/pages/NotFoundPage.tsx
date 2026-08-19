import { useNavigate } from 'react-router'
import EmptyState from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'

/** 존재하지 않는 경로 진입 시 보여주는 404 페이지 */
function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 px-4 py-4 pb-28">
      <EmptyState
        title="페이지를 찾을 수 없어요"
        description="주소를 다시 확인하거나 처음 화면으로 돌아가주세요."
        action={
          <Button type="button" className="h-11" onClick={() => navigate('/')}>
            처음으로
          </Button>
        }
      />
    </div>
  )
}

export default NotFoundPage
