export type Participant = {
  id: string
  name: string
  icon: string
  createdAt: string
  updatedAt: string
}

export type Currency = {
  id: string
  code: string
  rate: number
  createdAt: string
  updatedAt: string
}

export type Item = {
  id: string
  name: string
  icon: string
  payer: Participant
  price: number
  currency: Currency | null
  amount: number
  total: number
  exempts: Participant[]
  version: string
  createdAt: string
  updatedAt: string
}

export type SeisanResultDetailItem = {
  id: string
  source: Item
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
  return currency?.rate ?? 1
}

export function getDividedPrice(item: Item, totalParticipants: number): number {
  const effectiveParticipants = totalParticipants - item.exempts.length
  if (effectiveParticipants <= 0) return 0

  const rate = getCurrencyRate(item.currency)
  const totalPrice = item.price * item.amount * rate
  return Math.floor(totalPrice / effectiveParticipants)
}

export function calculateSettlement(
  items: Item[],
  participants: Participant[],
  seisanId: string,
): SeisanResult {
  const details: SeisanResultDetail[] = participants.map((participant) => {
    const participantItems: SeisanResultDetailItem[] = items
      // 免除者の detail 一覧からは除外する
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
  // 各参加者の差額の合計の絶対値
  const totalDifference = details.reduce((sum, d) => sum + d.difference, 0)
  const surplus = Math.abs(totalDifference)

  return {
    id: `result-${seisanId}`,
    surplus,
    details,
  }
}
