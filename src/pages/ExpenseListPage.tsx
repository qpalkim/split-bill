import { useNavigate } from 'react-router'

/** 지출 내역 페이지(/expenses) 골격 */
function ExpenseListPage() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>지출 내역</h1>
      <button type="button" onClick={() => navigate('/result')}>
        정산 결과 보기
      </button>
    </div>
  )
}

export default ExpenseListPage
