import { SanityMonogram } from '@sanity/logos'
import { AuthBoundary } from '@sanity/sdk-react/components'
import { useAuthState, useLogOut } from '@sanity/sdk-react/hooks'
import { Button, Card, Flex, Inline, Text } from '@sanity/ui'
import { BrowserRouter, Link, Route, Routes } from 'react-router'
import PreviewGrid from './document-collections/PreviewGrid/PreviewGrid'
import PreviewList from './document-collections/PreviewList/PreviewList'
import Home from './Home'
import UserProfile from './users/UserProfile/UserProfile'

export default function App() {
  const authState = useAuthState()
  const logOut = useLogOut()

  return (
    <BrowserRouter>
      <Card style={{ position: 'relative' }}>
        <Card
          tone='transparent'
          shadow={3}
          marginTop={2}
          marginX={2}
          marginBottom={5}
          paddingX={4}
          radius={3}
          style={{
            position: 'sticky',
            top: 8,
            zIndex: 3,
            backgroundColor: 'hsl(0deg 0% 100% / 0.5',
            backdropFilter: 'blur(15px) brightness(110%)',
          }}
        >
          <Flex align='center' justify='space-between' style={{ height: 48 }}>
            <Text as='h1' size={2} weight='medium'>
              <Link to='/' style={{ color: 'inherit' }}>
                <Flex align='center' gap={3}>
                  <SanityMonogram />
                  SDK Explorer
                </Flex>
              </Link>
            </Text>
            <Inline space={4}>
              <Link to='/'>
                <Text weight='medium' size={1}>
                  Home
                </Text>
              </Link>
              {authState?.type === 'logged-in' && (
                <Button mode='ghost' text='Log out' onClick={logOut} />
              )}
            </Inline>
          </Flex>
        </Card>
        <AuthBoundary>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/document-collections/preview-list'
              element={<PreviewList />}
            />
            <Route
              path='/document-collections/preview-grid'
              element={<PreviewGrid />}
            />
            <Route path='/users/user-profile' element={<UserProfile />} />
          </Routes>
        </AuthBoundary>
      </Card>
    </BrowserRouter>
  )
}
