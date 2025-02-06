import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  __experimental_coreAppConfiguration: {
    appLocation: './src/App.tsx'
  },
})
