import {useQuery} from '@sanity/sdk-react'
import {Avatar, Card, Heading, Inline, Label, Select, Stack, Text} from '@sanity/ui'
import {type JSX, useState} from 'react'

import ExampleLayout from '../../ExampleLayout'

interface CastMember {
  _id: string
  name: string
  photo: string
}

interface Movie {
  _id: string
  title: string
  posterImage: string
  releaseDate: string
}

export default function MoviesByActor(): JSX.Element {
  // Get a list of people who are referenced as cast members in more than 1 movie
  const {data: castMembers} = useQuery<CastMember[]>(
    `*[_type == "person" && count(*[_type == "movie" && ^._id in castMembers[].person._ref]) > 1] {
      _id,
      name,
      'photo': image.asset->url
    }`,
  )

  // Create a state variable to store the selected cast member's ID
  // Initialize it with the ID of the first cast member
  const [castMemberId, setCastMemberId] = useState<string>(() => castMembers?.[0]?._id)

  // Construct another query for movies that the cast member has appeared in
  // by passing the cast member's ID as a parameter to the query
  const {data: castMemberMovies} = useQuery<Movie[]>(
    `*[_type == "movie" && $castMemberId in castMembers[].person._ref]{
    _id,
    title,
      'posterImage': poster.asset->url,
      releaseDate,
    }`,
    {
      params: {
        castMemberId: castMemberId,
      },
    },
  )

  return (
    <ExampleLayout
      title="Movies by actor"
      codeUrl="https://github.com/sanity-io/sdk-examples/blob/main/apps/sdk-explorer/src/groq/MoviesByActor/MoviesByActor.tsx"
      hooks={['useQuery']}
      styling="Sanity UI"
    >
      <Stack space={5}>
        {/* Render a select element and populate it with an option for each cast member */}
        <Stack space={3}>
          <Label htmlFor="castMembers">Select a cast member:</Label>
          <Card style={{maxWidth: '48ch'}}>
            <Select
              id="castMembers"
              fontSize={2}
              padding={4}
              value={castMemberId}
              onChange={(e) =>
                setCastMemberId(
                  castMembers?.find((member) => member._id === e.currentTarget.value)?._id || '',
                )
              }
            >
              <option disabled value="default">
                Cast members in more than 1 movie
              </option>
              {castMembers?.map((person) => (
                <option key={person._id} value={person._id}>
                  {person.name}
                </option>
              ))}
            </Select>
          </Card>
        </Stack>

        {/* Render the selected cast member's movies */}
        <Stack space={4}>
          {castMemberId && (
            <Inline space={3}>
              {/* Resize and crop the cast member's photo using Sanity image transformations */}
              <Avatar
                size={3}
                src={`${castMembers?.find((member) => member._id === castMemberId)?.photo}?h=200&w=200&fit=min`}
                color="purple"
              />
              <Heading as="h2">
                {castMembers?.find((member) => member._id === castMemberId)?.name} stars in:
              </Heading>
            </Inline>
          )}
          {castMemberMovies?.map((movie) => (
            <Inline key={movie._id} space={3}>
              <img src={movie.posterImage} alt={movie.title} width={100} />
              <Stack space={3}>
                <Text weight="semibold">{movie.title}</Text>
                <Text>{new Date(movie.releaseDate).getFullYear()}</Text>
              </Stack>
            </Inline>
          ))}
        </Stack>
      </Stack>
    </ExampleLayout>
  )
}
