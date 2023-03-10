import React from 'react'
import {ArrayOfObjectsInputProps, insert} from 'sanity'
import {Card, Stack, Code, Autocomplete} from '@sanity/ui'
import {randomKey} from '@sanity/util/content'

// A custom 'input' component replaces the built-in component, below the title and description
// Add to your schema like this:
// components: { input: ArrayOfObjectsInput }
export default function ArrayOfObjectsInput(props: ArrayOfObjectsInputProps) {
  const {onChange, schemaType} = props
  const [value, setValue] = React.useState(``)

  // When selected, add a new item to the end of the array
  const handleChange = React.useCallback(
    (newValue: string) => {
      onChange(insert([{_type: newValue, _key: randomKey(12)}], 'after', [-1]))
      setValue(newValue)
      setTimeout(() => setValue(''), 0)
    },
    [onChange]
  )

  const renderValue = React.useCallback((value: string, option?: {id: string; value: string}) => {
    if (!option) return value

    return ''
  }, [])

  return (
    <Card tone="primary">
      <Stack space={3}>
        <Code>ArrayOfObjectsInput</Code>

        {/* The default Array input */}
        {props.renderDefault(props)}

        {/* See https://www.sanity.io/ui/docs/component/autocomplete */}
        {schemaType.of.length > 0 ? (
          <Autocomplete
            id="array-type-selector"
            options={schemaType.of.map((memberType) => ({
              id: memberType.name,
              value: memberType.name,
              label: memberType.title ?? memberType.name,
            }))}
            placeholder="Search item types"
            onChange={handleChange}
            renderValue={renderValue}
            value={value}
          />
        ) : null}
      </Stack>
    </Card>
  )
}
