import {useCallback, useState} from 'react'
import {Grid, Button, Stack, Inline, Box} from '@sanity/ui'
import {
  ArrayInputFunctionsProps,
  ArrayOfPrimitivesFunctions,
  ArrayOfPrimitivesInputProps,
} from 'sanity'
import {ArraySchemaType} from 'sanity'

function CustomButton(props: ArrayInputFunctionsProps<string | number | boolean, ArraySchemaType>) {
  const handleAdd = useCallback(() => {
    props.onItemAppend(new Date().toString())
  }, [props])

  return <Button text="It's go time" tone="primary" onClick={handleAdd} />
}

function ConcatenatedButton(
  props: ArrayInputFunctionsProps<string | number | boolean, ArraySchemaType>
) {
  const handleAdd = useCallback(() => {
    props.onItemAppend(new Date().toString())
  }, [props])

  return (
    <Grid columns={2} gap={2}>
      <ArrayOfPrimitivesFunctions {...props} />
      <Button text="Now!" tone="primary" onClick={handleAdd} />
    </Grid>
  )
}

function Blank() {
  return null
}

const OPTIONS = [`Default`, `Replace`, `Concatenate`, `Blank`]

export function ArrayFunctionsItem(props: ArrayOfPrimitivesInputProps) {
  const [currentOption, setCurrentOption] = useState(OPTIONS[0])

  return (
    <Stack space={4}>
      {currentOption === 'Default' ? props.renderDefault(props) : null}
      {currentOption === 'Replace'
        ? props.renderDefault({...props, arrayFunctions: CustomButton})
        : null}
      {currentOption === 'Concatenate'
        ? props.renderDefault({
            ...props,
            arrayFunctions: ConcatenatedButton,
          })
        : null}
      {currentOption === 'Blank' ? props.renderDefault({...props, arrayFunctions: Blank}) : null}

      <Box>
        <Inline space={1}>
          {OPTIONS.map((option) => (
            <Button
              key={option}
              text={option}
              tone="primary"
              mode={option === currentOption ? `default` : `ghost`}
              value={option}
              onClick={(e) => setCurrentOption(e.currentTarget.value)}
            />
          ))}
        </Inline>
      </Box>
    </Stack>
  )
}
