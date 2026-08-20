# split-bill 개발 로드맵

가입도 서버도 없이, 복잡한 모임 지출을 그 자리에서 정산해 이미지 한 장으로 공유하는 로컬 전용 더치페이 계산기

## 개요

split-bill은 인원이 많거나 지출 항목이 복잡해 정산 계산이 번거로운 **모임 총무**를 위한 **백엔드 없는 1회성 로컬 정산 도구**로 다음 기능을 제공합니다:

- **참여자 등록 (F001)**: 모임 이름(선택)과 참여자 명단을 입력해 정산 세션을 시작
- **지출 항목 입력 및 배분 방식 지정 (F002, F003)**: 항목명·금액·결제자 등록, 균등 배분 / 항목별 배분 중 선택
- **지출 항목 목록 관리 (F004)**: 등록된 지출 항목 조회·수정·삭제
- **정산 결과 자동 계산 (F005)**: 참여자별 순잔액을 산출해 최소 송금 횟수의 "누가 누구에게 얼마" 결과 도출
- **정산 결과 이미지 다운로드 (F006)**: 결과 화면을 PNG로 저장해 메신저로 공유
- **로컬 자동 저장 (F007)**: Zustand `persist`로 localStorage에 자동 저장, 새로고침 후 복원

### 프로젝트 제약 조건 (필독)

> - **백엔드/서버/DB가 없습니다.** 모든 데이터는 브라우저 localStorage에만 존재합니다.
> - **인증/회원가입/권한 시스템이 없습니다.** 관련 Task를 생성하지 않습니다.
> - **API 연동이 없습니다.** 따라서 Playwright MCP 테스트는 API가 아닌 **클라이언트 비즈니스 로직(배분 계산, 정산 알고리즘, 참조 무결성, 로컬 영속화)** 검증에 사용합니다.
> - 정산방 링크 공유, 히스토리 보관, 다중 통화, 영수증 첨부는 MVP 범위 밖입니다.

### 기술 스택

| 구분            | 기술                                                        |
| --------------- | ----------------------------------------------------------- |
| 빌드/프레임워크 | Vite 8, React 19, TypeScript 6                              |
| 라우팅          | React Router 7 (SPA 클라이언트 라우팅)                      |
| 스타일링/UI     | TailwindCSS v4(설정파일 없는 엔진), shadcn/ui, Lucide React |
| 폼/검증         | React Hook Form 7.x, Zod                                    |
| 상태/영속화     | Zustand + `persist` 미들웨어 (localStorage)                 |
| 이미지 생성     | html-to-image                                               |
| 배포            | Vercel (정적 SPA)                                           |
| 패키지 관리     | npm                                                         |

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **비즈니스 로직(배분 계산·정산 알고리즘·참조 무결성·localStorage 영속화) 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 새 작업의 문서에는 빈 박스만 있어야 하며 변경 사항 요약이 없어야 함

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **정산 계산 로직 등 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행 (`npm run dev` 기동 후 로컬 주소로 검증)
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 프로젝트 초기 설정 (골격 구축)

> 실제 기능 구현 전에 **라우트·타입·상태 골격**을 먼저 완성해 전체 앱 플로우를 즉시 체험 가능하게 만드는 단계. 서버/DB 관련 작업은 존재하지 않음.

- **Task 001: 개발 환경 및 프로젝트 스캐폴드 정리** ✅ - 우선순위
  - Vite 기본 템플릿 잔여물 제거 (`App.css`, `src/assets/react.svg`, `vite.svg`, 데모 카운터 코드)
  - 필수 의존성 설치: `react-router`, `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers`, `lucide-react`, `html-to-image`
  - `vite.config.ts` + `tsconfig.app.json`에 `@/*` → `src/*` 경로 별칭 설정
  - `src/` 디렉터리 구조 확정: `pages/`, `components/ui/`, `components/common/`, `layouts/`, `store/`, `types/`, `lib/`, `hooks/`, `constants/`
  - ESLint 규칙 점검 및 `npm run lint`, `npm run build` 무오류 통과 확인
  - `index.html` 메타 정보(title, lang="ko", description, favicon) 설정

- **Task 002: TailwindCSS v4 및 shadcn/ui 초기 셋업** ✅
  - `tailwindcss` + `@tailwindcss/vite` 플러그인 설치 및 Vite 플러그인 등록
  - `src/index.css`에 `@import "tailwindcss"` 및 `@theme` 기반 디자인 토큰(컬러/폰트/라운드) 정의
  - shadcn/ui 초기화(`components.json`) 및 기본 프리미티브 추가: `button`, `input`, `card`, `label`
  - 다크모드 미지원(라이트 모드 전용) 확정 및 기본 라이트 팔레트만 정의
  - Lucide React 아이콘 사용 규칙 및 공통 사이즈 상수 정의
  - 폰트(Pretendard 등) 적용 및 금액 표기용 tabular-nums 유틸 정의

- **Task 003: 라우팅 구조 및 빈 페이지 골격 생성** ✅
  - React Router 7 `createBrowserRouter` 기반 라우터 구성 및 `main.tsx` 연결
  - 라우트 정의: `/`(참여자 등록), `/expenses`(지출 내역), `/expenses/new`(지출 추가), `/expenses/:expenseId`(지출 수정), `/result`(정산 결과)
  - 각 페이지의 빈 껍데기 컴포넌트 생성 (제목 + 다음 단계 이동 버튼만 배치)
  - 루트 레이아웃(`RootLayout`) 골격 및 `<Outlet />` 배치
  - 404 Not Found 페이지 및 라우트 에러 바운더리 골격 생성
  - Vercel SPA 리라이트를 고려한 라우팅 방식(History API) 확정

- **Task 004: 도메인 타입 및 상수 정의** ✅
  - `src/types/session.ts`: `Session`(id, name, createdAt) 인터페이스 정의
  - `src/types/participant.ts`: `Participant`(id, name) 인터페이스 정의
  - `src/types/expense.ts`: `Expense`(id, title, amount, payerId, splitType) 및 `SplitType` 유니온(`'equal' | 'custom'`) 정의
  - `src/types/expense-share.ts`: `ExpenseShare`(id, expenseId, participantId, amount) 인터페이스 정의
  - 정산 결과 파생 타입 정의: `ParticipantBalance`(participantId, paidAmount, owedAmount, netBalance), `Settlement`(fromId, toId, amount)
  - `src/constants/`에 검증 상수 정의 (최소 참여자 2명, 항목당 최소 부담자 1명, 최대 금액 등)
  - `any` 타입 사용 금지 원칙 및 타입 배럴 파일(`src/types/index.ts`) 구성

