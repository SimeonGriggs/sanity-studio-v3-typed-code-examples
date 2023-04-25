import {ObjectItemProps} from 'sanity'
import {CheckmarkCircleIcon} from '@sanity/icons'
import {Card, Flex, Box, Button} from '@sanity/ui'
import {ListItemValue} from './types'
import {useMultiSelectContext} from './MultiSelectContext'
import {MouseEvent, useCallback} from 'react'

export function ListItemItem(props: ObjectItemProps<ListItemValue>) {
  const {selected, toggleSelected} = useMultiSelectContext()
  const isSelected = selected.includes(props.value._key)

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      toggleSelected(event.currentTarget.value)
    },
    [toggleSelected]
  )

  return (
    <Card tone={isSelected ? `primary` : `default`}>
      <Flex align="center" paddingLeft={2}>
        <Button
          value={props.value._key}
          icon={CheckmarkCircleIcon}
          mode="bleed"
          onClick={handleClick}
        />
        <Box flex={1}>{props.renderDefault(props)}</Box>
      </Flex>
    </Card>
  )
}
