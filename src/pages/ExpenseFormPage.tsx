import { useNavigate, useParams } from 'react-router'

/** 지출 추가(/expenses/new)·수정(/expenses/:expenseId) 공용 페이지 골격 */
function ExpenseFormPage() {
  const navigate = useNavigate()
  const { expenseId } = useParams()
  const isEditMode = expenseId !== undefined

  return (
    <div>
      <h1>{isEditMode ? '지출 수정' : '지출 추가'}</h1>
      <button type="button" onClick={() => navigate('/expenses')}>
        지출 내역으로 돌아가기
      </button>
    </div>
  )
}

export default ExpenseFormPage