- **Task 005: Zustand 스토어 골격 설계** ✅
  - `src/store/useSessionStore.ts` 생성 및 `persist` 미들웨어 골격 구성 (실제 연동은 Phase 3)
  - 스토어 상태 형태 확정: `session`, `participants`, `expenses`, `expenseShares`
  - 액션 시그니처만 선언: `createSession`, `addParticipant`, `removeParticipant`, `addExpense`, `updateExpense`, `removeExpense`, `resetSession`
  - localStorage 스토리지 키(`split-bill-session`) 및 `version`/`migrate` 전략 정의
  - 셀렉터 유틸 골격 작성 (`selectParticipantById`, `selectSharesByExpenseId`)
  - 스토어 단위 책임 분리 원칙 문서화 (계산 로직은 스토어가 아닌 `lib/`에 위치)

### Phase 2: 공통 모듈/컴포넌트 개발

> 더미 데이터만으로 **전체 화면과 사용자 플로우를 완성**하는 단계. 상태/계산 로직 없이 UI팀 단독 진행이 가능하도록 구성.

- **Task 006: 공통 레이아웃 및 네비게이션 구현** ✅
  - 앱 헤더(서비스 로고, 모임 이름 표시 영역) 구현
  - 3단계 진행 상태를 보여주는 스텝 인디케이터(참여자 → 지출 → 정산) 구현
  - 페이지 하단 고정 액션 바(주요 CTA 배치) 컴포넌트 구현
  - 모바일 전용(max-width 컨테이너 고정, 태블릿/데스크톱 대응 없음) 레이아웃 골격 및 safe-area 대응
  - 페이지 전환 시 스크롤 최상단 복원 처리

- **Task 007: 공통 유틸리티 및 더미 데이터 구축** ✅
  - `lib/format.ts`: 원화 포맷터(`formatCurrency`), 숫자 파싱(`parseAmount`) 구현
  - `lib/id.ts`: `crypto.randomUUID` 기반 ID 생성기 구현 (미지원 환경 폴백 포함)
  - `lib/date.ts`: 세션 생성 일시 포맷 유틸 구현
  - `mocks/dummy-session.ts`: 참여자 5명 + 지출 6건(균등/항목별 혼합) 더미 데이터 작성
  - 더미 데이터 주입 방식 정의 (Phase 3에서 스토어로 교체 가능한 인터페이스 유지)
  - 각 함수에 한국어 JSDoc 주석 추가

- **Task 008: shadcn/ui 기반 공통 컴포넌트 라이브러리 구성** ✅
  - 폼 관련 프리미티브 추가: `form`, `select`, `checkbox`, `radio-group`, `textarea`
  - 피드백 컴포넌트 추가: `dialog`, `alert-dialog`, `sonner`(토스트), `skeleton`, `badge`, `separator`
  - 도메인 공통 컴포넌트 구현: `ParticipantChip`, `AmountText`, `EmptyState`, `ConfirmDialog`, `PageHeader`
  - 금액 입력 전용 컴포넌트 `CurrencyInput` 구현 (숫자만 입력, 천 단위 콤마 표시)
  - 도메인 공통 컴포넌트도 shadcn/ui 프리미티브를 조합해 구성하고 커스텀 스타일링은 최소화
  - 컴포넌트 네이밍/props 규칙 정리 (PascalCase 컴포넌트, boolean은 `is`/`has` 접두사)

- **Task 009: 폼 모듈 및 Zod 검증 스키마 작성** ✅
  - React Hook Form + `zodResolver` 공통 셋업 및 폼 래퍼 훅 작성
  - `participantSchema`: 이름 필수·공백 불가·중복 이름 경고, 명단 최소 2명 검증
  - `expenseSchema`: 항목명 필수, 금액 양의 정수, 결제자 필수, 부담자 최소 1명 검증
  - `splitSchema`: 배분 방식별 조건부 검증 (`custom` 선택 시 부담 금액 합계 = 총액 일치 `superRefine`)
  - 공통 에러 메시지 상수화 및 한국어 문구 통일
  - 폼 필드 에러 표시 규칙 및 접근성 속성(`aria-invalid`, `aria-describedby`) 적용

- **Task 010: 전체 페이지 UI 완성 (더미 데이터 기반)** ✅
  - 참여자 등록 페이지 UI: 모임 이름 입력, 참여자 추가 인풋, 명단 리스트, 삭제 버튼, "다음" CTA
  - 지출 내역 페이지 UI: 참여자 명단 요약, 지출 항목 카드 리스트(항목명/금액/결제자), "지출 추가" · "정산 결과 보기" CTA
  - 지출 항목 추가/수정 페이지 UI: 항목명·금액·결제자 필드, 배분 방식 토글, 균등 배분용 체크박스 리스트, 항목별 배분용 개별 금액 입력 리스트, 합계/차액 표시 영역
  - 정산 결과 페이지 UI: 참여자별 지출/부담 요약 테이블, 송금 내역 카드 리스트, "이미지로 다운로드" · "지출 내역으로 돌아가기" CTA
  - 빈 상태 UI 3종 (참여자 없음, 지출 없음, 정산 대상 없음) 배치
  - 전체 페이지 간 네비게이션 플로우 클릭 검증 (더미 상태 기준)

- **Task 011: 모바일 레이아웃 및 접근성 기준 적용** ✅
  - 모바일(360~430px) 전용 레이아웃 확정 (태블릿/데스크톱 대응은 범위에서 제외)
  - 긴 참여자 명단·지출 목록의 스크롤 및 텍스트 말줄임 처리
  - 터치 타깃 최소 44px 확보 및 하단 고정 CTA 겹침 방지
  - 키보드 탐색 순서, 포커스 링, 시맨틱 마크업(`ul`/`li`, `button`) 점검
  - 색상 대비(WCAG AA) 및 금액 강조 색상 검증
  - 주요 브레이크포인트별 스크린샷 확인

