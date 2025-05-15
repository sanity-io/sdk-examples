/* eslint-disable no-console */
import fs from 'fs'

const indexHtmlPath = './.sanity/runtime/index.html'

function updateTitle() {
  try {
    if (!fs.existsSync(indexHtmlPath)) {
      console.error(`File not found: ${indexHtmlPath}`)
      return
    }

    let html = fs.readFileSync(indexHtmlPath, 'utf8')

    const titleRegex = /<title>(.*?)<\/title>/i

    html = html.replace(titleRegex, '<title>Sanity App SDK Explorer</title>')

    fs.writeFileSync(indexHtmlPath, html)

    console.log('Updated site title')
  } catch (e) {
    console.error('Error updating site title:', e)
  }
}

updateTitle()
