import { useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import BottomActionBar from '@/components/common/BottomActionBar'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import ParticipantChip from '@/components/common/ParticipantChip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  PARTICIPANT_MAX_COUNT_MESSAGE,
  PARTICIPANT_NAME_DUPLICATE_MESSAGE,
  PARTICIPANT_REFERENCED_MESSAGE,
} from '@/constants/message'
import { MAX_PARTICIPANTS_COUNT, MIN_PARTICIPANTS_COUNT } from '@/constants/validation'
import { participantSchema } from '@/lib/validation/participantSchema'
import { isParticipantReferenced } from '@/store/selectors'
import { useSessionStore } from '@/store/useSessionStore'
import type { Participant } from '@/types'

/** 참여자 등록 페이지(/) */
function ParticipantRegisterPage() {
  const navigate = useNavigate()
  const session = useSessionStore((state) => state.session)
  const sessionName = session?.name ?? ''
  const updateSessionName = useSessionStore((state) => state.updateSessionName)
  const participants = useSessionStore((state) => state.participants)
  const addParticipant = useSessionStore((state) => state.addParticipant)
  const removeParticipant = useSessionStore((state) => state.removeParticipant)
  const expenses = useSessionStore((state) => state.expenses)
  const expenseShares = useSessionStore((state) => state.expenseShares)

  const [newParticipantName, setNewParticipantName] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pendingDeleteParticipant, setPendingDeleteParticipant] = useState<Participant | null>(
    null,
  )
  const participantNameInputRef = useRef<HTMLInputElement>(null)

  const isNextEnabled = participants.length >= MIN_PARTICIPANTS_COUNT
  const isMaxCountReached = participants.length >= MAX_PARTICIPANTS_COUNT

  /** 입력값을 검증해 참여자 명단에 추가 */
  const handleAddParticipant = () => {
    if (isMaxCountReached) {
      setErrorMessage(PARTICIPANT_MAX_COUNT_MESSAGE)
      return
    }

    const result = participantSchema.safeParse({ name: newParticipantName })

    if (!result.success) {
      setErrorMessage(result.error.issues[0]?.message ?? '참여자 이름을 확인해주세요.')
      participantNameInputRef.current?.focus()
      return
    }

    const isDuplicateName = participants.some(
      (participant) => participant.name === result.data.name,
    )

    if (isDuplicateName) {
      setErrorMessage(PARTICIPANT_NAME_DUPLICATE_MESSAGE)
      participantNameInputRef.current?.focus()
      return
    }

    addParticipant(result.data.name)
    setNewParticipantName('')
    setErrorMessage(null)
  }

  /** 삭제 확인 다이얼로그에서 확인을 누르면 실제로 참여자를 제거 */
  const handleConfirmDeleteParticipant = () => {
    if (pendingDeleteParticipant) {
      removeParticipant(pendingDeleteParticipant.id)
    }
    setPendingDeleteParticipant(null)
  }

  const handleNameInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddParticipant()
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 pb-28">
      <p className="text-xs text-muted-foreground">
        입력한 정보는 이 브라우저에만 저장돼요. 다른 기기·브라우저와는 공유되지 않으니, 정산이
        끝나면 결과를 이미지로 저장해두세요.
      </p>

      <div className="space-y-2.5">
        <Label htmlFor="session-name">모임 이름</Label>
        <Input
          id="session-name"
          value={sessionName}
          onChange={(event) => updateSessionName(event.target.value)}
          placeholder="모임 이름을 입력하세요 (선택)"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="participant-name">참여자</Label>
        <div className="flex gap-2">
          <Input
            id="participant-name"
            ref={participantNameInputRef}
            value={newParticipantName}
            onChange={(event) => setNewParticipantName(event.target.value)}
            onKeyDown={handleNameInputKeyDown}
            placeholder="이름을 입력하고 추가하세요"
            disabled={isMaxCountReached}
            aria-invalid={errorMessage !== null}
            aria-describedby={errorMessage !== null ? 'participant-name-error' : undefined}
          />
          <Button
            type="button"
            className="h-10"
            disabled={isMaxCountReached}
            onClick={handleAddParticipant}
          >
            추가
          </Button>
        </div>
        {errorMessage !== null ? (
          <p id="participant-name-error" className="text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </div>

      {participants.length === 0 ? (
        <EmptyState
          title="참여자가 없어요"
          description="정산을 시작하려면 참여자를 2명 이상 추가해주세요."
        />
      ) : (
        <ul className="flex flex-wrap gap-2">
          {participants.map((participant) => {
            const isReferenced = isParticipantReferenced(
              { expenses, expenseShares },
              participant.id,
            )

            return (
              <li key={participant.id}>
                <ParticipantChip
                  name={participant.name}
                  isRemovable
                  isDisabled={isReferenced}
                  disabledReason={isReferenced ? PARTICIPANT_REFERENCED_MESSAGE : undefined}
                  onRemove={() => setPendingDeleteParticipant(participant)}
                />
              </li>
            )
          })}
        </ul>
      )}

      {participants.length > 0 && !isNextEnabled ? (
        <p className="text-sm text-muted-foreground">
          참여자를 {MIN_PARTICIPANTS_COUNT}명 이상 등록해야 다음 단계로 진행할 수 있어요.
        </p>
      ) : null}

      {isMaxCountReached ? (
        <p className="text-sm text-muted-foreground">{PARTICIPANT_MAX_COUNT_MESSAGE}</p>
      ) : null}

      <ConfirmDialog
        isOpen={pendingDeleteParticipant !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPendingDeleteParticipant(null)
          }
        }}
        title={`${pendingDeleteParticipant?.name ?? ''} 삭제`}
        description="삭제하면 되돌릴 수 없어요. 이 참여자를 삭제할까요?"
        confirmLabel="삭제"
        onConfirm={handleConfirmDeleteParticipant}
      />

      <BottomActionBar>
        <Button
          type="button"
          className="h-10 w-full"
          disabled={!isNextEnabled}
          onClick={() => navigate('/expenses')}
        >
          다음
        </Button>
      </BottomActionBar>
    </div>
  )
}

export default ParticipantRegisterPage
