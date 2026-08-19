import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ICON_SIZE_MD } from '@/constants/icon'

interface PageHeaderProps {
  /** 페이지 제목 */
  title: string
  /** 뒤로가기 버튼 표시 여부 */
  hasBackButton?: boolean
  /** 뒤로가기 버튼 클릭 핸들러(hasBackButton이 true일 때만 사용) */
  onBack?: () => void
}

/** 페이지 제목과 선택적 뒤로가기 버튼을 보여주는 공통 헤더 */
function PageHeader({ title, hasBackButton = false, onBack }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      {hasBackButton ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          aria-label="뒤로가기"
        >
          <ArrowLeft size={ICON_SIZE_MD} />
        </Button>
      ) : null}
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
    </div>
  )
}

export default PageHeader
