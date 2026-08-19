import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type FieldValues, type Resolver, type UseFormProps } from 'react-hook-form'
import type { z } from 'zod'

/**
 * Zod 스키마 기반 zodResolver를 미리 연결한 React Hook Form 공통 훅.
 *
 * 폼 필드 에러 표시 규칙(컴포넌트 작성 관례):
 * - 입력 요소에는 항상 `aria-invalid={!!fieldState.error}`를 적용한다.
 * - 에러 메시지 요소에는 `id={`${fieldName}-error`}`를 부여하고,
 *   입력 요소에는 `aria-describedby={fieldState.error ? `${fieldName}-error` : undefined}`를 적용한다.
 * - src/components/ui/form.tsx의 FormControl/FormMessage가 이 규칙을 자동으로 적용해준다.
 */
export function useZodForm<TSchema extends z.ZodType<FieldValues>>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>,
) {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema as never) as unknown as Resolver<z.infer<TSchema>>,
    ...options,
  })
}
