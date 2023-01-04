import { MantineProvider } from '@mantine/core'
import React from 'react'
import { Caluclator } from './components/Calculator.jsx'
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'

export const App: React.FC = () => (
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Header />
    <Caluclator />
    <Footer />
  </MantineProvider>
)
