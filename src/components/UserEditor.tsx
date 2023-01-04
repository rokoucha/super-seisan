import { Button, Input } from '@mantine/core'
import React, { useCallback } from 'react'
import { spliceToNew } from '../utils'

export type UserEditorProps = Readonly<{
  setUsers: React.Dispatch<React.SetStateAction<string[]>>
  users: string[]
}>

export const UserEditor: React.FC<UserEditorProps> = ({ setUsers, users }) => {
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

  return (
    <form onSubmit={onSubmit}>
      <ul>
        {users.map((u, i) => (
          <li key={`users-${i}`}>
            <Input
              value={u}
              onChange={(e) => onUserInputChange(i, e.target.value)}
              onKeyUp={onUserInputKeyUp}
            />
            <Button onClick={() => onUserRemoveClick(i)}>×</Button>
          </li>
        ))}
      </ul>
      <Button onClick={onUserAddClick}>＋</Button>
    </form>
  )
}
