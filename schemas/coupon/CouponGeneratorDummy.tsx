import {Box, Button, Flex} from '@sanity/ui'
import type {StringInputProps} from 'sanity'

export default function CouponGenerator(props: StringInputProps) {
  return (
    <Flex gap={3} align="center">
      <Box flex={1}>{props.renderDefault(props)}</Box>
      <Button mode="ghost" text="Generate coupon" />
    </Flex>
  )
}
