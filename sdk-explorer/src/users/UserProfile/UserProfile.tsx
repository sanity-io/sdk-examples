import { AuthStateType } from '@sanity/sdk'
import { useAuthState, useCurrentUser } from '@sanity/sdk-react/hooks'
import { Avatar, Card, Container, Flex, Grid, Stack, Text } from '@sanity/ui'
import ExampleLayout from '../../ExampleLayout'

export default function UserProfile() {
  // Use the `useAuthState` hook to ensure there's currently a logged in user
  const { type } = useAuthState()

  // Use the `useCurrentUser` hook to get the current user.
  // The returned object contains fields like the user's name, profile image, email address, roles, and authentication provider
  const user = useCurrentUser()

  // Render a user profile if the authentication state indicated a logged in user and a user object is available
  return type === AuthStateType.LOGGED_IN && user ? (
    <ExampleLayout
      title='User profile'
      codeUrl='https://github.com/sanity-io/sdk-examples/blob/main/sdk-explorer/src/users/UserProfile/UserProfile.tsx'
      hooks={['useAuthState', 'useCurrentUser']}
      styling='Sanity UI'
    >
      <Container width={1}>
        <Card padding={4} margin={2} radius={3} shadow={3}>
          <Flex justify='center' marginBottom={5}>
            <Avatar src={user?.profileImage} size={3} />
          </Flex>
          <Text as='h2' size={4} weight='medium' align='center'>
            {user?.name}
          </Text>
          <Stack space={3} marginTop={5} marginBottom={4}>
            <Grid columns={2} gap={4} as='dl'>
              <Text as='dt' align='right' muted>
                Email address
              </Text>
              <Text as='dd'>{user?.email}</Text>
              <Text as='dt' align='right' muted>
                Roles
              </Text>
              <Text as='dd'>
                {user?.roles.map((role) => role.title).join(', ')}
              </Text>
              <Text as='dt' align='right' muted>
                Provider
              </Text>
              <Text as='dd'>{user?.provider}</Text>
            </Grid>
          </Stack>
        </Card>
      </Container>
    </ExampleLayout>
  ) : (
    // Render a placeholder if there's no user currently logged in
    <Container padding={5}>
      <Text as='h2' size={4} align='center'>
        Nobody home! Try logging in?
      </Text>
    </Container>
  )
}
