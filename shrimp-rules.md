# Development Guidelines

이 문서는 AI Agent가 **split-bill** 저장소에서 작업할 때 반드시 따라야 할 프로젝트 전용 규칙이다. 일반적인 개발 지식은 포함하지 않는다.

## 프로젝트 개요

- split-bill은 서버·DB·인증이 전혀 없는 로컬 전용 더치페이 계산기다. 모든 데이터는 브라우저 localStorage(Zustand `persist`)에만 존재한다.
- 기술 스택: Vite 8, React 19, TypeScript 6, React Router 7, Zustand, React Hook Form + Zod, TailwindCSS v4(설정파일 없음) + shadcn/ui, html-to-image, Vercel 배포.
- 기능/데이터모델/계산 규칙의 1차 소스는 `docs/PRD.md`, 작업 순서·워크플로우의 1차 소스는 `docs/ROADMAP.md`다. 이 두 문서와 상충하는 코드를 작성하지 말고, 요구사항이 불명확하면 반드시 이 두 문서를 먼저 확인한다.
- 코드베이스는 아직 Vite 기본 스캐폴드 상태다(`src/App.tsx`는 카운터 데모). `docs/ROADMAP.md`의 Task 순서를 건너뛰지 말고 순차적으로 구현한다.

## 프로젝트 아키텍처

- `docs/ROADMAP.md` Task 001에서 정의한 폴더 구조를 그대로 따른다: `src/pages/`, `src/components/ui/`(shadcn/ui 프리미티브), `src/components/common/`(공용 조합 컴포넌트), `src/layouts/`, `src/store/`, `src/types/`, `src/lib/`, `src/hooks/`, `src/constants/`.
- 새 파일을 만들 때 위 폴더 중 어디에도 맞지 않는 새 최상위 폴더를 임의로 만들지 말고, 가장 가까운 기존 폴더에 배치한다.
- 라우트는 `/`(참여자 등록), `/expenses`(지출 내역), `/expenses/new`, `/expenses/:expenseId`, `/result`(정산 결과) 5개만 존재한다. 새 라우트를 추가하려면 먼저 `docs/PRD.md`의 MVP 범위에 해당 기능이 있는지 확인한다.

## 코드 표준

- `any` 타입 사용 금지. 타입이 불확실하면 `unknown` + 타입가드 또는 정확한 유니온 타입을 정의한다.
- 변수/함수 매개변수: camelCase. 함수명: 동사+명사 조합(예: `calculateEqualShares`, `deleteParticipant`).
- 컴포넌트, `interface`/`type`: PascalCase.
- 상수: `UPPER_SNAKE_CASE`.
- Boolean 값을 가리키는 변수/props는 `is`, `has` 접두사를 사용한다(예: `isEqualSplit`, `hasCustomShare`).
- 함수(특히 `src/lib/`의 계산/유틸 함수)에는 간단한 JSDoc 주석을 한국어로 작성한다. 코드 주석과 모든 문서(md 파일 등)는 한국어로 작성하고, 식별자(변수/함수/타입명)만 영어를 유지한다.
- 컴포넌트/페이지는 반응형을 고려하되, `docs/PRD.md`의 UI 정책에 따라 **모바일 뷰포트 전용으로만** 스타일링한다. 태블릿/데스크톱 브레이크포인트(`md:`, `lg:` 등)를 위한 별도 스타일을 추가하지 않는다.
- 다크모드 관련 클래스(`dark:`)나 다크모드 토글 로직을 추가하지 않는다. 라이트 모드 스타일만 작성한다.

## 기능 구현 표준

- 균등 배분 계산: `amount = floor(지출 금액 ÷ 부담 인원수)`로 계산하고, 나눗셈에서 발생한 나머지(원 단위)는 전액 결제자(`payerId`)의 몫에 더한다. 나머지를 참여자들에게 분산시키지 않는다.
- 항목별(custom) 배분 저장 시, 참여자별 입력 금액의 합이 `Expense.amount`와 정확히 일치하지 않으면 저장을 막아야 한다(오차 허용 없음).
- 지출 항목은 부담 참여자(`ExpenseShare`)가 최소 1명 이상이어야 저장 가능하다. 0명인 상태로 저장을 허용하는 코드를 작성하지 않는다.
- 참여자를 삭제하는 로직을 작성할 때는, 해당 참여자의 `id`가 어떤 `Expense.payerId` 또는 `ExpenseShare.participantId`에서도 참조되지 않는지 먼저 검사하고, 참조 중이면 삭제를 차단한다.
- 정산 결과(`/result`)는 참여자별 순잔액을 계산한 뒤(`calculateBalances`), 최소 송금 횟수로 정리된 이체 목록을(`calculateSettlements`) 도출해야 한다. 단순히 "모두가 모두에게" 송금하는 방식으로 구현하지 않는다.
- 위 계산 로직은 `src/lib/settlement.ts`(및 관련 `src/lib/` 유틸)에 순수 함수로 구현하고, React 컴포넌트 내부에 계산 로직을 직접 작성하지 않는다.