### Phase 3: 핵심 기능 개발

> 더미 데이터를 실제 Zustand 상태로 교체하고 **F001~F005, F007의 비즈니스 로직**을 구현하는 단계. 계산 규칙 정확도가 서비스의 핵심 가치.

- **Task 012: Zustand persist 실연동 및 세션 상태 관리 구현 (F007)** ✅ - 우선순위
  - `useSessionStore`에 `persist` 미들웨어 실제 적용 (localStorage, 키 `split-bill-session`)
  - 모든 CRUD 액션 구현 및 상태 불변성 보장
  - 앱 최초 진입 시 세션 자동 생성, 기존 세션 존재 시 자동 복원 로직 구현
  - `partialize`로 저장 대상 상태 선별 및 `version`/`migrate` 처리
  - hydration 완료 전 깜빡임 방지 처리 (`onRehydrateStorage` + `isHydrated` 플래그)
  - localStorage 접근 실패(시크릿 모드/용량 초과) 시 폴백 및 안내 처리

  #### 테스트 체크리스트
  - [x] Playwright MCP: 참여자 입력 → 새로고침 → 명단이 그대로 복원되는지 확인 (Task025 전체 플로우 E2E 재검증에서 커버 확인)
  - [x] Playwright MCP: 지출 항목 등록 → 새로고침 → 목록·배분 정보 유지 확인 (Task025 전체 플로우 E2E 재검증에서 커버 확인)
  - [x] Playwright MCP: `browser_evaluate`로 localStorage `split-bill-session` 값의 구조/버전 검증
  - [x] Playwright MCP: localStorage를 강제로 비운 뒤 재진입 시 초기 상태로 정상 시작하는지 확인
  - [x] Playwright MCP: 잘못된 JSON을 localStorage에 주입했을 때 앱이 크래시하지 않고 복구되는지 확인

- **Task 013: 참여자 등록 기능 구현 (F001)** ✅
  - 모임 이름 입력 및 세션 반영 (선택 입력, 미입력 시 기본 표기)
  - 참여자 추가/삭제 액션 스토어 연동 및 입력 즉시 자동 저장
  - 최소 2명 이상 검증 및 미달 시 "다음" 버튼 비활성화
  - 참조 무결성 구현: `Expense.payerId` 또는 `ExpenseShare.participantId`로 참조 중인 참여자는 삭제 버튼 비활성화 + 사유 안내 문구 표시
  - 중복 이름 처리 규칙 적용 (동명이인 허용 시 구분 표시)
  - 검증 통과 시 지출 내역 페이지로 이동

  #### 테스트 체크리스트
  - [x] Playwright MCP: 참여자 1명만 입력한 상태에서 "다음" 버튼이 비활성화되는지 확인
  - [x] Playwright MCP: 참여자 2명 이상 입력 후 지출 내역 페이지로 이동되는지 확인
  - [x] Playwright MCP: 지출에서 결제자로 참조 중인 참여자의 삭제 버튼이 비활성화되고 안내 문구가 노출되는지 확인
  - [x] Playwright MCP: 부담자로만 참조 중인 참여자도 삭제가 차단되는지 확인
  - [x] Playwright MCP: 참조가 모두 제거된 뒤에는 해당 참여자 삭제가 가능해지는지 확인
  - [x] Playwright MCP: 공백만 입력한 이름이 거부되는지 확인

- **Task 014: 지출 항목 입력/수정 기능 구현 (F002)** ✅
  - 항목명·금액 입력 폼과 스토어 연동 (`addExpense`, `updateExpense`)
  - 결제자 선택 UI를 참여자 명단과 실시간 동기화
  - 추가 모드(`/expenses/new`)와 수정 모드(`/expenses/:expenseId`) 분기 및 기존 값 프리필
  - 금액 입력 정규화 (음수·소수·문자 차단, 원 단위 정수 저장)
  - 존재하지 않는 `expenseId` 접근 시 지출 내역 페이지로 리다이렉트
  - 저장 성공 시 지출 내역 페이지 복귀 및 토스트 피드백

  #### 테스트 체크리스트
  - [x] Playwright MCP: 항목명 미입력 시 저장이 차단되고 에러 메시지가 표시되는지 확인
  - [x] Playwright MCP: 금액 0 또는 음수 입력 시 검증 오류가 발생하는지 확인
  - [x] Playwright MCP: 기존 항목 클릭 → 값 프리필 → 수정 저장 후 목록에 반영되는지 확인 (Task025 전체 플로우 E2E 재검증에서 커버 확인)
  - [x] Playwright MCP: 잘못된 `expenseId` URL 직접 진입 시 리다이렉트되는지 확인

- **Task 015: 배분 방식 지정 로직 구현 (F003)** ✅
  - 배분 방식 토글(균등/항목별) 구현 및 전환 시 입력값 처리 규칙 적용
  - 균등 배분 계산기 `calculateEqualShares` 구현: `floor(금액 ÷ 부담 인원수)`를 각 부담자에게 배정, **나눗셈 나머지는 결제자가 추가 부담**
  - 결제자가 부담자에 포함되지 않은 경우의 나머지 처리 규칙 정의 및 구현
  - 항목별 배분 입력 UI: 부담자별 금액 입력, 실시간 합계·잔여 차액 표시
  - 항목별 배분 검증: 입력 합계가 `Expense.amount`와 **정확히 일치**해야 저장 가능
  - 공통 검증: 부담 참여자 0명 시 저장 차단
  - 배분 결과를 `ExpenseShare[]`로 생성/갱신하고 항목 삭제·수정 시 정합성 유지

  #### 테스트 체크리스트
  - [x] Playwright MCP: 10,000원 / 부담자 3명 균등 배분 시 각 3,333원, 나머지 1원이 결제자에게 가산되는지 확인
  - [x] Playwright MCP: 나누어떨어지는 금액(9,000원 / 3명)에서 나머지 가산이 발생하지 않는지 확인
  - [x] Playwright MCP: 부담자 미선택 상태에서 저장 버튼이 차단되는지 확인
  - [x] Playwright MCP: 항목별 배분에서 합계가 총액보다 적을 때/많을 때 각각 저장이 차단되고 차액이 표시되는지 확인
  - [x] Playwright MCP: 항목별 배분 합계를 총액과 일치시키면 저장이 성공하는지 확인
  - [x] Playwright MCP: 균등 → 항목별 전환 시 입력 상태가 규칙대로 초기화/이관되는지 확인
  - [x] 엣지 케이스: 부담자 1명(전액 부담), 금액 1원, 참여자 20명 대량 배분 검증(+ 결제자가 부담자 목록에 없는 경우 나머지 별도 row 생성)

