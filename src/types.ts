export type Transaction = {
  item: string
  buyer: string
  price: number
  quantity: number
  exemptions: string[]
  currencySymbol: string | null
}
