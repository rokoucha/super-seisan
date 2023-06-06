import { Table } from '@mantine/core'
import React from 'react'
import { Transaction } from '../types'
import { Currency } from './CurrencyEditor'

function getCurrencyRate(currencies: Currency[], symbol: string | null) {
  return currencies.find((c) => c.symbol === symbol)?.rate ?? 1
}

function getDividedPrice(
  transaction: Transaction,
  userLength: number,
  currencies: Currency[],
) {
  const rate = getCurrencyRate(currencies, transaction.currencySymbol)
  return Math.floor(
    (transaction.price * transaction.quantity * rate) /
      (userLength - transaction.exemptions.length),
  )
}

function getUserSpendings(
  transactions: Transaction[],
  users: string[],
  user: string,
  currencies: Currency[],
): number {
  return Math.floor(
    transactions
      .filter((t) => !t.exemptions.includes(user))
      .reduce<number>(
        (p, c) => p + getDividedPrice(c, users.length, currencies),
        0,
      ),
  )
}

function getUserPayments(
  transactions: Transaction[],
  user: string,
  currencies: Currency[],
): number {
  return Math.floor(
    transactions
      .filter((t) => t.buyer === user)
      .reduce<number>(
        (p, c) =>
          p +
          c.price * c.quantity * getCurrencyRate(currencies, c.currencySymbol),
        0,
      ),
  )
}

export type DividedResultProps = Readonly<{
  users: string[]
  transactions: Transaction[]
  currencies: Currency[]
}>

export const DividedResult: React.FC<DividedResultProps> = ({
  users,
  transactions,
  currencies,
}) => {
  return (
    <Table striped={true}>
      <tbody>
        <tr>
          <td style={{ width: '20%' }} />
          {users.map((u, i) => (
            <th key={`caluclated-header-${i}`}>{u}</th>
          ))}
        </tr>
        {transactions.map((t, i) => (
          <tr key={`caluclated-transactions-${i}`}>
            <th>{`#${i + 1}: ${t.item}`}</th>
            {users.map((u, ui) => (
              <td key={`caluclated-transactions-${i}-users-${ui}`}>
                {t.exemptions.includes(u)
                  ? 0
                  : getDividedPrice(t, users.length, currencies)}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <th />
          <td colSpan={users.length} />
        </tr>
        <tr>
          <th>支出計</th>
          {users.map((u, i) => (
            <td key={`caluclated-spending-${i}`}>
              {getUserSpendings(transactions, users, u, currencies)}
            </td>
          ))}
        </tr>
        <tr>
          <th>支払い計</th>
          {users.map((u, i) => (
            <td key={`caluclated-payment-${i}`}>
              {getUserPayments(transactions, u, currencies)}
            </td>
          ))}
        </tr>
        <tr>
          <th>合計</th>
          {users.map((u, i) => (
            <td key={`caluclated-payment-${i}`}>
              {getUserSpendings(transactions, users, u, currencies) -
                getUserPayments(transactions, u, currencies)}
            </td>
          ))}
        </tr>
        <tr>
          <th>余り</th>
          <td colSpan={users.length}>
            {Math.abs(
              users.reduce<number>(
                (p, c) =>
                  p +
                  getUserSpendings(transactions, users, c, currencies) -
                  getUserPayments(transactions, c, currencies),
                0,
              ),
            )}
          </td>
        </tr>
      </tbody>
    </Table>
  )
}
