/* eslint-disable no-console */
import fs from 'fs'

const indexHtmlPath = './.sanity/runtime/index.html'

function updateTitle() {
  console.log('Updating site title…')

  try {
    if (!fs.existsSync(indexHtmlPath)) {
      console.error(`File not found: ${indexHtmlPath}`)
      return
    }

    const titleRegex = /<title>(.*?)<\/title>/i

    const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8')
    const newHtml = baseHtml.replace(titleRegex, '<title>Sanity App SDK Explorer</title>')

    fs.writeFileSync(indexHtmlPath, newHtml)

    console.log('Updated site title')
  } catch (e) {
    console.error('Error updating site title:', e)
  }
}

updateTitle()
