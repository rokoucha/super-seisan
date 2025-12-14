import {
  Container,
  createStyles,
  Header as MaintineHeader,
  Title,
} from '@mantine/core'
import React from 'react'

const useStyles = createStyles(() => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
}))

export const Header: React.FC = () => {
  const { classes } = useStyles()

  return (
    <MaintineHeader height={60} mb={30}>
      <Container className={classes.header}>
        <Title>スーパー精算</Title>
      </Container>
    </MaintineHeader>
  )
}
