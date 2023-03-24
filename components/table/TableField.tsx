import {ObjectFieldProps} from 'sanity'

// Removes nesting level from the table object
export default function TableField(props: ObjectFieldProps) {
  return props.renderDefault({
    ...props,
    level: props.level - 1,
  })
}
