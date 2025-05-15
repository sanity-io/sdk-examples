import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  app: {
    organizationId: 'oSyH1iET5',
    entry: './src/App.tsx',
  },
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  vite: async (viteConfig: any) => {
    const {default: tailwindcss} = await import('@tailwindcss/vite')
    return {
      ...viteConfig,
      server: {
        ...viteConfig.server,
        fs: {
          ...viteConfig.server?.fs,
          strict: false,
        },
      },
      plugins: [...viteConfig.plugins, tailwindcss()],
    }
  },
})
