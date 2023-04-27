import {useCallback, useState} from 'react'
import {ObjectFieldProps, ArrayFieldProps} from 'sanity'
import {Button} from '@sanity/ui'
import {EllipsisVerticalIcon} from '@sanity/icons'

import {MultiSelectProvider} from './MultiSelectContext'
import {MultiSelectActions} from './MultiSelectActions'

export function ShoppingListField(props: ArrayFieldProps) {
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
      {props.renderDefault({
        ...props,
        actions: <MultiSelectActions {...props} />,
      })}
    </MultiSelectProvider>
  )
}
