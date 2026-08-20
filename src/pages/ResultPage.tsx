import { track } from '@vercel/analytics'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import AmountText from '@/components/common/AmountText'
import BottomActionBar from '@/components/common/BottomActionBar'
import EmptyState from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MIN_PARTICIPANTS_COUNT } from '@/constants/validation'
import { formatDateForFilename, formatSessionDate } from '@/lib/date'
import { downloadElementAsPng } from '@/lib/image'
import { calculateBalances, calculateSettlements } from '@/lib/settlement'
import { useSessionStore } from '@/store/useSessionStore'

/** 정산 결과 페이지(/result) */
function ResultPage() {
  const navigate = useNavigate()
  const session = useSessionStore((state) => state.session)
  const participants = useSessionStore((state) => state.participants)
  const expenses = useSessionStore((state) => state.expenses)
  const expenseShares = useSessionStore((state) => state.expenseShares)

  /** 이 영역만 PNG로 캡처되어 다운로드된다 */
  const captureRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hasCheered, setHasCheered] = useState(false)

  const isDataInsufficient = participants.length < MIN_PARTICIPANTS_COUNT || expenses.length === 0

  /** 참여자/지출 데이터가 부족한 상태로 직접 진입하면 지출 내역 페이지로 되돌린다 */
  useEffect(() => {
    if (isDataInsufficient) {
      navigate('/expenses', { replace: true })
    }
  }, [isDataInsufficient, navigate])

  const balances = useMemo(
    () => calculateBalances(participants, expenses, expenseShares),
    [participants, expenses, expenseShares],
  )
  const settlements = useMemo(() => calculateSettlements(balances), [balances])

  /** 참여자 목록이 바뀔 때만 이름 조회용 Map을 다시 만들어 목록 렌더링마다 반복 탐색하지 않게 한다 */
  const participantNameById = useMemo(
    () => new Map(participants.map((participant) => [participant.id, participant.name])),
    [participants],
  )
  const findParticipantName = (participantId: string) =>
    participantNameById.get(participantId) ?? '알 수 없음'

  const hasSettlements = settlements.length > 0

  /** 개발자 응원 클릭을 Vercel Analytics 커스텀 이벤트로 기록(세션당 1회) */
  const handleCheerClick = () => {
    if (hasCheered) {
      return
    }
    track('cheer_click')
    setHasCheered(true)
    toast.success('응원해주셔서 감사해요!')
  }

  /** 정산 결과 캡처 영역을 PNG로 저장 */
  const handleDownloadImage = async () => {
    if (captureRef.current === null || isDownloading) {
      return
    }

    setIsDownloading(true)
    try {
      const filename = `${session?.name || '모임'}_정산결과_${formatDateForFilename(new Date())}.png`
      await downloadElementAsPng(captureRef.current, filename)
      toast.success('이미지가 저장됐어요.')
    } catch (error) {
      console.error(error)
      toast.error('이미지 생성에 실패했어요. 다시 시도해주세요.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 pb-28">
      <div ref={captureRef} className="flex flex-col gap-6 rounded-lg bg-background p-4">
        <section className="space-y-0.5">
          <h1 className="text-base font-bold text-foreground">
            {session?.name || '이름 없는 모임'} 정산 결과
          </h1>
          {session ? (
            <p className="text-xs text-muted-foreground">{formatSessionDate(session.createdAt)}</p>
          ) : null}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">참여자별 지출 요약</h2>
          <Card>
            <CardContent className="space-y-3">
              {balances.map((balance) => (
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
              {settlements.map((settlement, index) => (
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
      </div>

      <BottomActionBar>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1"
              onClick={() => navigate('/expenses')}
            >
              지출 내역으로 돌아가기
            </Button>
            <Button
              type="button"
              className="h-10 flex-1"
              disabled={isDownloading}
              onClick={handleDownloadImage}
            >
              {isDownloading ? '다운로드 중...' : '정산 결과 다운로드'}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            다운로드가 되지 않으면 이미지를 길게 눌러 저장해주세요.
          </p>
          <button
            type="button"
            className="mx-auto text-xs text-muted-foreground underline-offset-2 hover:underline disabled:no-underline"
            disabled={hasCheered}
            onClick={handleCheerClick}
          >
            {hasCheered ? '응원해주셔서 감사해요' : '🙌 개발자 응원하기'}
          </button>
        </div>
      </BottomActionBar>
    </div>
  )
}

export default ResultPage
