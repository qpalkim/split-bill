import { Receipt, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { ICON_SIZE_MD, ICON_SIZE_SM } from '@/constants/icon'

interface AppHeaderProps {
  /** 진행 중인 모임 이름(선택) */
  sessionName?: string
  /** 현재 참여자 수(초기화 확인 문구에 노출) */
  participantCount: number
  /** 현재 지출 항목 수(초기화 확인 문구에 노출) */
  expenseCount: number
  /** "새 정산 시작하기" 확인 시 호출되는 핸들러 */
  onResetSession: () => void
}

/** 로고와 모임 이름, 세션 초기화 버튼을 보여주는 공통 상단 헤더 */
function AppHeader({ sessionName, participantCount, expenseCount, onResetSession }: AppHeaderProps) {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const hasNothingToLose = participantCount === 0 && expenseCount === 0

  /** 아직 아무것도 입력하지 않은 첫 화면에서는 확인 모달 없이 바로 초기화한다 */
  const handleResetButtonClick = () => {
    if (hasNothingToLose) {
      onResetSession()
      return
    }
    setIsResetDialogOpen(true)
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-background px-4 shadow-sm">
      <Link
        to="/"
        className="flex items-center gap-1.5 rounded-md text-lg font-bold text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Receipt size={ICON_SIZE_MD} className="text-primary" />
        정돈
      </Link>
      <div className="flex items-center gap-1">
        {sessionName ? (
          <span className="max-w-[35vw] truncate text-sm text-muted-foreground">
            {sessionName}
          </span>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          aria-label="새 정산 시작하기"
          onClick={handleResetButtonClick}
        >
          <RotateCcw size={ICON_SIZE_SM} />
        </Button>
      </div>

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        title="새 정산을 시작할까요?"
        description={`현재 참여자 ${participantCount}명, 지출 ${expenseCount}건이 모두 삭제되며 되돌릴 수 없어요.`}
        confirmLabel="새로 시작"
        onConfirm={() => {
          onResetSession()
          setIsResetDialogOpen(false)
        }}
      />
    </header>
  )
}

export default AppHeader
