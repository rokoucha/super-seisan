import { Button, Container, Table, Title } from '@mantine/core'
import React, { useCallback, useEffect, useState } from 'react'
import { super_seisan } from '../generated/protobuf'
import { TransactonEditor } from './TransactionEditor'
import { UserEditor } from './UserEditor'

type Transaction = {
  item: string
  buyer: string
  price: number
  quantity: number
  exemptions: string[]
}

function spliceToNew<T>(
  arrayLike: Iterable<T>,
  start: number,
  deleteCount: number,
  ...items: T[]
): Array<T> {
  const n = [...arrayLike]
  n.splice(start, deleteCount, ...items)
  return n
}

function getUserSpendings(
  transactions: Transaction[],
  users: string[],
  user: string,
): number {
  return transactions
    .filter((t) => !t.exemptions.includes(user))
    .reduce<number>(
      (p, c) =>
        p +
        Math.floor(
          (c.price * c.quantity) / (users.length - c.exemptions.length),
        ),
      0,
    )
}

function getUserPayments(transactions: Transaction[], user: string): number {
  return transactions
    .filter((t) => t.buyer === user)
    .reduce<number>((p, c) => p + c.price * c.quantity, 0)
}

export const Caluclator: React.FC = () => {
  const [initialized, setInitalized] = useState(false)
  const [users, setUsers] = useState<string[]>([''])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    let decoded: super_seisan.Payload
    try {
      decoded = super_seisan.Payload.decode(
        Uint8Array.from([...atob(hash)].map((h) => h.charCodeAt(0))),
      )
    } catch (e) {
      console.error('Failed to parse hash string', e)
      return
    }

    setUsers(decoded.users)
    setTransactions(
      decoded.transactions.map((t) => ({
        ...t,
        exemptions: t.exemptions ?? [],
      })),
    )

    setInitalized(true)

    console.debug('hash loaded!')
  }, [])

  useEffect(() => {
    if (!initialized) return

    const data = super_seisan.Payload.encode({
      transactions: transactions,
      users: users,
    }).finish()
    const hash = btoa(String.fromCharCode(...data))
    window.location.hash = hash

    console.debug('hash saved!')
  }, [initialized, transactions, users])

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => e.preventDefault(),
    [],
  )

  const onUserInputChange = useCallback((i: number, v: string) => {
    setUsers((u) => spliceToNew(u, i, 1, v))
  }, [])

  const onUserRemoveClick = useCallback((i: number) => {
    setUsers((u) => spliceToNew(u, i, 1))
  }, [])

  const onUserAddClick = useCallback(() => {
    setUsers((u) => [...u, ''])
  }, [])

  const onUserInputKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return

      e.preventDefault()
      onUserAddClick()
    },
    [],
  )

  const onTransactionUpClick = useCallback((i: number) => {
    if (i < 1) return
    setTransactions((t) => spliceToNew(t, i - 1, 2, t[i], t[i - 1]))
  }, [])

  const onTransactionDownClick = useCallback(
    (i: number) => {
      if (i > transactions.length - 1) return
      setTransactions((t) => spliceToNew(t, i, 2, t[i + 1], t[i]))
    },
    [transactions],
  )

  const onTransactionItemChange = useCallback((i: number, v: string) => {
    setTransactions((t) => spliceToNew(t, i, 1, { ...t[i], item: v }))
  }, [])

  const onTransactionBuyerChange = useCallback((i: number, v: string) => {
    setTransactions((t) => spliceToNew(t, i, 1, { ...t[i], buyer: v }))
  }, [])

  const onTransactionPriceChange = useCallback((i: number, v: number) => {
    setTransactions((t) =>
      spliceToNew(t, i, 1, {
        ...t[i],
        price: v,
      }),
    )
  }, [])

  const onTransactionQuantityChange = useCallback((i: number, v: number) => {
    setTransactions((t) =>
      spliceToNew(t, i, 1, {
        ...t[i],
        quantity: v,
      }),
    )
  }, [])

  const onTransactionExemptionChange = useCallback((i: number, v: string[]) => {
    setTransactions((t) =>
      spliceToNew(t, i, 1, {
        ...t[i],
        exemptions: v,
      }),
    )
  }, [])

  const onTransactionRemoveClick = useCallback((i: number) => {
    setTransactions((t) => spliceToNew(t, i, 1))
  }, [])

  const onTransactionAddClick = useCallback(
    () =>
      setTransactions((t) => [
        ...t,
        { item: '', buyer: '', price: 0, quantity: 1, exemptions: [] },
      ]),
    [],
  )

  const onUrlCopyClick = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href).catch((e) => {
      console.error('Failed to write to clipboard', e)
      window.alert('リンクのコピーに失敗しました')
    })
  }, [window.location.href])

  const onResetClick = useCallback(() => {
    if (!window.confirm('本当にリセットしますか?')) return

    setUsers([])
    setTransactions([])
  }, [])

  return (
    <div>
      <Container>
        <div>
          <Title order={2}>支払い関係者</Title>
          <UserEditor
            onSubmit={onSubmit}
            onUserAddClick={onUserAddClick}
            onUserInputChange={onUserInputChange}
            onUserInputKeyUp={onUserInputKeyUp}
            onUserRemoveClick={onUserRemoveClick}
            users={users}
          />
        </div>
        <div>
          <Title order={2}>支払い一覧</Title>
          <TransactonEditor
            onSubmit={onSubmit}
            onTransactionAddClick={onTransactionAddClick}
            onTransactionBuyerChange={onTransactionBuyerChange}
            onTransactionDownClick={onTransactionDownClick}
            onTransactionExemptionChange={onTransactionExemptionChange}
            onTransactionItemChange={onTransactionItemChange}
            onTransactionPriceChange={onTransactionPriceChange}
            onTransactionQuantityChange={onTransactionQuantityChange}
            onTransactionRemoveClick={onTransactionRemoveClick}
            onTransactionUpClick={onTransactionUpClick}
            transactions={transactions}
            users={users}
          />
        </div>
        <div>
          <Title order={2}>割り勘結果</Title>
          <Table striped={true}>
            <tbody>
              <tr>
                <td />
                {users.map((u, i) => (
                  <th key={`caluclated-header-${i}`}>{u}</th>
                ))}
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
                <td>
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
        </div>
        <div>
          <Button onClick={onUrlCopyClick}>URL をコピー</Button>
          <Button onClick={onResetClick}>リセット</Button>
        </div>
      </Container>
    </div>
  )
}
