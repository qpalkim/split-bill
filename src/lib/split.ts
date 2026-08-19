interface EqualShare {
  participantId: string
  amount: number
}

/**
 * 지출 금액을 부담자에게 균등 배분한다.
 * floor(amount / 부담 인원수)를 기본 배정하고, 나눗셈 나머지는 결제자 몫에 가산한다.
 * 결제자가 부담자 목록에 없으면 결제자용 항목을 별도로 추가해 전역 합계(Σamount = amount)를 보존한다.
 */
export function calculateEqualShares(
  amount: number,
  participantIds: string[],
  payerId: string,
): EqualShare[] {
  const baseAmount = Math.floor(amount / participantIds.length)
  const remainder = amount - baseAmount * participantIds.length

  const shares = participantIds.map((participantId) => ({
    participantId,
    amount: participantId === payerId ? baseAmount + remainder : baseAmount,
  }))

  if (!participantIds.includes(payerId)) {
    shares.push({ participantId: payerId, amount: remainder })
  }

  return shares
}
