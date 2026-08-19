import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import AmountText from '@/components/common/AmountText'
import BottomActionBar from '@/components/common/BottomActionBar'
import EmptyState from '@/components/common/EmptyState'
import ParticipantChip from '@/components/common/ParticipantChip'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ICON_SIZE_SM } from '@/constants/icon'
import { dummyExpenses, dummyParticipants } from '@/mocks/dummy-session'
import type { Expense } from '@/types'

/** 지출 내역 페이지(/expenses) */
function ExpenseListPage() {
  const navigate = useNavigate()
  const [participants] = useState(dummyParticipants)
  const [expenses, setExpenses] = useState<Expense[]>(dummyExpenses)

  const findPayerName = (payerId: string) =>
    participants.find((participant) => participant.id === payerId)?.name ?? '알 수 없음'

  /** id에 해당하는 지출 항목을 목록에서 제거 */
  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 pb-28">
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-foreground">참여자 {participants.length}명</p>
        <ul className="flex flex-wrap gap-2">
          {participants.map((participant) => (
            <li key={participant.id}>
              <ParticipantChip name={participant.name} />
            </li>
          ))}
        </ul>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          title="등록된 지출이 없어요"
          description="지출 추가 버튼을 눌러 첫 지출 항목을 등록해주세요."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {expenses.map((expense) => (
            <li key={expense.id}>
              <Card
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => navigate(`/expenses/${expense.id}`)}
              >
                <CardContent className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate text-sm font-medium text-foreground">{expense.title}</p>
                    <p className="text-xs text-muted-foreground">
                      결제: {findPayerName(expense.payerId)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <AmountText amount={expense.amount} className="text-sm font-semibold" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`${expense.title} 삭제`}
                      onClick={(event) => {
                        event.stopPropagation()
                        removeExpense(expense.id)
                      }}
                    >
                      <Trash2 size={ICON_SIZE_SM} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <BottomActionBar>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/expenses/new')}
          >
            지출 추가
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={expenses.length === 0}
            onClick={() => navigate('/result')}
          >
            정산 결과 보기
          </Button>
        </div>
      </BottomActionBar>
    </div>
  )
}

export default ExpenseListPage
