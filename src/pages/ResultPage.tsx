import { useNavigate } from 'react-router'

/** 정산 결과 페이지(/result) 골격 */
function ResultPage() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>정산 결과</h1>
      <button type="button" onClick={() => navigate('/expenses')}>
        지출 내역으로 돌아가기
      </button>
    </div>
  )
}

export default ResultPage
