import './inter.css'

import {SanityApp} from '@sanity/sdk-react'
import {Flex, Spinner, ThemeProvider} from '@sanity/ui'
import {buildTheme} from '@sanity/ui/theme'
import {StrictMode, Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import {createGlobalStyle} from 'styled-components'

import App from './App.tsx'

const theme = buildTheme()

const sanityConfig = {
  projectId: 'v28v5k8m',
  dataset: 'production',
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

function Loading() {
  return (
    <Flex align="center" justify="center" style={{inlineSize: '100dvw', blockSize: '100dvh'}}>
      <Spinner />
    </Flex>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loading />}>
        <SanityApp config={[sanityConfig]} fallback={<Loading />}>
          <App />
        </SanityApp>
      </Suspense>
    </ThemeProvider>
  </StrictMode>,
)
