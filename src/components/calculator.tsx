import React, { useCallback, useEffect, useState } from 'react'
import { super_seisan } from '../generated/protobuf'

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

  const onUserInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const [, i] = e.target.name.split('-').map((v) => parseInt(v, 10))
      setUsers((u) => spliceToNew(u, i, 1, e.target.value))
    },
    [],
  )

  const onUserRemoveClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const [, i] = e.currentTarget.id.split('-').map((v) => parseInt(v, 10))
      setUsers((u) => spliceToNew(u, i, 1))
    },
    [],
  )

  const onUserAddClick = useCallback(() => setUsers((u) => [...u, '']), [])

  const onUserInputKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return

      e.preventDefault()
      onUserAddClick()
    },
    [],
  )

  const onTransactionUpClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const [, i] = e.currentTarget.id.split('-').map((v) => parseInt(v, 10))
      if (i < 1) return
      setTransactions((t) => spliceToNew(t, i - 1, 2, t[i], t[i - 1]))
    },
    [],
  )

  const onTransactionDownClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const [, i] = e.currentTarget.id.split('-').map((v) => parseInt(v, 10))
      if (i > transactions.length - 1) return
      setTransactions((t) => spliceToNew(t, i, 2, t[i + 1], t[i]))
    },
    [transactions],
  )

  const onTransactionItemChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const [, i] = e.target.name.split('-').map((v) => parseInt(v, 10))
      setTransactions((t) =>
        spliceToNew(t, i, 1, { ...t[i], item: e.target.value }),
      )
    },
    [],
  )

  const onTransactionBuyerChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const [, i] = e.target.name.split('-').map((v) => parseInt(v, 10))
      setTransactions((t) =>
        spliceToNew(t, i, 1, { ...t[i], buyer: e.target.value }),
      )
    },
    [],
  )

  const onTransactionPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const [, i] = e.target.name.split('-').map((v) => parseInt(v, 10))
      setTransactions((t) =>
        spliceToNew(t, i, 1, {
          ...t[i],
          price: parseFloat(e.target.value),
        }),
      )
    },
    [],
  )

  const onTransactionQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const [, i] = e.target.name.split('-').map((v) => parseInt(v, 10))
      setTransactions((t) =>
        spliceToNew(t, i, 1, {
          ...t[i],
          quantity: parseInt(e.target.value, 10),
        }),
      )
    },
    [],
  )

  const onTransactionExemptionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const [, i] = e.target.name.split('-').map((v) => parseInt(v, 10))
      setTransactions((t) =>
        spliceToNew(t, i, 1, {
          ...t[i],
          exemptions: [...e.target.selectedOptions].map((s) => s.value),
        }),
      )
    },
    [],
  )

  const onTransactionRemoveClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const [, i] = e.currentTarget.id.split('-').map((v) => parseInt(v, 10))
      setTransactions((t) => spliceToNew(t, i, 1))
    },
    [],
  )

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
    <>
      <div>
        <h2>支払い関係者</h2>
        <form onSubmit={onSubmit}>
          <ul>
            {users.map((u, i) => (
              <li key={`users-${i}`}>
                <input
                  name={`user-${i}`}
                  value={u}
                  onChange={onUserInputChange}
                  onKeyUp={onUserInputKeyUp}
                />
                <button
                  id={`user-${i}-remove`}
                  type="button"
                  onClick={onUserRemoveClick}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={onUserAddClick}>
            ＋
          </button>
        </form>
      </div>
      <div>
        <h2>支払い一覧</h2>
        <form onSubmit={onSubmit}>
          <table border={1}>
            <thead>
              <tr>
                <th></th>
                <th>品目</th>
                <th>支払った人</th>
                <th>額</th>
                <th>個数</th>
                <th>計</th>
                <th>支払い免除</th>
                <th colSpan={users.length}>支払い額</th>
                <th></th>
              </tr>
              <tr>
                <th colSpan={7}></th>
                {users.map((u, i) => (
                  <th key={`users-th-${i}`}>{u}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={`transactions-${i}`}>
                  <td>
                    {i !== 0 ? (
                      <button
                        id={`transaction-${i}-up`}
                        type="button"
                        onClick={onTransactionUpClick}
                      >
                        ↑
                      </button>
                    ) : (
                      <></>
                    )}
                    {transactions.length > i + 1 ? (
                      <button
                        id={`transaction-${i}-down`}
                        type="button"
                        onClick={onTransactionDownClick}
                      >
                        ↓
                      </button>
                    ) : (
                      <></>
                    )}
                  </td>
                  <td>
                    <input
                      name={`transaction-${i}-item`}
                      value={t.item}
                      onChange={onTransactionItemChange}
                    />
                  </td>
                  <td>
                    <select
                      name={`transaction-${i}-buyer`}
                      value={t.buyer}
                      onChange={onTransactionBuyerChange}
                    >
                      <option value="" />
                      {users.map((u, ui) => (
                        <option
                          key={`transactions-${i}-buyers-${ui}`}
                          value={u}
                        >
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      name={`transaction-${i}-price`}
                      value={t.price}
                      type="number"
                      onChange={onTransactionPriceChange}
                    />
                  </td>
                  <td>
                    <input
                      name={`transaction-${i}-quantity`}
                      value={t.quantity}
                      type="number"
                      min={1}
                      step={1}
                      onChange={onTransactionQuantityChange}
                    />
                  </td>
                  <td>{t.price * t.quantity}</td>
                  <td>
                    <select
                      name={`transaction-${i}-exemptions`}
                      multiple={true}
                      value={t.exemptions}
                      onChange={onTransactionExemptionChange}
                    >
                      {users.map((u, ui) => (
                        <option key={`transactions-${i}-exemptions-${ui}`}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>
                  {users.map((u, ui) => (
                    <td key={`transactions-${i}-users-${ui}`}>
                      {t.exemptions.includes(u)
                        ? 0
                        : Math.floor(
                            (t.price * t.quantity) /
                              (users.length - t.exemptions.length),
                          )}
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      id={`transaction-${i}-remove`}
                      onClick={onTransactionRemoveClick}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={onTransactionAddClick}>
            ＋
          </button>
        </form>
      </div>
      <div>
        <h2>割り勘結果</h2>
        <table border={1}>
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
        </table>
      </div>
      <div>
        <button type="button" onClick={onUrlCopyClick}>
          URL をコピー
        </button>
        <button type="button" onClick={onResetClick}>
          リセット
        </button>
      </div>
    </>
  )
}
