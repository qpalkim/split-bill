import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import AmountText from '@/components/common/AmountText'
import BottomActionBar from '@/components/common/BottomActionBar'
import EmptyState from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  dummyParticipantBalances,
  dummyParticipants,
  dummySettlements,
} from '@/mocks/dummy-session'

/** 정산 결과 페이지(/result) */
function ResultPage() {
  const navigate = useNavigate()

  const findParticipantName = (participantId: string) =>
    dummyParticipants.find((participant) => participant.id === participantId)?.name ?? '알 수 없음'

  const hasSettlements = dummySettlements.length > 0

  /** 결과 화면을 PNG로 저장(Phase4 Task019에서 html-to-image로 실제 구현 예정) */
  const handleDownloadImage = () => {
    toast('이미지 다운로드는 다음 업데이트에서 제공될 예정이에요.')
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 pb-28">
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">참여자별 지출 요약</h2>
        <Card>
          <CardContent className="space-y-3">
            {dummyParticipantBalances.map((balance) => (
              <div
                key={balance.participantId}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="min-w-0 truncate font-medium text-foreground">
                  {findParticipantName(balance.participantId)}
                </span>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="text-xs text-muted-foreground">
                    결제 <AmountText amount={balance.paidAmount} /> · 부담{' '}
                    <AmountText amount={balance.owedAmount} />
                  </span>
                  <AmountText
                    amount={balance.netBalance}
                    className={
                      balance.netBalance < 0
                        ? 'font-semibold text-destructive'
                        : 'font-semibold text-foreground'
                    }
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">송금 내역</h2>
        {hasSettlements ? (
          <ul className="flex flex-col gap-2">
            {dummySettlements.map((settlement, index) => (
              <li key={`${settlement.fromId}-${settlement.toId}-${index}`}>
                <Card>
                  <CardContent className="flex items-center justify-between gap-2 text-sm">
                    <span className="min-w-0 truncate text-foreground">
                      {findParticipantName(settlement.fromId)} → {findParticipantName(settlement.toId)}
                    </span>
                    <AmountText amount={settlement.amount} className="shrink-0 font-semibold" />
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="정산할 금액이 없어요"
            description="모든 참여자의 잔액이 0원이라 송금할 내역이 없어요."
          />
        )}
      </section>

      <BottomActionBar>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            onClick={() => navigate('/expenses')}
          >
            지출 내역으로 돌아가기
          </Button>
          <Button type="button" className="h-11 flex-1" onClick={handleDownloadImage}>
            이미지로 다운로드
          </Button>
        </div>
      </BottomActionBar>
    </div>
  )
}

export default ResultPage
