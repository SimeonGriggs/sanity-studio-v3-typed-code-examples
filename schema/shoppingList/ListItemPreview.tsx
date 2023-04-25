import {Card} from '@sanity/ui'
import {PreviewProps} from 'sanity'

import {useMultiSelectContext} from './MultiSelectContext'

export default function ListItemPreview(props: PreviewProps) {
  const {selected} = useMultiSelectContext()
  const isSelected = selected.includes(props?._key)
  console.log(selected, props._key)

  return <Card tone={isSelected ? `primary` : `default`}>{props.renderDefault(props)}</Card>
}
