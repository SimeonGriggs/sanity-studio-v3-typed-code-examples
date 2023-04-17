import {Box, Stack, Button, Flex, Grid} from '@sanity/ui'
import {ObjectInputMember, ObjectInputProps, set} from 'sanity'
import React from 'react'

type DurationValue = {
  _type?: 'duration'
  start?: number
  end?: number
}

const DEFAULT_START = '09:00'
const DEFAULT_END = '17:00'

export default function DurationInput(props: ObjectInputProps<DurationValue>) {
  const {onChange, members} = props

  const handleChange = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const {name, value} = event.currentTarget

      if (name === 'reset') {
        // Reset the entire object with default values
        onChange(
          set({
            _type: 'duration',
            start: DEFAULT_START,
            end: DEFAULT_END,
          })
        )
      } else if (name === 'start' || name === 'end') {
        // Set the "_type" field if it's not already set
        // Update only the "start" or "end" field value
        // The second parameter is a "Path" to the field from the root object
        const patches =
          props?.value?._type === 'duration'
            ? [set(value, [name])]
            : [set('duration', ['_type']), set(value, [name])]

        onChange(patches)
      }
    },
    [onChange, props.value?._type]
  )

  const startMember = members.find((m) => m.kind === 'field' && m.name === 'start')
  const endMember = members.find((m) => m.kind === 'field' && m.name === 'end')

  if (!startMember || !endMember) {
    console.error(`Missing "start" or "end" member in DurationInput: "${props.schemaType.name}"`)
    return props.renderDefault(props)
  }

  const renderProps = {
    renderField: props.renderField,
    renderInput: props.renderInput,
    renderItem: props.renderItem,
    renderPreview: props.renderPreview,
  }

  return (
    <Stack space={3}>
      <Grid columns={2} gap={3}>
        <Flex align="flex-end" gap={2}>
          <Box flex={1}>
            <ObjectInputMember member={startMember} {...renderProps} />
          </Box>
          <Button
            mode="ghost"
            text="Default"
            name="start"
            value={DEFAULT_START}
            onClick={handleChange}
          />
        </Flex>
        <Flex align="flex-end" gap={2}>
          <Box flex={1}>
            <ObjectInputMember member={endMember} {...renderProps} />
          </Box>
          <Button
            mode="ghost"
            text="Default"
            name="end"
            value={DEFAULT_END}
            onClick={handleChange}
          />
        </Flex>
      </Grid>
      <Button text="Reset Duration" mode="ghost" name="reset" onClick={handleChange} />
    </Stack>
  )
}
