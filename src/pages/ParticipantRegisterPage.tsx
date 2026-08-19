import { useNavigate } from 'react-router'

/** 참여자 등록 페이지(/) 골격 */
function ParticipantRegisterPage() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>참여자 등록</h1>
      <button type="button" onClick={() => navigate('/expenses')}>
        다음
      </button>
    </div>
  )
}

export default ParticipantRegisterPage
