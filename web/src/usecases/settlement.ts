export type Participant = {
  id: string
  name: string
  icon: string
}

export type Currency = {
  rate: number
}

export type Item = {
  id: string
  payer: { id: string }
  price: number
  currency: Currency | null
  amount: number
  exempts: { id: string }[]
}

export type SeisanResultDetailItem = {
  id: string
  source: any // JSON response type includes more fields than our internal Item type
  subtotal: number
}

export type SeisanResultDetail = {
  id: string
  participant: Participant
  total: number
  paid: number
  difference: number
  items: SeisanResultDetailItem[]
}

export type SeisanResult = {
  id: string
  surplus: number
  details: SeisanResultDetail[]
}

function getCurrencyRate(currency: Currency | null): number {
  return currency ? currency.rate : 1
}

export function getDividedPrice(item: Item, participantCount: number): number {
  const effectiveParticipants = participantCount - item.exempts.length
  if (effectiveParticipants <= 0) return 0

  const rate = getCurrencyRate(item.currency)
  return Math.floor((item.price * item.amount * rate) / effectiveParticipants)
}

export function calculateSettlement(
  items: Item[],
  participants: Participant[],
  currencies: Currency[],
  seisanId: string,
): SeisanResult {
  const details: SeisanResultDetail[] = participants.map((participant) => {
    const participantItems: SeisanResultDetailItem[] = items
      .filter((item) => !item.exempts.some((e) => e.id === participant.id))
      .map((item) => ({
        id: `detail-item-${item.id}-${participant.id}`,
        source: item,
        subtotal: getDividedPrice(item, participants.length),
      }))

    const total = participantItems.reduce((sum, di) => sum + di.subtotal, 0)

    const paid = items
      .filter((item) => item.payer.id === participant.id)
      .map((item) => {
        const rate = getCurrencyRate(item.currency)
        return Math.floor(item.price * item.amount * rate)
      })
      .reduce((sum, p) => sum + p, 0)

    return {
      id: `detail-${participant.id}`,
      participant,
      total,
      paid,
      difference: total - paid,
      items: participantItems,
    }
  })

  // Math.floorによる端数切り捨ての累積により、全体の合計が0にならない場合がある。
  // その差分が「余り」として計算される。
  const totalDifference = details.reduce((sum, d) => sum + d.difference, 0)
  const surplus = Math.abs(totalDifference)

  return {
    id: `result-${seisanId}`,
    surplus,
    details,
  }
}
