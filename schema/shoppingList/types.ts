import {KeyedObject} from 'sanity'

export type ListItemValue = KeyedObject & {
  description?: string
  procured?: boolean
}
