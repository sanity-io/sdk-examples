import {SanityMonogram} from '@sanity/logos'
import {Box, Card, Container, Flex, Inline, Text} from '@sanity/ui'
import {type JSX} from 'react'
import {BrowserRouter, Link, Route, Routes} from 'react-router'

import DocumentTable from './document-collections/DocumentTable/DocumentTable'
import PreviewGrid from './document-collections/PreviewGrid/PreviewGrid'
import PreviewList from './document-collections/PreviewList/PreviewList'
import MoviesByActor from './groq/MoviesByActor/MoviesByActor'
import Home from './Home'

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Card style={{position: 'relative'}}>
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
                <Link to="/">
                  <Text weight="medium" size={1}>
                    Home
                  </Text>
                </Link>
              </Inline>
            </Flex>
          </Box>
        </Card>
        <Container width={2} padding={4}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/document-collections/preview-list" element={<PreviewList />} />
            <Route path="/document-collections/preview-grid" element={<PreviewGrid />} />
            <Route path="/document-collections/document-table" element={<DocumentTable />} />
            <Route path="/groq/movies-by-actor" element={<MoviesByActor />} />
          </Routes>
        </Container>
      </Card>
    </BrowserRouter>
  )
}
