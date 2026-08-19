interface AppHeaderProps {
  /** 진행 중인 모임 이름(선택, Phase3에서 스토어 값 주입 예정) */
  sessionName?: string
}

/** 로고와 모임 이름을 보여주는 공통 상단 헤더 */
function AppHeader({ sessionName }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
      <span className="text-lg font-bold text-foreground">split-bill</span>
      {sessionName ? (
        <span className="max-w-[45%] truncate text-sm text-muted-foreground">
          {sessionName}
        </span>
      ) : null}
    </header>
  )
}

export default AppHeader