- **Task 016: 지출 항목 목록 관리 기능 구현 (F004)** ✅
  - 스토어의 `expenses`를 실제 목록으로 렌더링 (항목명/금액/결제자/배분 방식 요약)
  - 항목 클릭 시 수정 페이지 진입, 삭제 시 확인 다이얼로그 노출
  - 항목 삭제 시 연결된 `ExpenseShare` 동시 삭제(캐스케이드) 처리
  - 총 지출 합계 및 항목 수 표시
  - 지출 0건일 때 빈 상태 UI 및 "정산 결과 보기" 버튼 비활성화 처리
  - 목록 정렬 기준(등록 순) 확정

  #### 테스트 체크리스트
  - [x] Playwright MCP: 지출 추가 → 목록에 즉시 반영되고 총합이 갱신되는지 확인
  - [x] Playwright MCP: 지출 삭제 후 관련 `ExpenseShare`가 남지 않는지 `browser_evaluate`로 localStorage 검증
  - [x] Playwright MCP: 지출 0건일 때 빈 상태가 노출되고 정산 진입이 차단되는지 확인
  - [x] Playwright MCP: 삭제 확인 다이얼로그에서 취소 시 항목이 유지되는지 확인

- **Task 017: 정산 자동 계산 엔진 구현 (F005)** ✅
  - `lib/settlement.ts`에 순수 함수로 계산 엔진 작성 (UI/스토어 의존 없음)
  - `calculateBalances`: 참여자별 `paidAmount`(결제 합계) − `owedAmount`(ExpenseShare 부담 합계) = `netBalance` 산출
  - `calculateSettlements`: 채권자/채무자 그리디 매칭으로 **최소 송금 횟수** 송금 목록 생성
  - 잔액 합계가 0이 되는지 검증하는 내부 정합성 가드 및 1원 단위 오차 방지
  - 정산 대상이 없는 경우(모두 잔액 0) 처리 및 결과 메시지 정의
  - 계산 엔진 단위 테스트 케이스 목록 정의 (수기 계산 결과와 대조)

  #### 테스트 체크리스트
  - [x] Playwright MCP: 참여자 3명·지출 3건 시나리오를 UI로 입력해 송금 내역이 수기 계산 결과와 일치하는지 확인 (Task025 전체 플로우 E2E 재검증에서 커버 확인)
  - [x] Playwright MCP: 모든 송금 금액의 합이 채권자 총 잔액과 일치하는지 확인
  - [x] Playwright MCP: 송금 건수가 (참여자 수 − 1) 이하인지 확인
  - [x] Playwright MCP: 1인이 전부 결제한 단순 케이스에서 송금이 (인원 − 1)건으로 나오는지 확인
  - [x] Playwright MCP: 균등 배분 나머지 가산이 최종 잔액에 정확히 반영되는지 확인
  - [x] 엣지 케이스: 전원 잔액 0(정산 불필요), 참여자 2명 최소 케이스, 참여자 15명 대량 케이스 검증

- **Task 018: 정산 결과 페이지 실데이터 연동 (F005)** ✅
  - 참여자별 지출/부담/순잔액 요약 테이블을 계산 엔진 결과로 렌더링
  - "누가 누구에게 얼마" 송금 목록 카드 렌더링 및 금액 강조 표시
  - 계산 결과 메모이제이션(`useMemo`)으로 불필요한 재계산 방지
  - 지출이 없거나 참여자가 부족한 상태로 직접 URL 진입 시 가드 및 리다이렉트
  - 정산 결과 캡처 영역(`ref`)을 F006 대비 별도 컨테이너로 분리
  - "지출 내역으로 돌아가기" 네비게이션 연결

  #### 테스트 체크리스트
  - [x] Playwright MCP: `/result` 직접 진입 시 데이터 부족이면 리다이렉트되는지 확인
  - [x] Playwright MCP: 지출 수정 후 정산 결과가 즉시 재계산되어 표시되는지 확인
  - [x] Playwright MCP: 요약 테이블의 부담 합계가 총 지출액과 일치하는지 확인

- **Task 018-1: 핵심 기능 통합 테스트** ✅
  - Playwright MCP를 사용한 전체 사용자 플로우 E2E 시나리오 작성 (참여자 등록 → 지출 입력 → 정산 결과)
  - 균등 배분/항목별 배분이 섞인 복합 시나리오 검증
  - 참조 무결성·캐스케이드 삭제·localStorage 영속화 교차 검증
  - 에러 핸들링 및 엣지 케이스 회귀 테스트 목록화

  #### 테스트 체크리스트
  - [x] Playwright MCP: 총무 시나리오 전체 플로우를 처음부터 끝까지 무오류 통과
  - [x] Playwright MCP: 플로우 중간에 새로고침해도 이어서 진행 가능한지 확인
  - [x] Playwright MCP: 뒤로가기/앞으로가기 시 상태와 화면이 일치하는지 확인
  - [x] Playwright MCP: `browser_console_messages`로 콘솔 에러·경고 0건 확인
  - [x] Playwright MCP: 모바일 뷰포트(390×844)에서 동일 플로우 재검증

### Phase 4: 추가 기능 개발

> 핵심 정산 플로우 위에 **공유 가치(F006)와 예외 상황 UX**를 얹는 단계.

