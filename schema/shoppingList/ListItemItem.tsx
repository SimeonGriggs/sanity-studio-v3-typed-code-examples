import {ObjectItemProps} from 'sanity'
import {CheckmarkCircleIcon, CircleIcon} from '@sanity/icons'
import {Text, Card, Flex, Box, Button} from '@sanity/ui'
import {MouseEvent, useCallback} from 'react'
import {ListItemValue} from './types'
import {useMultiSelectContext} from './MultiSelectContext'

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
    <Card paddingLeft={2}>
      <Flex align="center">
        <Button
          tone={isSelected ? `primary` : `default`}
          value={props.value._key}
          mode={isSelected ? `ghost` : `bleed`}
          onClick={handleClick}
          padding={2}
          style={{borderRadius: `50%`, aspectRatio: `1/1`}}
          //   icon={isSelected ? CheckmarkCircleIcon : CircleIcon}
        >
          <Text size={3}>{isSelected ? <CheckmarkCircleIcon /> : <CircleIcon />}</Text>
        </Button>
        <Box flex={1}>{props.renderDefault(props)}</Box>
      </Flex>
    </Card>
  )
}
