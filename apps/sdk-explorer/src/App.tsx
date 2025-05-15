import './inter.css'

import {ResourceProvider} from '@sanity/sdk-react'
import {Flex, Spinner, ThemeProvider} from '@sanity/ui'
import {buildTheme, ThemeConfig} from '@sanity/ui/theme'
import {type JSX, StrictMode, Suspense} from 'react'
import {createGlobalStyle} from 'styled-components'

import Explorer from './Explorer'

const themeConfig: ThemeConfig = {
  media: [320, 600],
}

const theme = buildTheme(themeConfig)

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

export default function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <StrictMode>
        <GlobalStyle />
        <Suspense fallback={<Loading />}>
          <ResourceProvider
            projectId={sanityConfig.projectId}
            dataset={sanityConfig.dataset}
            fallback={<Loading />}
          >
            <Explorer />
          </ResourceProvider>
        </Suspense>
      </StrictMode>
    </ThemeProvider>
  )
}