- **Task 019: 정산 결과 이미지 다운로드 구현 (F006)** ✅
  - `html-to-image`의 `toPng`로 정산 결과 캡처 영역을 PNG 변환
  - 캡처 전용 스타일 적용 (버튼·네비게이션 숨김, 배경 불투명, 모임 이름·날짜 워터마크)
  - `pixelRatio` 2배 적용으로 고해상도 출력 및 파일명 규칙(`모임이름_정산결과_YYYYMMDD.png`) 정의
  - 다운로드 진행 상태 표시 및 변환 실패 시 에러 토스트 처리
  - 웹폰트/아이콘 미로딩으로 인한 깨짐 방지 (폰트 임베딩 또는 사전 로드)
  - 모바일 브라우저 다운로드 동작 확인 및 대체 안내

  #### 테스트 체크리스트
  - [x] Playwright MCP: "이미지로 다운로드" 클릭 시 PNG 다운로드가 트리거되는지 확인
  - [x] Playwright MCP: 캡처 영역에 버튼 등 불필요 요소가 포함되지 않는지 스크린샷 대조
  - [x] Playwright MCP: 참여자 15명 대량 데이터에서도 이미지 생성이 완료되는지 확인
  - [x] Playwright MCP: 변환 실패 시 에러 토스트가 표시되고 앱이 정상 동작하는지 확인(Image 로드 실패를 강제 유도해 검증)

- **Task 020: 빈 상태·에러 처리 및 예외 UX 보강** ✅
  - 라우트 단위 에러 바운더리 및 전역 에러 폴백 화면 구현
  - 빈 상태(참여자 미등록, 지출 0건, 정산 불필요) 문구와 CTA 최종 확정
  - 폼 검증 실패 시 첫 오류 필드 자동 포커스 및 스크롤 이동
  - 파괴적 동작(참여자 삭제, 지출 삭제, 세션 초기화) 확인 다이얼로그 일관화
  - 토스트 메시지 문구 통일 및 중복 노출 방지

- **Task 021: 세션 초기화 및 데이터 관리 UX** ✅
  - "새 정산 시작하기"(세션 초기화) 기능 구현 및 확인 다이얼로그
  - 기존 세션 복원 시 안내 배너 표시 (모임 이름·생성 일시)
  - 세션 초기화 시 localStorage 완전 정리 및 첫 화면 복귀
  - 참여자/지출 수 요약 표시로 현재 세션 상태 파악 지원

  #### 테스트 체크리스트
  - [x] Playwright MCP: 세션 초기화 후 localStorage 데이터가 제거되고 첫 화면으로 이동하는지 확인
  - [x] Playwright MCP: 초기화 다이얼로그에서 취소 시 데이터가 보존되는지 확인
  - [x] Playwright MCP: 기존 세션 복원 배너가 정확한 모임 이름·일시를 표시하는지 확인

