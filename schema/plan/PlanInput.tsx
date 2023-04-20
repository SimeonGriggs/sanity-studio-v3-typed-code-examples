import {StringInputProps, set} from 'sanity'
import {Stack, Button, Grid, Label, Text} from '@sanity/ui'
import {useCallback, createElement} from 'react'
import {PLANS} from './planType'

export function PlanInput(props: StringInputProps) {
  const {value, onChange} = props

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextValue = event.currentTarget.value
      onChange(set(nextValue))
    },
    [onChange]
  )

  return (
    <Grid columns={PLANS.length} gap={3}>
      {PLANS.map((plan) => (
        <Button
          key={plan.value}
          value={plan.value}
          mode={value === plan.value ? `default` : `ghost`}
          tone={value === plan.value ? `primary` : `default`}
          onClick={handleClick}
        >
          <Stack space={3} padding={2}>
            <Text size={4} align="right">
              {createElement(plan.icon)}
            </Text>
            <Label>{plan.title}</Label>
            <Text>{plan.description}</Text>
          </Stack>
        </Button>
      ))}
    </Grid>
  )
}
