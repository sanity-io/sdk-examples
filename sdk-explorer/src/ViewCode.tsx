import { LaunchIcon } from '@sanity/icons'
import { Button } from '@sanity/ui'

/**
 * CTA for viewing example code on example pages
 */
export default function ViewCode({ url }: { url: string }) {
  return (
    <Button
      as='a'
      href={url}
      target='_blank'
      mode='ghost'
      text='View on GitHub'
      fontSize={2}
      padding={4}
      iconRight={LaunchIcon}
    />
  )
}
