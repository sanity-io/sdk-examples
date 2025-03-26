import {LaunchIcon} from '@sanity/icons'
import {Button} from '@sanity/ui'
import {type JSX} from 'react'
/**
 * CTA for viewing example code on example pages
 */
export default function ViewCode({url}: {url: string}): JSX.Element {
  return (
    <Button
      as="a"
      href={url}
      target="_blank"
      mode="ghost"
      text="View the code on GitHub"
      fontSize={2}
      padding={4}
      iconRight={LaunchIcon}
    />
  )
}
