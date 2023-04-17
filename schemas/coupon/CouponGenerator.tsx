import {Box, Button, Code, Flex} from '@sanity/ui'
import React from 'react'
import type {StringInputProps} from 'sanity'
import {set} from 'sanity'

export default function CodeGenerator(props: StringInputProps) {
  // onChange handles patches to this field
  const {onChange} = props

  const generateCoupon = React.useCallback(() => {
    const coupon = Math.random().toString(36).substring(2, 6).toUpperCase()
    // "set()" will write a value to this field, if a "path" parameter is not supplied
    onChange(set(coupon))
  }, [onChange])

  return (
    <Flex gap={3} align="center">
      <Box flex={1}>{props.renderDefault(props)}</Box>
      {/* Display the value in a monospaced font */}
      {props.value ? <Code size={4}>{props.value}</Code> : null}
      <Button mode="ghost" onClick={generateCoupon} text="Generate coupon" />
    </Flex>
  )
}
