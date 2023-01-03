import { Container, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { Caluclator } from './components/calculator.jsx'
import { Footer } from './components/footer.jsx'
import { Header } from './components/header.jsx'

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: 'sans-serif',
  },
})

const Contents: React.FC = () => (
  <>
    <Header />
    <Container component="main" maxWidth="md">
      <Caluclator />
    </Container>
    <Footer />
  </>
)

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Contents />
  </ThemeProvider>
)
