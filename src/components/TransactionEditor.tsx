import {
  Button,
  Input,
  MultiSelect,
  NumberInput,
  Select,
  Table,
} from '@mantine/core'
import React from 'react'
import { Transaction } from '../types'

export type TransactonEditorProps = Readonly<{
  onSubmit: React.FormEventHandler<HTMLFormElement>
  onTransactionAddClick: () => any
  onTransactionBuyerChange: (i: number, v: string) => unknown
  onTransactionDownClick: (i: number) => any
  onTransactionExemptionChange: (i: number, v: string[]) => any
  onTransactionItemChange: (i: number, v: string) => any
  onTransactionPriceChange: (i: number, v: number) => any
  onTransactionQuantityChange: (i: number, v: number) => any
  onTransactionRemoveClick: (i: number) => any
  onTransactionUpClick: (i: number) => any
  transactions: Transaction[]
  users: string[]
}>

export const TransactonEditor: React.FC<TransactonEditorProps> = ({
  onSubmit,
  onTransactionAddClick,
  onTransactionBuyerChange,
  onTransactionDownClick,
  onTransactionExemptionChange,
  onTransactionItemChange,
  onTransactionPriceChange,
  onTransactionQuantityChange,
  onTransactionRemoveClick,
  onTransactionUpClick,
  transactions,
  users,
}) => {
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
