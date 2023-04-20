import {Grid, Button} from '@sanity/ui'
import {NumberInputProps, set} from 'sanity'
import React from 'react'

const MAX_RATING = 10

export default function RatingSelector(props: NumberInputProps) {
  const {onChange, value} = props

  const handleScore = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const value = Number(event.currentTarget.value)
      onChange(set(value))
    },
    [onChange]
  )

  return (
    <Grid columns={MAX_RATING} gap={1}>
      {Array.from({length: MAX_RATING}).map((_, index) => (
        <Button
          key={index}
          mode={value === index + 1 ? 'default' : 'ghost'}
          tone={value === index + 1 ? 'primary' : 'default'}
          text={index + 1}
          value={index + 1}
          onClick={handleScore}
        />
      ))}
    </Grid>
  )
}
