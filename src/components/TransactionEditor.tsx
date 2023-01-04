import {
  Button,
  Input,
  MultiSelect,
  NumberInput,
  Select,
  Table,
} from '@mantine/core'
import React, { useCallback } from 'react'
import { Transaction } from '../types'
import { spliceToNew } from '../utils'

export type TransactonEditorProps = Readonly<{
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  transactions: Transaction[]
  users: string[]
}>

export const TransactonEditor: React.FC<TransactonEditorProps> = ({
  setTransactions,
  transactions,
  users,
}) => {
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => e.preventDefault(),
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

  return (
    <form onSubmit={onSubmit}>
      <Table striped={true}>
        <thead>
          <tr>
            <th rowSpan={2}></th>
            <th rowSpan={2}>品目</th>
            <th rowSpan={2}>支払った人</th>
            <th rowSpan={2}>単価</th>
            <th rowSpan={2}>個数</th>
            <th rowSpan={2}>計</th>
            <th rowSpan={2}>支払い免除</th>
            <th colSpan={users.length}>支払い額</th>
            <th rowSpan={2}></th>
          </tr>
          <tr>
            {users.map((u, i) => (
              <th key={`users-th-${i}`}>{u}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={`transactions-${i}`}>
              <td>
                {i !== 0 ? (
                  <Button onClick={() => onTransactionUpClick(i)}>↑</Button>
                ) : (
                  <></>
                )}
                {transactions.length > i + 1 ? (
                  <Button onClick={() => onTransactionDownClick(i)}>↓</Button>
                ) : (
                  <></>
                )}
              </td>
              <td>
                <Input
                  value={t.item}
                  onChange={(e) => onTransactionItemChange(i, e.target.value)}
                />
              </td>
              <td>
                <Select
                  value={t.buyer}
                  onChange={(v) => onTransactionBuyerChange(i, v ?? '')}
                  data={users}
                />
              </td>
              <td>
                <Input
                  value={t.price}
                  type="number"
                  onChange={(e) =>
                    onTransactionPriceChange(i, parseInt(e.target.value, 10))
                  }
                />
              </td>
              <td>
                <NumberInput
                  value={t.quantity}
                  type="number"
                  min={1}
                  step={1}
                  onChange={(v) => onTransactionQuantityChange(i, v ?? 1)}
                />
              </td>
              <td>{t.price * t.quantity}</td>
              <td>
                <MultiSelect
                  multiple={true}
                  value={t.exemptions}
                  onChange={(v) => onTransactionExemptionChange(i, v)}
                  data={users}
                />
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
                <Button onClick={() => onTransactionRemoveClick(i)}>×</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={onTransactionAddClick}>＋</Button>
    </form>
  )
}