## 프레임워크/라이브러리 사용 표준

- 전역 상태는 `src/store/`의 Zustand 스토어(`persist` 미들웨어) 하나로 관리한다. `session`, `participants`, `expenses`, `expenseShares`를 이 스토어에 저장하고, 컴포넌트 로컬 state로 중복 저장하지 않는다.
- 폼은 React Hook Form + Zod(`zodResolver`)로 작성한다. 폼 검증 로직을 `zod` 스키마 없이 수동으로 작성하지 않는다.
- 정산 결과 이미지 다운로드는 `html-to-image`의 `toPng`만 사용한다. 다른 캡처 라이브러리를 추가하지 않는다.
- TailwindCSS v4는 별도 `tailwind.config.*` 파일 없이 CSS 기반(`@theme` 등) 설정을 사용한다. 신규로 `tailwind.config.js`를 생성하지 않는다.
- UI 컴포넌트가 필요하면 먼저 shadcn/ui에 해당 프리미티브가 있는지 확인하고 재사용하며, 없을 때만 `src/components/common/`에 직접 작성한다.

## 워크플로우 표준

- 새로운 작업 단위를 시작하기 전, `docs/ROADMAP.md`에서 이미 정의된 Task인지 확인한다. 정의되어 있지 않은 새 작업이면 마지막 완료 Task 다음 위치에 새 Task를 추가한 뒤 진행한다.
- 배분 계산, 정산 알고리즘, 참조 무결성, localStorage 영속화와 관련된 작업은 구현과 함께 해당 Task에 "테스트 체크리스트" 섹션(Playwright MCP 시나리오)을 반드시 작성하고, 구현 후 Playwright MCP로 직접 검증한다.
- Task를 완료하면 `docs/ROADMAP.md`에서 해당 항목을 ✅로 표시한다.
- 한 Task(또는 명시적으로 요청받은 작업 단위)를 완료하면 다음 Task로 임의로 넘어가지 말고 사용자의 추가 지시를 기다린다.

## 핵심 파일 상호작용 표준

- `src/types/`의 `Expense`, `ExpenseShare`, `Participant`, `Session` 타입을 변경하면, 같이 수정해야 하는 파일: `src/store/`의 Zustand 스토어 상태/액션, 관련 Zod 폼 스키마, `src/lib/settlement.ts`의 계산 함수. 타입만 바꾸고 나머지를 방치하지 않는다.
- `docs/PRD.md`의 데이터 모델이나 계산 규칙을 변경하는 논의가 있었다면, 코드 수정과 함께 `docs/PRD.md`도 동일 커밋 단위에서 갱신한다.
- `docs/ROADMAP.md`의 Task 상태(✅ 표시, 새 Task 추가)를 변경할 때는 실제 코드 변경과 같은 작업 흐름 안에서 함께 갱신한다(문서만 먼저 갱신하고 코드는 나중에 하지 않는다).

## AI 의사결정 기준

- 요구사항이 `docs/PRD.md`/`docs/ROADMAP.md`와 상충하거나 두 문서에 없는 내용이면, 두 문서를 우선하고 사용자에게 확인 후 진행한다. 임의로 새 기능 범위를 추정해 구현하지 않는다.
- 기능이 "MVP 이후 제외 기능" 목록(아래 금지 사항 참고)에 해당하는지 애매하면, 구현하지 말고 먼저 사용자에게 확인한다.
- UI 스타일링에서 데스크톱/태블릿 대응 여부가 애매하면 항상 "모바일 전용"을 기본값으로 택한다.

## 금지 사항

- **서버/백엔드 코드, API 라우트, 인증/로그인 로직을 추가하지 않는다.** 이 프로젝트는 완전한 클라이언트 전용 SPA다.
- **회원가입/로그인, 정산방 링크 공유, 실시간 협업, 정산 히스토리 저장, 영수증 첨부, 퍼센트/가중치 배분, 복수 결제자, 송금 완료 체크/알림, 다중 통화, 참여자 프로필/아바타 기능을 구현하지 않는다** (모두 MVP 범위 밖으로 명시됨).
- `any` 타입을 사용하지 않는다.
- `dark:` Tailwind 클래스나 다크모드 토글을 추가하지 않는다.
- 데스크톱/태블릿 전용 반응형 브레이크포인트 스타일을 추가하지 않는다.
- 균등 배분의 나머지를 부담자 전원에게 분산시키거나, 항목별 배분에서 합계 불일치를 허용하는 방식으로 구현하지 않는다.
- 참조 중인(다른 Expense/ExpenseShare에서 사용 중인) 참여자를 무조건 삭제 가능하게 만들지 않는다.
