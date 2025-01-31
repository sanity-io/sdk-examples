import { AuthStateType } from '@sanity/sdk'
import { useAuthState, useCurrentUser } from '@sanity/sdk-react/hooks'
import { Avatar, Card, Container, Flex, Grid, Stack, Text } from '@sanity/ui'

export default function UserProfile() {
  const { type } = useAuthState()
  const user = useCurrentUser()

  return type === AuthStateType.LOGGED_IN && user ? (
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
  ) : (
    <Container padding={5}>
      <Text as='h2' size={4} align='center'>
        Nobody home! Try logging in?
      </Text>
    </Container>
  )
}
