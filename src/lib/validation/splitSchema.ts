import { z } from 'zod'
import { MIN_EXPENSE_PAYERS_COUNT } from '@/constants/validation'
import {
  SPLIT_AMOUNT_SUM_MISMATCH_MESSAGE,
  SPLIT_PAYERS_REQUIRED_MESSAGE,
} from '@/constants/message'

/**
 * 지출 항목의 배분 방식(splitType)별 부담자/금액 검증 스키마.
 * splitType이 'custom'일 때만 superRefine으로 부담 금액 합계가 amount와 정확히 일치하는지 검사한다.
 * splitType이 'equal'일 때는 부담자 최소 인원만 검증하고 금액 합계는 검사하지 않는다(실제 배분액은 lib/settlement.ts에서 계산).
 */
export const splitSchema = z
  .object({
    amount: z.number().int().positive(),
    splitType: z.enum(['equal', 'custom']),
    shares: z
      .array(
        z.object({
          participantId: z.string().min(1),
          amount: z.number().int().nonnegative(),
        }),
      )
      .min(MIN_EXPENSE_PAYERS_COUNT, SPLIT_PAYERS_REQUIRED_MESSAGE),
  })
  .superRefine((value, ctx) => {
    if (value.splitType !== 'custom') {
      return
    }

    const shareSum = value.shares.reduce((sum, share) => sum + share.amount, 0)

    if (shareSum !== value.amount) {
      ctx.addIssue({
        code: 'custom',
        message: SPLIT_AMOUNT_SUM_MISMATCH_MESSAGE,
        path: ['shares'],
      })
    }
  })

export type SplitFormValues = z.infer<typeof splitSchema>
