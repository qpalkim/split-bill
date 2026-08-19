import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { FieldErrors } from 'react-hook-form'
import { toast } from 'sonner'
import BottomActionBar from '@/components/common/BottomActionBar'
import CurrencyInput from '@/components/common/CurrencyInput'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useZodForm } from '@/hooks/useZodForm'
import { formatCurrency } from '@/lib/format'
import { calculateEqualShares } from '@/lib/split'
import { expenseSchema, type ExpenseFormValues } from '@/lib/validation/expenseSchema'
import { splitSchema } from '@/lib/validation/splitSchema'
import { useSessionStore } from '@/store/useSessionStore'
import type { SplitType } from '@/types'

/** 지출 추가(/expenses/new)·수정(/expenses/:expenseId) 공용 페이지 */
function ExpenseFormPage() {
  const navigate = useNavigate()
  const { expenseId } = useParams()
  const isEditMode = expenseId !== undefined

  const participants = useSessionStore((state) => state.participants)
  const expenses = useSessionStore((state) => state.expenses)
  const expenseShares = useSessionStore((state) => state.expenseShares)
  const addExpense = useSessionStore((state) => state.addExpense)
  const updateExpense = useSessionStore((state) => state.updateExpense)
  const setSharesForExpense = useSessionStore((state) => state.setSharesForExpense)

  const existingExpense = isEditMode
    ? expenses.find((expense) => expense.id === expenseId)
    : undefined
  const existingShares = existingExpense
    ? expenseShares.filter((share) => share.expenseId === existingExpense.id)
    : []

  /** 존재하지 않는 expenseId로 진입하면 지출 내역 페이지로 되돌린다 */
  useEffect(() => {
    if (isEditMode && existingExpense === undefined) {
      navigate('/expenses', { replace: true })
    }
  }, [isEditMode, existingExpense, navigate])

  const form = useZodForm(expenseSchema, {
    defaultValues: {
      title: existingExpense?.title ?? '',
      amount: existingExpense?.amount ?? 0,
      payerId: existingExpense?.payerId ?? '',
    },
  })

  const [splitType, setSplitType] = useState<SplitType>(existingExpense?.splitType ?? 'equal')
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>(
    existingShares.length > 0
      ? existingShares.map((share) => share.participantId)
      : participants.map((participant) => participant.id),
  )
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>(
    Object.fromEntries(existingShares.map((share) => [share.participantId, share.amount])),
  )
  const [splitErrorMessage, setSplitErrorMessage] = useState<string | null>(null)

  const titleFieldRef = useRef<HTMLDivElement>(null)
  const amountFieldRef = useRef<HTMLDivElement>(null)
  const payerFieldRef = useRef<HTMLDivElement>(null)
  const splitSectionRef = useRef<HTMLDivElement>(null)

  const amount = form.watch('amount')
  const payerId = form.watch('payerId')

  /** 검증 실패 시 우선순위(title→amount→payerId)에 따라 첫 오류 필드로 스크롤·포커스 이동 */
  const scrollToFirstError = (errors: FieldErrors<ExpenseFormValues>) => {
    if (errors.title) {
      titleFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      form.setFocus('title')
      return
    }
    if (errors.amount) {
      amountFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    if (errors.payerId) {
      payerFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  /** 부담자 체크박스 선택/해제 */
  const toggleParticipant = (participantId: string) => {
    setSelectedParticipantIds((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId],
    )
  }

  const customAmountSum = selectedParticipantIds.reduce(
    (sum, participantId) => sum + (customAmounts[participantId] ?? 0),
    0,
  )
  const customAmountDiff = amount - customAmountSum

  /** 검증 통과 시 지출 항목을 저장 */
  const handleValidSubmit = (values: ExpenseFormValues) => {
    const shares = selectedParticipantIds.map((participantId) => ({
      participantId,
      amount: splitType === 'custom' ? (customAmounts[participantId] ?? 0) : 0,
    }))

    const splitResult = splitSchema.safeParse({
      amount: values.amount,
      splitType,
      shares,
    })

    if (!splitResult.success) {
      setSplitErrorMessage(splitResult.error.issues[0]?.message ?? '배분 정보를 확인해주세요.')
      splitSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSplitErrorMessage(null)

    const sharesToSave =
      splitType === 'equal'
        ? calculateEqualShares(values.amount, selectedParticipantIds, values.payerId)
        : selectedParticipantIds.map((participantId) => ({
            participantId,
            amount: customAmounts[participantId] ?? 0,
          }))

    let savedExpenseId: string

    if (isEditMode && existingExpense) {
      updateExpense(existingExpense.id, {
        title: values.title,
        amount: values.amount,
        payerId: values.payerId,
        splitType,
      })
      savedExpenseId = existingExpense.id
    } else {
      savedExpenseId = addExpense({
        title: values.title,
        amount: values.amount,
        payerId: values.payerId,
        splitType,
      })
    }

    setSharesForExpense(savedExpenseId, sharesToSave)

    toast.success(isEditMode ? '지출 항목이 수정되었습니다.' : '지출 항목이 추가되었습니다.')
    navigate('/expenses')
  }

  /** 폼 제출 시점에만 handleSubmit을 호출해 렌더링 중 ref 접근을 피한다 */
  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    void form.handleSubmit(handleValidSubmit, scrollToFirstError)(event)
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 px-4 py-4 pb-28">
      <div ref={titleFieldRef} className="space-y-2.5">
        <Label htmlFor="title">항목명</Label>
        <Input
          id="title"
          placeholder="예: 저녁 식사"
          aria-invalid={!!form.formState.errors.title}
          aria-describedby={form.formState.errors.title ? 'title-error' : undefined}
          {...form.register('title')}
        />
        {form.formState.errors.title ? (
          <p id="title-error" className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        ) : null}
      </div>

      <div ref={amountFieldRef} className="space-y-2.5">
        <Label htmlFor="amount">금액</Label>
        <CurrencyInput
          id="amount"
          value={amount}
          onValueChange={(nextAmount) => form.setValue('amount', nextAmount, { shouldValidate: true })}
          placeholder="금액을 입력하세요"
        />
        {form.formState.errors.amount ? (
          <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
        ) : null}
      </div>

      <div ref={payerFieldRef} className="space-y-2.5">
        <Label htmlFor="payer">결제자</Label>
        <Select
          value={payerId === '' ? null : payerId}
          onValueChange={(nextPayerId) =>
            form.setValue('payerId', nextPayerId ?? '', { shouldValidate: true })
          }
        >
          <SelectTrigger id="payer" className="w-full">
            <SelectValue placeholder="결제자를 선택하세요">
              {(value: string | null) =>
                participants.find((participant) => participant.id === value)?.name ?? null
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {participants.map((participant) => (
              <SelectItem key={participant.id} value={participant.id}>
                {participant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.payerId ? (
          <p className="text-sm text-destructive">{form.formState.errors.payerId.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>배분 방식</Label>
        <RadioGroup
          value={splitType}
          onValueChange={(value) => setSplitType(value as SplitType)}
          className="grid-flow-col justify-start gap-4"
        >
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <RadioGroupItem value="equal" />
            균등 배분
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <RadioGroupItem value="custom" />
            항목별 배분
          </label>
        </RadioGroup>
      </div>

      <div ref={splitSectionRef} className="space-y-2">
        <Label>부담자</Label>
        <ul className="flex flex-col gap-1">
          {participants.map((participant) => {
            const isChecked = selectedParticipantIds.includes(participant.id)

            return (
              <li key={participant.id} className="flex min-h-11 items-center justify-between gap-2">
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleParticipant(participant.id)}
                  />
                  {participant.name}
                </label>
                {splitType === 'custom' && isChecked ? (
                  <CurrencyInput
                    value={customAmounts[participant.id] ?? 0}
                    onValueChange={(nextAmount) =>
                      setCustomAmounts((prev) => ({ ...prev, [participant.id]: nextAmount }))
                    }
                    className="w-32"
                  />
                ) : null}
              </li>
            )
          })}
        </ul>

        {splitType === 'equal' ? (
          <p className="text-sm text-muted-foreground">
            선택한 {selectedParticipantIds.length}명이 금액을 균등하게 나눠 부담해요.
          </p>
        ) : (
          <p
            className={
              customAmountDiff === 0 ? 'text-sm text-muted-foreground' : 'text-sm text-destructive'
            }
          >
            합계 {formatCurrency(customAmountSum)} · 차액 {formatCurrency(customAmountDiff)}
          </p>
        )}

        {splitErrorMessage !== null ? (
          <p className="text-sm text-destructive">{splitErrorMessage}</p>
        ) : null}
      </div>

      <BottomActionBar>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1"
            onClick={() => navigate('/expenses')}
          >
            지출 내역으로 돌아가기
          </Button>
          <Button type="submit" className="h-10 flex-1">
            저장
          </Button>
        </div>
      </BottomActionBar>
    </form>
  )
}

export default ExpenseFormPage
