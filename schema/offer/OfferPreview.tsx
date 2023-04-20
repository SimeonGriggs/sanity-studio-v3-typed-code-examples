import React, {PropsWithChildren} from 'react'
import {Badge, Flex, Box, BadgeProps} from '@sanity/ui'
import {PreviewProps} from 'sanity'

type CastPreviewProps = PreviewProps & {
  discount?: number
  validUntil?: string
}

export default function OfferPreview(props: PreviewProps) {
  // Item previews don't have access to the field's value or path
  // So we are passing in non-standard props in the schema
  // And recasting the type here to match
  const castProps = props as CastPreviewProps
  const {discount, validUntil} = castProps

  const badgeProps: (PropsWithChildren & BadgeProps) | null = React.useMemo(() => {
    if (!validUntil) {
      return null
    }

    const validUntilDate = new Date(validUntil)

    if (validUntilDate < new Date()) {
      // Offer has expired
      return {
        children: 'Expired',
        tone: 'critical',
      }
    } else if (validUntilDate < new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)) {
      // Offer expires in less than a week
      return {
        children: 'Expiring soon',
        tone: 'caution',
      }
    } else {
      // Offer is still valid
      return {
        children: 'Valid',
        tone: 'positive',
      }
    }
  }, [validUntil])

  const subtitle = !discount
    ? 'No discount'
    : validUntil
    ? `${discount}% discount until ${validUntil}`
    : `${discount}% discount`

  return (
    <Flex align="center">
      {/* Customize the subtitle for the built-in preview */}
      <Box flex={1}>{props.renderDefault({...props, subtitle})}</Box>
      {/* Add our custom badge */}
      {badgeProps?.children ? (
        <Badge mode="outline" tone={badgeProps.tone}>
          {badgeProps.children}
        </Badge>
      ) : null}
    </Flex>
  )
}
