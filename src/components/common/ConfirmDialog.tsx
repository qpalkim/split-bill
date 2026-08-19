import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ConfirmDialogProps {
  /** 다이얼로그 열림 상태 */
  isOpen: boolean
  /** 열림 상태 변경 핸들러 */
  onOpenChange: (isOpen: boolean) => void
  /** 다이얼로그 제목 */
  title: string
  /** 보조 설명 */
  description?: string
  /** 확인 버튼 라벨 */
  confirmLabel?: string
  /** 취소 버튼 라벨 */
  cancelLabel?: string
  /** 확인 버튼 클릭 핸들러 */
  onConfirm: () => void
}

/** 삭제 등 파괴적 동작을 실행하기 전에 사용자 확인을 받는 공통 다이얼로그 */
function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDialog
