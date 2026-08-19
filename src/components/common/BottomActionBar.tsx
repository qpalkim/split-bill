import type { PropsWithChildren } from 'react'

/** 화면 하단에 고정되는 액션 버튼 영역(safe-area-inset-bottom 대응) */
function BottomActionBar({ children }: PropsWithChildren) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[430px] border-t border-border bg-background px-4 pt-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
    >
      {children}
    </div>
  )
}

export default BottomActionBar
