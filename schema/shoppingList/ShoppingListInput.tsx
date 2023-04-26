import {useCallback, useState} from 'react'
import {ArrayOfObjectsInputProps} from 'sanity'

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
      {props.renderDefault({...props, arrayFunctions: MultiSelectFunctions})}
    </MultiSelectProvider>
  )
}
