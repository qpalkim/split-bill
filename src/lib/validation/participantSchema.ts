import { z } from 'zod'
import { PARTICIPANT_NAME_REQUIRED_MESSAGE } from '@/constants/message'

/** 참여자 이름 입력 검증 스키마(공백 제거 후 최소 1자 이상) */
export const participantSchema = z.object({
  name: z.string().trim().min(1, PARTICIPANT_NAME_REQUIRED_MESSAGE),
})

export type ParticipantFormValues = z.infer<typeof participantSchema>
