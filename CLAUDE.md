# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**split-bill**은 "가입도 서버도 없이, 복잡한 모임 지출을 그 자리에서 정산해 이미지 한 장으로 공유하는 로컬 전용 더치페이 계산기"이다 (`docs/PRD.md`).

- 백엔드/서버/DB/인증이 전혀 없다. 모든 상태는 브라우저 localStorage(Zustand `persist`)에만 존재한다. 로그인, 서버 API, 정산방 공유 링크 같은 작업은 절대 만들지 않는다.
- **필독**: `docs/PRD.md`(기능 명세·데이터 모델·계산 규칙), `docs/ROADMAP.md`(Task 순서·개발 워크플로우 규칙). 작업 전 반드시 확인한다.

## 현재 상태 (중요)

코드베이스는 아직 Vite 기본 스캐폴드 그대로다 (`src/App.tsx`는 카운터 데모, `pages/`·`components/`·`store/` 등 미생성). `docs/ROADMAP.md`의 Task 001(Phase 1: 프로젝트 초기 설정)부터 순서대로 진행해야 하며, 예정된 의존성(`react-router`, `zustand`, `react-hook-form`, `zod`, `lucide-react`, `html-to-image`, `tailwindcss` 등)은 아직 설치되지 않았다.

## 명령어

- `npm run dev` — 개발 서버
- `npm run build` — `tsc -b && vite build` (타입체크 겸함, 별도 typecheck 스크립트 없음)
- `npm run lint` — ESLint (flat config, `dist` 제외)
- `npm run preview` — 빌드 결과 미리보기

단위테스트 프레임워크(jest/vitest)는 없다. 비즈니스 로직 검증은 **Playwright MCP**로 `npm run dev` 서버를 띄운 뒤 브라우저 자동화 시나리오로 수행한다 (아래 개발 워크플로우 참고).

## 아키텍처 (예정 — `docs/ROADMAP.md` Task 001 기준)

- **라우팅**: React Router 7 `createBrowserRouter`. `/`(참여자 등록) → `/expenses`(지출 내역) → `/expenses/new`, `/expenses/:expenseId` → `/result`(정산 결과, 이미지 다운로드로 종료).
- **상태관리**: Zustand + `persist` 미들웨어, localStorage에 세션 자동 저장/복원. 스토어 상태: `session`, `participants`, `expenses`, `expenseShares`.
- **데이터 모델** (`docs/PRD.md` 기준, 전부 하나의 세션 JSON):
  - `Session { id, name, createdAt }`
  - `Participant { id, name }`
  - `Expense { id, title, amount, payerId, splitType: 'equal' | 'custom' }`
  - `ExpenseShare { id, expenseId, participantId, amount }`
- **폼/검증**: React Hook Form 7 + Zod(`zodResolver`).
- **이미지 생성**: `html2canvas-pro`(`<foreignObject>` 미사용, DOM을 iframe으로 복제해 캔버스에 직접 그림)로 정산 결과 DOM → PNG 다운로드. `html-to-image`/`modern-screenshot`은 iOS Safari의 `<foreignObject>` 래스터화 문제로 Task 029에서 교체됨. `scale` 옵션을 1보다 크게 주면 카드 배경이 사라지는 라이브러리 자체 버그가 있어 `scale: 1`로 캡처 후 캔버스로 업스케일한다(`src/lib/image.ts`).
- **스타일링/UI**: TailwindCSS v4(설정파일 없는 CSS-in-CSS 방식, `tailwind.config` 없음) + shadcn/ui + Lucide React. **모바일 화면 전용 제작(태블릿/데스크톱 대응 제외), 다크모드 미지원(라이트 모드 전용)** — UI 작업 시 반드시 준수한다.
- **배포**: Vercel (완전 정적 SPA 빌드, 백엔드 없음).

## 핵심 비즈니스 규칙 (`docs/PRD.md` 인용, 구현 시 반드시 준수)

- 지출 항목은 부담 참여자를 최소 1명 이상 선택해야 저장 가능.
- **균등 배분**: `amount = 지출 금액 ÷ 부담 인원수`, 원 단위 정수로 소수점 이하 내림 처리. 나눗셈 나머지는 결제자가 추가 부담.
- **항목별 배분**: 참여자별 `amount`를 직접 입력하며, 합계가 `Expense.amount`와 정확히 일치해야 저장 가능.
- **참조 무결성**: `Expense.payerId` 또는 `ExpenseShare.participantId`로 참조 중인 참여자는 삭제 불가.
- 정산 결과는 참여자별 순잔액을 계산한 뒤 **최소 송금 횟수**로 정리해서 도출 (`lib/settlement.ts` 예정 — `calculateBalances`, `calculateSettlements`).

## 개발 워크플로우 (`docs/ROADMAP.md` 규칙)

- 새 작업은 `docs/ROADMAP.md`에서 마지막 완료 작업 다음에 추가하고, 완료 시 ✅로 표시한다.
- 배분 계산·정산 알고리즘·참조 무결성·localStorage 영속화 등 **비즈니스 로직 작업에는 "테스트 체크리스트" 섹션(Playwright MCP 시나리오)이 필수**이며, 구현 후 반드시 Playwright MCP로 검증한다.
- 각 단계 완료 후에는 중단하고 추가 지시를 기다리는 것이 프로젝트 워크플로우 관례다.

## MVP 범위 밖 (구현하지 않음)

회원가입/로그인, 정산방 링크 공유·실시간 협업, 히스토리 저장, 영수증 첨부, 퍼센트/가중치 배분·복수 결제자, 송금 완료 체크/알림, 다중 통화, 참여자 프로필/아바타. 관련 Task를 임의로 만들지 않는다.
