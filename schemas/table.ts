import {defineField, defineArrayMember} from 'sanity'

import TableField from '../components/table/TableField'
import TableInput from '../components/table/TableInput'

// export const tableCellNumberSchema = defineField({
//   name: 'cellNumber',
//   type: 'number',
//   validation: (rule) => rule.min(0).max(100),
// })

// export const tableCellBooleanSchema = defineField({
//   name: 'cellBoolean',
//   type: 'boolean',
//   validation: (rule) => rule.custom((value) => (value === true ? true : `Must be true`)),
// })

// export const tableCellReferenceSchema = defineField({
//   name: 'cellReference',
//   type: 'reference',
//   to: [{type: 'report'}],
// })

// export const tableCellPortableTextSchema = defineField({
//   name: 'cellArray',
//   type: 'array',
//   of: [{type: 'block'}],
// })

export const tableCellSchema = defineArrayMember({
  name: 'cell',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      type: 'string',
      validation: (rule) =>
        rule.custom((value) => {
          return value === 'invalid' ? "Text cannot be 'invalid'" : true
        }),
    }),
  ],
})

export const tableSchema = {
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    // All cells are stored in a flat array with positional data
    // Row merging wouldn't work without it
    defineField({
      name: 'cells',
      type: 'array',
      of: [tableCellSchema],
    }),
  ],
  components: {
    field: TableField,
    input: TableInput,
  },
  options: {
    debug: true,
    compact: true,
  },
}
