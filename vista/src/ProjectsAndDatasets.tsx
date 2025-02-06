import {createSanityInstance, getGlobalClient, SanityConfig} from '@sanity/sdk'
import {Card, Inline, Label, Select, Stack, Text} from '@sanity/ui'
import {useEffect, useState} from 'react'

export default function Component() {
  const sanityConfig: SanityConfig = {
    projectId: 'flahoy03',
    dataset: '',
  }
  const instance = createSanityInstance(sanityConfig)

  const client = getGlobalClient(instance)

  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState('')
  const [projectDatasets, setProjectDatasets] = useState([])
  const [activeDataset, setActiveDataset] = useState(null)

  /* Get projects user can access on mount */
  useEffect(() => {
    client
      .request({
        uri: '/projects?includeMembers=false',
        method: 'GET',
      })
      .then((response) => {
        const formatted = response.map(({id, displayName}) => ({id, displayName}))
        setProjects(formatted)
      })
  }, [])

  /* When the activeProjectId chaanges, request that project’s datasets */
  useEffect(() => {
    client
      .request({
        uri: `/projects/${activeProjectId}/datasets`,
      })
      .then((response) => {
        setProjectDatasets(response)
        setActiveDataset(response[0])
      })
      .catch(() => {
        setProjectDatasets([])
      })
  }, [activeProjectId])

  return (
    <Card>
      <Inline space={4}>
        <Stack space={2}>
          <Label>Select a project:</Label>
          <Select
            padding={3}
            onChange={(e) => {
              setActiveProjectId(e.target.value)
            }}
          >
            {projects.length ? (
              projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.displayName}
                </option>
              ))
            ) : (
              <option>Loading…</option>
            )}
          </Select>
        </Stack>

        {projectDatasets.length ? (
          <Stack space={2}>
            <Label>Select a dataset:</Label>
            <Select
              padding={3}
              onChange={(e) => {
                const datasetIndex = projectDatasets.findIndex((set) => set.name === e.target.value)
                setActiveDataset(projectDatasets[datasetIndex])
              }}
            >
              {projectDatasets.map((dataset) => (
                <option key={dataset.name} value={dataset.name}>
                  {dataset.name}
                </option>
              ))}
            </Select>
          </Stack>
        ) : (
          <Stack space={2}>
            <Label>Hmm…</Label>
            <Text size={1}>It looks like this project doesn’t have any datasets 🤔</Text>
          </Stack>
        )}
      </Inline>
      {activeDataset ? (
        <pre>
          <code>{JSON.stringify(activeDataset, null, 2)}</code>
        </pre>
      ) : (
        ''
      )}
    </Card>
  )
}