- **Task 021-1: ISSUES.md 대응 — UI/UX 개선 및 버그 수정** ✅
  - 프로젝트 제목을 "정돈(Split Bill) - 더치페이/정산 관리 앱"으로 변경(`index.html` 타이틀), 헤더 로고 텍스트는 "정돈"으로 축약
  - 테마를 토스(Toss) 블루(#0064FF) 기반으로 변경: `--primary`, `--ring`, `--sidebar-primary` 등 브랜드 컬러 토큰 교체, `--accent`를 옅은 블루 틴트로 조정
  - `--radius` 상향 및 `Card` 컴포넌트에 은은한 그림자 추가로 전반적인 디자인을 더 부드럽고 친근한 인상으로 개선
  - 헤더의 "정돈" 타이틀을 `Link`로 교체해 클릭 시 홈(`/`)으로 이동하도록 구현
  - `Input` 기본 높이를 `Button`의 CTA 높이(h-11, 44px 터치 타깃)에 맞춰 정렬
  - `CurrencyInput`의 "원" 접미사를 편집 가능한 input value에서 분리해 절대 위치 suffix로 렌더링 → 백스페이스로 금액이 정상적으로 지워지지 않던 버그 수정
  - `Button`, `ParticipantChip` 삭제 버튼, `Select`/`Checkbox`/`RadioGroup` 등 클릭 가능한 요소 전반에 `cursor-pointer` 적용

  #### 테스트 체크리스트
  - [x] Playwright MCP: 헤더 "정돈" 타이틀 클릭 시 `/`로 이동하는지 확인
  - [x] Playwright MCP: 참여자 등록 화면에서 이름 입력창과 "추가" 버튼의 높이가 일치하는지 스크린샷 확인
  - [x] Playwright MCP: 지출 금액 입력 후 Backspace로 숫자가 한 자리씩 정상 삭제되는지 확인(콤마 경계 포함)
  - [x] Playwright MCP: 버튼/체크박스/라디오 요소의 `getComputedStyle().cursor`가 `pointer`인지 확인
  - [x] `npm run lint`, `npm run build` 무오류 통과 확인

- **Task 021-2: UI 미세 조정 (2차)** ✅
  - `Select` 트리거 높이를 `Input`/`Button`과 동일하게 정렬(최종 h-10, 40px)
  - 폼의 Label-Input 세로 간격 확대(`space-y-1.5` → `space-y-2.5`, 5곳)
  - `--radius`를 1rem → 0.75rem으로 축소하고, `Card`/`Dialog`/`AlertDialog`/지출 카드 로우/복원 배너/정산 결과 캡처 영역의 모서리를 `Button`/`Input`/`Select`와 동일한 `rounded-lg`로 통일(칩·원형 요소는 형태가 달라 제외)
  - 부담자 체크박스 목록 행 간격 축소(`gap-2` → `gap-1`, 터치 타깃 `min-h-11`은 유지)
  - `Input`/`Button` 높이를 h-11(44px) → h-10(40px)으로 소폭 축소, 앱 전역 CTA 버튼도 동일 적용
  - 헤더 "정돈" 타이틀 옆에 `Coins` 아이콘 추가
  - Primary 컬러를 `#0064FF` → `#3182F6`(더 연한 토스 블루)로 조정
  - 배경(`--background`)을 옅은 블루그레이로, `--secondary`/`--muted`도 블루 틴트로 조정해 카드와의 레이어감 부여, `Card`/지출 카드 로우의 테두리(ring)를 제거하고 `shadow-sm`만 남겨 경계 없는 카드 스타일로 전환, 헤더의 `border-b`도 `shadow-sm`으로 대체

  #### 참고
  - Primary `#3182F6` 배경에 흰색 버튼 텍스트의 대비는 약 3.7:1로, WCAG AA 일반 텍스트 기준(4.5:1)에는 다소 못 미침(large-text 기준 3:1은 충족). 사용자가 명시적으로 더 연한 톤을 요청해 우선 적용했으며, 가독성 이슈가 느껴지면 색상을 소폭 진하게 조정 가능
  - h-10(40px)은 Task 011의 44px 최소 터치 타깃 권장값보다 살짝 작음(사용자 요청에 따른 시각적 우선순위 조정)

### Phase 5: 최적화 및 배포

- **Task 022: 성능 최적화 및 번들 경량화** ✅
  - 라우트 기반 코드 스플리팅(`lazy` + `Suspense`) 적용, `html-to-image` 동적 임포트
  - 정산 계산·목록 렌더링에 `useMemo`/`memo` 적용 및 불필요한 리렌더 제거
  - 번들 분석으로 초기 로드 용량 점검 및 미사용 shadcn 컴포넌트 정리
  - 이미지·폰트 자산 최적화 및 프리로드 설정
  - 참여자 20명 / 지출 50건 규모의 입력·계산 응답성 측정

- **Task 023: 접근성·모바일 UI 최종 점검 및 크로스 브라우저 QA** ✅
  - Lighthouse 미설치 환경이라 Playwright MCP로 색상 대비(WCAG AA)·시맨틱 마크업·라벨 연결을 직접 실측하는 방식으로 대체 점검
  - 키보드 전용 조작으로 전체 플로우 완주 검증
  - 스크린리더 레이블(`aria-label`, 폼 연결) 최종 점검
  - **버그 수정**: SPA 라우트 전환 시 포커스가 `body`로 유실되던 문제 발견 → `RootLayout`의 `<main>`에 `tabIndex={-1}` + 경로 변경 시 포커스 이동 로직 추가(`src/layouts/RootLayout.tsx`)
  - 모바일 키보드 노출 시 입력 필드 가림 현상은 `pb-28` 콘텐츠 여백과 `BottomActionBar`의 safe-area 대응 구조로 구조적으로는 확인했으나, 실제 iOS/Android 가상 키보드 리사이즈 동작은 headless 브라우저로 재현 불가(아래 참고 항목 기재)

  #### 참고
  - iOS Safari·Android Chrome 등 실제 모바일 브라우저/실기기 검증은 이 환경(Playwright MCP, Chromium 기반)에서는 수행할 수 없어 대상에서 제외함. 필요 시 실기기 또는 BrowserStack 등 별도 서비스로 추가 검증 필요
  - 색상 대비 실측: `muted-foreground`/`destructive` 텍스트는 배경 대비 약 4.7:1로 WCAG AA(4.5:1) 통과. Primary 버튼 텍스트(약 3.7:1)는 Task 021-2에서 이미 인지하고 있던 미달 사항으로 이번에도 동일하게 확인됨(변경 없음)

  #### 테스트 체크리스트
  - [x] Playwright MCP: 360px·390px·430px 등 모바일 뷰포트별 레이아웃 깨짐 없는지 스크린샷 확인
  - [x] Playwright MCP: 키보드(Tab/Enter)만으로 참여자 등록 → 정산 결과까지 진행 가능한지 확인
  - [x] Playwright MCP: 전 페이지 콘솔 에러 0건 확인

- **Task 024: Vercel 배포 파이프라인 구축** ✅
  - `vercel.json` 작성: `buildCommand`(`npm run build`)·`outputDirectory`(`dist`) 명시, SPA 리라이트(모든 경로 → `/index.html`), 정적 자산(`/assets/*`, 아이콘 SVG) 장기 캐시(`immutable`) + `index.html` 무캐시 헤더 설정
  - `index.html`에 OG/Twitter 메타 태그(`og:title`, `og:description`, `og:image` 등) 및 `theme-color` 추가
  - `public/og-image.png`(1200×630) 제작: 브랜드 컬러·로고 기반 소셜 공유 카드, Playwright로 캡처해 생성
  - `npm run build` 산출물에 `og-image.png`·`favicon.svg` 포함 확인, `vite preview`로 `/expenses`·`/result` 딥링크 200 응답(SPA 폴백) 검증
  - Vercel 프로젝트 생성·GitHub 리포(`qpalkim/split-bill`) 연동·커스텀 도메인 연결은 사용자가 Vercel 대시보드에서 직접 진행하기로 결정(계정에 영향을 주는 작업이라 자동화하지 않음) — 아래 참고 항목에 안내 절차 기재

  #### 참고: Vercel 대시보드에서 직접 진행할 절차
  1. https://vercel.com/new 에서 GitHub 리포 `qpalkim/split-bill` Import (Framework Preset은 Vite로 자동 인식되며, `vercel.json`의 buildCommand/outputDirectory가 이를 보강)
  2. Import만 하면 GitHub 연동 자동 배포(main 브랜치 push → Production 배포, 그 외 브랜치/PR → Preview 배포)는 Vercel이 기본 제공하므로 별도 설정 불필요
  3. 커스텀 도메인이 필요하면 프로젝트의 Settings → Domains에서 보유 도메인을 추가하고 안내되는 DNS 레코드를 등록
  4. 이미 Vercel CLI(`qpalkim` 계정)로 로그인되어 있으므로, CLI로 진행하고 싶다면 `vercel link` → `vercel git connect` → `vercel --prod` 순서로도 동일하게 처리 가능

- **Task 025: 최종 QA 및 릴리스 점검** ✅
  - 배포된 프로덕션(`https://split-bill-khaki.vercel.app`)에서 참여자 4명·지출 3건(균등 배분 나머지 발생/미발생, 항목별 배분 혼합) 시나리오로 F001~F007 전수 검증 — 모두 통과
  - 계산 규칙 4종 프로덕션 실측 검증: 부담자 0명 저장 차단(최소 1인), 10,000원÷3명 균등 배분 시 3,334/3,333/3,333원(나머지 결제자 부담), 항목별 배분 합계 20,000원 정확히 일치해야 저장, 지출 참조 중인 참여자 4명 전원 삭제 버튼 비활성화(참조 무결성)
  - 정산 결과: 손계산 값(총무 +1,666 / 철수 -2,333 / 영희 +8,667 / 민수 -8,000, 송금 3건)과 프로덕션 계산 결과가 정확히 일치
  - `README.md`를 프로젝트 소개·사용 가이드·기술 스택·로컬 개발 명령어 중심으로 전면 재작성(기존 Vite 템플릿 기본 문서 대체)
  - 참여자 등록 페이지 최상단에 로컬 저장 전용·기기 간 공유 불가 안내 문구 추가(`src/pages/ParticipantRegisterPage.tsx`)
  - `npm run build` 무오류 통과 확인. **단, 이번 Task의 코드 변경(안내 문구)은 아직 프로덕션에 배포되지 않음 — 커밋 후 push해야 Vercel 자동 배포로 반영됨**

  #### 테스트 체크리스트
  - [x] Playwright MCP: 배포된 프로덕션 URL에서 전체 플로우 E2E 재검증
  - [x] Playwright MCP: 프로덕션 환경 새로고침·직접 URL 진입 시 404 없이 라우팅되는지 확인
  - [x] Playwright MCP: 프로덕션에서 PNG 다운로드 정상 동작 확인

- **Task 026: ISSUES.md 대응 — 상한 검증, iOS 다운로드, UX/문서 보완** ✅
  - **기능 추가**: 개발자 응원하기 버튼(`ResultPage`) 추가. 프로젝트가 서버/DB를 두지 않는 원칙이라 자체 집계는 불가능해, 이미 배포 중인 Vercel Analytics 커스텀 이벤트(`@vercel/analytics`, `track('cheer_click')`)로 대체 — 코드상 서버/DB 없이 이벤트만 전송, 개발자는 Vercel 대시보드에서 확인. 세션당 1회만 전송되도록 클릭 후 버튼 비활성화.
  - **참여자 동일 이름 등록 방지**: `ParticipantRegisterPage`에서 등록된 이름과 정확히 일치하면 차단, 신규 메시지(`PARTICIPANT_NAME_DUPLICATE_MESSAGE`) 노출.
  - **참여자 최대 20명 / 지출 항목 최대 50건 상한**: `constants/validation.ts`에 `MAX_PARTICIPANTS_COUNT`(20)·`MAX_EXPENSES_COUNT`(50) 추가. 상한 도달 시 참여자 등록 화면의 입력창·추가 버튼과 지출 목록의 "지출 추가" 버튼을 비활성화하고 안내 메시지 노출. `ExpenseFormPage`에는 상한 초과 상태에서 `/expenses/new`에 직접 진입하는 경우를 막는 리다이렉트 가드 추가.
  - **계산 정확성 재검증**: `lib/settlement.ts`/`lib/split.ts`는 코드 변경 없이 Playwright로 재검증만 수행(아래 체크리스트).
  - **리팩토링**: 아무 곳에서도 참조되지 않던 `src/lib/id.ts`(`generateId`, 실제로는 `crypto.randomUUID()`를 직접 호출) 삭제. `package.json`의 `shadcn`을 런타임 `dependencies`에서 `devDependencies`로 이동(CLI 전용 도구). `npm run lint`·IDE 진단 모두 0건으로 별도 경고 코드는 발견되지 않음. Task012/014/017의 미체크 테스트 항목 4건을 Task025 전체 플로우 E2E 재검증에서 실질적으로 커버된 것으로 확인해 `[x]` 처리.
  - **UX**: 토스트 위치를 하단→상단(`position="top-center"`)으로 변경해 `BottomActionBar` 버튼과의 겹침 해소. iOS Safari에서 `<a download>`가 새 탭으로 열리며 다운로드가 안 되는 문제를 Web Share API(`navigator.share({ files })`)로 우회하되, 데스크톱 Chrome/Edge 등도 Web Share API를 지원해 기존에 정상 동작하던 다운로드 흐름을 깨뜨릴 뻔했음 — User-Agent 기반으로 iOS(아이폰/아이패드, 데스크톱 모드 아이패드 포함)에서만 Web Share를 사용하고 그 외는 기존 앵커 다운로드를 유지하도록 제한. 참여자 등록 화면의 로컬 저장 안내 문구를 기본 접힘 토글 UI로 변경. 첫 화면(참여자·지출 모두 0건)에서 초기화 버튼 클릭 시 확인 모달 없이 즉시 초기화.
  - **문서화**: Playwright MCP로 dev 서버의 참여자 등록·지출 내역·정산 결과 화면을 캡처해 `docs/images/`에 저장하고 README에 삽입.

  #### 테스트 체크리스트
  - [x] Playwright MCP: 참여자 20명 등록 후 입력창/추가 버튼 비활성화 및 상한 메시지 노출 확인
  - [x] Playwright MCP: 동일 이름 참여자 재등록 시 중복 에러 메시지 확인
  - [x] Playwright MCP: `MAX_EXPENSES_COUNT`를 임시로 2로 낮춰 지출 3번째 등록 시 "지출 추가" 버튼 비활성화 및 `/expenses/new` 직접 진입 시 리다이렉트+토스트 확인(검증 후 50으로 원복)
  - [x] Playwright MCP: 19명 참여자·19,000원/100원 지출 시나리오로 균등 배분 나머지 처리(결제자 추가 부담) 및 순잔액 합 0, 송금 18건이 손계산과 일치하는지 확인
  - [x] Playwright MCP: 참여자 3명(지민/서연/도윤)·지출 2건(45,000원/10,000원) 시나리오로 손계산 결과(지민 +26,667 / 서연 -8,334 / 도윤 -18,333, 송금 2건)와 정확히 일치하는지 확인(README 스크린샷 겸용)
  - [x] Playwright MCP: 토스트가 화면 상단에 노출되어 하단 버튼과 겹치지 않는지 확인
  - [x] Playwright MCP: 저장 안내 토글 클릭 시 펼침/접힘 동작 확인
  - [x] Playwright MCP: 첫 화면(참여자 0명)에서 초기화 버튼 클릭 시 모달 없이 즉시 처리되는지, 데이터가 있는 상태에서는 기존처럼 확인 모달이 뜨는지 확인
  - [x] Playwright MCP: 응원하기 버튼 클릭 시 Vercel Analytics 디버그 콘솔에 `cheer_click` 이벤트가 기록되고, 버튼이 "응원해주셔서 감사해요"로 비활성화되는지 확인
  - [x] Playwright MCP: 정산 결과 다운로드가 데스크톱 브라우저에서 Web Share API 없이 기존 앵커 다운로드로 정상 동작하는지 확인(iOS 분기가 데스크톱 다운로드를 막지 않는지 회귀 검증)
  - [x] `npm run lint`, `npm run build` 무오류 통과 확인

- **Task 027: UI/문서 미세 조정 (Task 026 후속)** ✅
  - **저장 안내: 토글 → 모달**: `ParticipantRegisterPage`의 인라인 펼침 토글을 `AlertDialog` 기반 안내 모달(취소 없이 "확인" 버튼 하나)로 교체.
  - **README 보강**: "알려진 제약"에 참여자 최대 20명·지출 항목 최대 50건 안내 문구 추가. `public/og-image.png`(1200×630)를 README 최상단에 가운데 정렬로 배치해 PPT 표지 느낌의 커버 이미지로 사용.
  - **응원 버튼 UX**: 커서가 기본값(`Button` 컴포넌트 미사용이라 `cursor-pointer` 미적용)으로 표시되던 문제를 클래스 추가로 수정. 버튼을 `BottomActionBar` 내부(다운로드 버튼·안내 문구와 함께)에서 밖으로 옮겨, 스크롤 콘텐츠의 마지막 요소로 하단 고정 바의 경계선(`border-t`) 바로 위에 위치하도록 변경.

  #### 테스트 체크리스트
  - [x] Playwright MCP: "저장 안내" 클릭 시 모달이 뜨고 "확인" 버튼으로 닫히는지 확인
  - [x] Playwright MCP: 정산 결과 화면에서 응원 버튼의 `getComputedStyle().cursor`가 `pointer`인지 확인
  - [x] Playwright MCP: 응원 버튼이 `BottomActionBar` 경계선 위(스크롤 영역 마지막)에 렌더링되고, 다운로드 버튼·안내 문구는 여전히 바 안에 남아있는지 스크린샷으로 확인
  - [x] README.md 렌더링 확인: og 이미지가 최상단에, 참여자/지출 상한 문구가 "알려진 제약"에 반영됐는지 확인
  - [x] `npm run lint`, `npm run build` 무오류 통과 확인

- **Task 028: 지출 화면 뒤로가기·응원 버튼 UX 보완 (Task 027 후속)** ✅
  - **지출 내역 화면에 참여자 수정하기 링크 추가**: 처음엔 `BottomActionBar`에 `ArrowLeft` 아이콘 버튼으로 구현했으나, 하단 바의 기존 버튼들과 시각적 통일성이 떨어진다는 피드백에 따라 제거하고 대신 "참여자 N명" 텍스트 옆에 `ParticipantRegisterPage`의 "저장 안내" 버튼과 같은 스타일(아이콘 + 텍스트 링크)의 "참여자 수정하기" 버튼을 배치해 `/`(참여자 등록)로 이동하도록 변경. 기존 참여자/지출 데이터는 유지된 채 이동. 문구는 "추가하기"로 시작했다가, 이동 후 삭제도 가능해야 한다는 요청에 맞춰 "수정하기"로 재조정.
  - **참조 중인 참여자 삭제 차단 사유를 명확히 안내**: 이미 지출에 연결된 참여자를 삭제하면 정산 계산의 합계가 깨지므로(결제자·부담자 참조가 남아 금액이 붕 뜸) 삭제 차단 자체는 PRD의 참조 무결성 규칙대로 유지하기로 확인. 다만 기존에는 비활성화 사유가 `title` 툴팁으로만 노출돼 모바일에서는 왜 막혀 있는지 알 방법이 없었음 — `ParticipantChip`의 삭제 버튼에서 네이티브 `disabled` 대신 `aria-disabled`만 적용해 탭하면 클릭 이벤트가 발생하도록 바꾸고, 새 `onDisabledClick` prop으로 `PARTICIPANT_REFERENCED_MESSAGE` 토스트를 띄워 이유를 안내.
  - **응원 버튼: 비활성화 → 완전히 숨김**: 클릭 후 버튼을 `disabled` 처리하는 대신 `hasCheered`가 true면 아예 렌더링하지 않도록 변경해 정말 한 번만 누를 수 있게 함(토스트로 감사 메시지는 그대로 노출).
  - **응원 버튼-하단 바 간격 조정**: 응원 버튼을 하단 고정 바 안에서 밖으로 옮긴 뒤(Task 027) 남아있던 여유 패딩을 사용자가 확인 — 카드 안으로 옮기는 대신 현재 위치(카드 밖·하단 고정 바 바로 위)를 유지하되 간격만 좁히기로 결정. `ResultPage` 컨테이너의 `pb-28`(112px)을 `pb-24`(96px)로 줄여 하단 고정 바와의 여백을 줄임.
  - **저장 안내 버튼 커서 포인터**: `ParticipantRegisterPage`의 "저장 안내" 버튼에 `cursor-pointer` 클래스 누락 확인 후 추가.
  - **README 이모지 보강**: 최상단 타이틀과 각 `##`/`###` 섹션 제목에 내용과 어울리는 이모지(💰/💡/✨/📸/📖/⚠️/🛠️/💻)를 추가해 가독성 개선.

  #### 테스트 체크리스트
  - [x] Playwright MCP: 지출 내역 화면에서 "참여자 수정하기" 클릭 시 `/`로 이동하고 기존 참여자 데이터가 유지되는지 확인
  - [x] Playwright MCP: 응원 버튼 클릭 시 토스트가 뜨고, 버튼이 DOM에서 완전히 사라지는지(재클릭 불가) 확인
  - [x] Playwright MCP: 응원 버튼-하단 바 간격이 좁아졌는지 스크린샷으로 확인(클릭 전/후 모두)
  - [x] Playwright MCP: 지출에 참조된 참여자의 삭제 버튼을 탭하면 삭제되지 않고 사유 토스트가 뜨는지, 참조되지 않은 참여자는 정상적으로 확인 모달 → 삭제까지 이어지는지 확인
  - [x] Playwright MCP: "저장 안내" 버튼의 `getComputedStyle().cursor`가 `pointer`인지 확인
  - [x] README.md 렌더링 확인: 모든 제목에 이모지가 반영됐는지 확인
  - [x] `npm run lint`, `npm run build` 무오류 통과 확인
