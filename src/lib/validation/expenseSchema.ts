import { z } from 'zod'
import { MAX_EXPENSE_AMOUNT } from '@/constants/validation'
import {
  EXPENSE_AMOUNT_MAX_MESSAGE,
  EXPENSE_AMOUNT_POSITIVE_MESSAGE,
  EXPENSE_PAYER_REQUIRED_MESSAGE,
  EXPENSE_TITLE_REQUIRED_MESSAGE,
} from '@/constants/message'

/** 지출 항목 기본 정보(항목명/금액/결제자) 검증 스키마 */
export const expenseSchema = z.object({
  title: z.string().trim().min(1, EXPENSE_TITLE_REQUIRED_MESSAGE),
  amount: z
    .number()
    .int()
    .positive(EXPENSE_AMOUNT_POSITIVE_MESSAGE)
    .max(MAX_EXPENSE_AMOUNT, EXPENSE_AMOUNT_MAX_MESSAGE),
  payerId: z.string().min(1, EXPENSE_PAYER_REQUIRED_MESSAGE),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>
