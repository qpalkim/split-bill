import { useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import BottomActionBar from '@/components/common/BottomActionBar'
import EmptyState from '@/components/common/EmptyState'
import ParticipantChip from '@/components/common/ParticipantChip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MIN_PARTICIPANTS_COUNT } from '@/constants/validation'
import { generateId } from '@/lib/id'
import { dummyParticipants, dummySession } from '@/mocks/dummy-session'
import type { Participant } from '@/types'

/** 참여자 등록 페이지(/) */
function ParticipantRegisterPage() {
  const navigate = useNavigate()
  const [sessionName, setSessionName] = useState(dummySession.name)
  const [participants, setParticipants] = useState<Participant[]>(dummyParticipants)
  const [newParticipantName, setNewParticipantName] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isNextEnabled = participants.length >= MIN_PARTICIPANTS_COUNT

  /** 입력값을 검증해 참여자 명단에 추가 */
  const addParticipant = () => {
    const trimmedName = newParticipantName.trim()

    if (trimmedName === '') {
      setErrorMessage('참여자 이름을 입력해주세요.')
      return
    }

    setParticipants((prev) => [...prev, { id: generateId(), name: trimmedName }])
    setNewParticipantName('')
    setErrorMessage(null)
  }

  /** id에 해당하는 참여자를 명단에서 제거 */
  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((participant) => participant.id !== id))
  }

  const handleNameInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addParticipant()
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 pb-28">
      <div className="space-y-1.5">
        <Label htmlFor="session-name">모임 이름</Label>
        <Input
          id="session-name"
          value={sessionName}
          onChange={(event) => setSessionName(event.target.value)}
          placeholder="모임 이름을 입력하세요 (선택)"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="participant-name">참여자</Label>
        <div className="flex gap-2">
          <Input
            id="participant-name"
            value={newParticipantName}
            onChange={(event) => setNewParticipantName(event.target.value)}
            onKeyDown={handleNameInputKeyDown}
            placeholder="이름을 입력하고 추가하세요"
            aria-invalid={errorMessage !== null}
            aria-describedby={errorMessage !== null ? 'participant-name-error' : undefined}
          />
          <Button type="button" onClick={addParticipant}>
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
          {participants.map((participant) => (
            <li key={participant.id}>
              <ParticipantChip
                name={participant.name}
                isRemovable
                onRemove={() => removeParticipant(participant.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {participants.length > 0 && !isNextEnabled ? (
        <p className="text-sm text-muted-foreground">
          참여자를 {MIN_PARTICIPANTS_COUNT}명 이상 등록해야 다음 단계로 진행할 수 있어요.
        </p>
      ) : null}

      <BottomActionBar>
        <Button
          type="button"
          className="w-full"
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
