import {StringInputProps, set} from 'sanity'
import {Stack, Button, Grid, Label, Text} from '@sanity/ui'
import {UserIcon, UsersIcon, EarthGlobeIcon} from '@sanity/icons'
import React from 'react'

const PLANS = [
  {icon: UserIcon, id: 'free', title: 'Free', description: 'For personal use'},
  {icon: UsersIcon, id: 'premium', title: 'Premium', description: 'For small teams'},
  {icon: EarthGlobeIcon, id: 'enterprise', title: 'Enterprise', description: 'For large teams'},
]

export default function PlanSelector(props: StringInputProps) {
  const {value, onChange} = props

  const handleClick = React.useCallback(
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
          key={plan.id}
          value={plan.id}
          mode={value === plan.id ? `default` : `ghost`}
          tone={value === plan.id ? `primary` : `default`}
          onClick={handleClick}
        >
          <Stack space={3} padding={2}>
            <Text size={4} align="right">
              {React.createElement(plan.icon)}
            </Text>
            <Label>{plan.title}</Label>
            <Text>{plan.description}</Text>
          </Stack>
        </Button>
      ))}
    </Grid>
  )
}
