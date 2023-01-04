import { MantineProvider } from '@mantine/core'
import React from 'react'
import { Caluclator } from './components/calculator.jsx'
import { Footer } from './components/footer.jsx'
import { Header } from './components/header.jsx'

export const App: React.FC = () => (
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Header />
    <Caluclator />
    <Footer />
  </MantineProvider>
)
