import { Table } from '@mantine/core'
import React from 'react'
import { Transaction } from '../types'

function getDividedPrice(transaction: Transaction, userLength: number) {
  return Math.floor(
    (transaction.price * transaction.quantity) /
      (userLength - transaction.exemptions.length),
  )
}

function getUserSpendings(
  transactions: Transaction[],
  users: string[],
  user: string,
): number {
  return transactions
    .filter((t) => !t.exemptions.includes(user))
    .reduce<number>((p, c) => p + getDividedPrice(c, user.length), 0)
}

function getUserPayments(transactions: Transaction[], user: string): number {
  return transactions
    .filter((t) => t.buyer === user)
    .reduce<number>((p, c) => p + c.price * c.quantity, 0)
}

export type DividedResultProps = Readonly<{
  users: string[]
  transactions: Transaction[]
}>

export const DividedResult: React.FC<DividedResultProps> = ({
  users,
  transactions,
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
                  : getDividedPrice(t, users.length)}
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
              {getUserSpendings(transactions, users, u)}
            </td>
          ))}
        </tr>
        <tr>
          <th>支払い計</th>
          {users.map((u, i) => (
            <td key={`caluclated-payment-${i}`}>
              {getUserPayments(transactions, u)}
            </td>
          ))}
        </tr>
        <tr>
          <th>合計</th>
          {users.map((u, i) => (
            <td key={`caluclated-payment-${i}`}>
              {getUserSpendings(transactions, users, u) -
                getUserPayments(transactions, u)}
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
                  getUserSpendings(transactions, users, c) -
                  getUserPayments(transactions, c),
                0,
              ),
            )}
          </td>
        </tr>
      </tbody>
    </Table>
  )
}
