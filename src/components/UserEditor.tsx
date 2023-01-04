import { Button, Input } from '@mantine/core'
import React from 'react'

export type UserEditorProps = Readonly<{
  onSubmit: React.FormEventHandler<HTMLFormElement>
  onUserAddClick: React.MouseEventHandler<HTMLButtonElement>
  onUserInputChange: (i: number, v: string) => any
  onUserInputKeyUp: React.KeyboardEventHandler<HTMLInputElement>
  onUserRemoveClick: (i: number) => any
  users: string[]
}>

export const UserEditor: React.FC<UserEditorProps> = ({
  onSubmit,
  onUserAddClick,
  onUserInputChange,
  onUserInputKeyUp,
  onUserRemoveClick,
  users,
}) => {
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
