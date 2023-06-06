import { Button, Container, Flex, Stack, Title } from '@mantine/core'
import React, { useCallback, useEffect, useState } from 'react'
import { super_seisan } from '../generated/protobuf'
import { DividedResult } from './DividedResult'
import { TransactionEditor } from './TransactionEditor'
import { UserEditor } from './UserEditor'
import { Currency, CurrencyEditor } from './CurrencyEditor'
import { Transaction } from '../types'

export const Calculator: React.FC = () => {
  const [initialized, setInitialized] = useState(false)
  const [users, setUsers] = useState<string[]>([''])
  const [currencies, setCurrencies] = useState<Currency[]>([])
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
        currencySymbol: t.currencySymbol ?? null,
      })),
    )
    setCurrencies(decoded.currencies)

    setInitialized(true)

    console.debug('hash loaded!')
  }, [])

  useEffect(() => {
    if (!initialized) return

    const data = super_seisan.Payload.encode({
      transactions: transactions,
      users: users,
      currencies: currencies,
    }).finish()
    const hash = btoa(String.fromCharCode(...data))
    window.location.hash = hash

    console.debug('hash saved!')
  }, [initialized, transactions, users, currencies])

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
    setCurrencies([])
  }, [])

  return (
    <div>
      <Container>
        <Stack spacing="xl">
          <Stack>
            <Title order={2}>支払い関係者</Title>
            <Flex>
              <UserEditor setUsers={setUsers} users={users} />
            </Flex>
          </Stack>
          <Stack>
            <Title order={2}>為替レート設定</Title>
            <CurrencyEditor
              setCurrencies={setCurrencies}
              currencies={currencies}
            />
          </Stack>
          <Stack>
            <Title order={2}>支払い一覧</Title>
            <TransactionEditor
              setTransactions={setTransactions}
              transactions={transactions}
              users={users}
              currencies={currencies}
            />
          </Stack>
          <Stack>
            <Title order={2}>
              割り勘結果{currencies.length > 0 && ` (JPY)`}
            </Title>
            <DividedResult
              users={users}
              transactions={transactions}
              currencies={currencies}
            />
          </Stack>
          <Flex gap="md" justify="flex-end">
            <Button onClick={onUrlCopyClick}>URL をコピー</Button>
            <Button onClick={onResetClick} color="red">
              リセット
            </Button>
          </Flex>
        </Stack>
      </Container>
    </div>
  )
}
