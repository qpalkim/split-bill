import { useLocation } from 'react-router'
import { cn } from '@/lib/utils'

interface Step {
  order: 1 | 2 | 3
  label: string
}

const STEPS: Step[] = [
  { order: 1, label: '참여자' },
  { order: 2, label: '지출' },
  { order: 3, label: '정산' },
]

/** pathname을 기준으로 현재 진행 단계(1~3)를 계산 */
function getActiveStep(pathname: string): 1 | 2 | 3 {
  if (pathname.startsWith('/expenses')) return 2
  if (pathname === '/result') return 3
  return 1
}

/** 참여자 → 지출 → 정산 3단계 진행 상태를 보여주는 인디케이터 */
function StepIndicator() {
  const { pathname } = useLocation()
  const activeStep = getActiveStep(pathname)

  return (
    <ol
      className="flex items-center justify-center gap-2 border-b border-border px-4 py-3"
      aria-label="정산 진행 단계"
    >
      {STEPS.map((step, index) => (
        <li key={step.order} className="flex items-center gap-2">
          <span
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
              step.order === activeStep
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground',
            )}
            aria-current={step.order === activeStep ? 'step' : undefined}
          >
            {step.order}
          </span>
          <span
            className={cn(
              'text-xs',
              step.order === activeStep
                ? 'font-semibold text-foreground'
                : 'text-muted-foreground',
            )}
          >
            {step.label}
          </span>
          {index < STEPS.length - 1 ? (
            <span className="mx-1 h-px w-4 bg-border" aria-hidden="true" />
          ) : null}
        </li>
      ))}
    </ol>
  )
}

export default StepIndicator
