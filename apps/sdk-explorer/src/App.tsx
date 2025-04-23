import {hues} from '@sanity/color'
import {SanityMonogram} from '@sanity/logos'
import {Box, Card, Container, Flex, Inline, Text} from '@sanity/ui'
import {type JSX} from 'react'
import {BrowserRouter, Link, Route, Routes} from 'react-router'
import {createGlobalStyle} from 'styled-components'

import ScrollOnPathChange from './components/ScollOnPathChange'
import DocumentSearch from './examples/document-collections/DocumentSearch/DocumentSearch'
import DocumentTable from './examples/document-collections/DocumentTable/DocumentTable'
import PreviewGrid from './examples/document-collections/PreviewGrid/PreviewGrid'
import PreviewList from './examples/document-collections/PreviewList/PreviewList'
import MoviesByActor from './examples/groq/MoviesByActor/MoviesByActor'
import Home from './Home'

const Body = createGlobalStyle`
  body {
    background-color: ${hues.gray['50'].hex};
  }
`

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Body />
      <ScrollOnPathChange />
      <Card style={{position: 'relative'}} tone="transparent">
        <Card
          tone="transparent"
          shadow={1}
          marginBottom={5}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 3,
            backgroundColor: 'white',
          }}
        >
          <Box paddingX={4}>
            <Flex align="center" justify="space-between" style={{height: 52}}>
              <Text as="h1" size={2} weight="medium">
                <Link to="/" style={{color: 'inherit'}}>
                  <Flex align="center" gap={3}>
                    <SanityMonogram style={{margin: 0}} />
                    SDK Explorer
                  </Flex>
                </Link>
              </Text>
              <Inline space={4}>
                <Text weight="medium" size={1}>
                  <a href="/">Home</a>
                </Text>
                <Text weight="medium" size={1}>
                  <a href="https://sdk-docs.sanity.dev">SDK Docs</a>
                </Text>
                <Text weight="medium" size={1}>
                  <a href="https://github.com/sanity-io/sdk">GitHub</a>
                </Text>
              </Inline>
            </Flex>
          </Box>
        </Card>
        <Container width={2} padding={4}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/document-collections/document-search" element={<DocumentSearch />} />
            <Route path="/document-collections/document-table" element={<DocumentTable />} />
            <Route path="/document-collections/preview-list" element={<PreviewList />} />
            <Route path="/document-collections/preview-grid" element={<PreviewGrid />} />
            <Route path="/groq/movies-by-actor" element={<MoviesByActor />} />
          </Routes>
        </Container>
      </Card>
    </BrowserRouter>
  )
}
