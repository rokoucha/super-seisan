import {
  Anchor,
  Container,
  createStyles,
  Footer as MantineFooter,
  Text,
} from '@mantine/core'
import React from 'react'

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  link: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}))

export const Footer: React.FC = () => {
  const { classes } = useStyles()

  return (
    <MantineFooter height={60} mt={30} className={classes.footer}>
      <Container className={classes.inner}>
        <Text color="dimmed" size="sm">
          Made by Rokoucha with ❤️
        </Text>
        <Anchor<'a'>
          className={classes.link}
          color="dimmed"
          href="https://github.com/rokoucha/super-seisan"
          size="sm"
        >
          source code
        </Anchor>
      </Container>
    </MantineFooter>
  )
}
