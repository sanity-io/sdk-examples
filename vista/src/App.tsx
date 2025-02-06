import {SanityConfig} from '@sanity/sdk'
import {SanityApp} from '@sanity/sdk-react/components'
import {ThemeProvider} from '@sanity/ui'
import {buildTheme} from '@sanity/ui/theme'
import ProjectsAndDatasets from './ProjectsAndDatasets'

const theme = buildTheme()

export function App() {
  const sanityConfig: SanityConfig = {
    auth: {
      authScope: 'global',
    },
    projectId: '',
    dataset: '',
    /*
     * Apps can access several different projects!
     * Add the below configuration if you want to connect to a specific project.
     */
    // projectId: 'my-project-id',
    // dataset: 'my-dataset',
  }

  return (
    <ThemeProvider theme={theme}>
      <SanityApp sanityConfig={sanityConfig}>
        <ProjectsAndDatasets />
      </SanityApp>
    </ThemeProvider>
  )
}

export default App
