import {useCallback, useState} from 'react'
import {ArrayOfObjectsInputProps} from 'sanity'
import {Stack} from '@sanity/ui'

import {MultiSelectProvider} from './MultiSelectContext'
import {MultiSelectFunctions} from './MultiSelectFunctions'

export function ShoppingListInput(props: ArrayOfObjectsInputProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleSelected = useCallback((key: string) => {
    setSelected((current) =>
      current.includes(key) ? current.filter((selectedId) => selectedId !== key) : [...current, key]
    )
  }, [])

  const selectAll = useCallback((keys: string[]) => {
    setSelected(keys)
  }, [])

  return (
    <MultiSelectProvider selected={selected} toggleSelected={toggleSelected} selectAll={selectAll}>
      <Stack space={2}>
        {props.renderDefault(props)}
        <MultiSelectFunctions {...props} />
      </Stack>
    </MultiSelectProvider>
  )
}
