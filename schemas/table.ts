import {defineField, defineArrayMember} from 'sanity'

import TableInput from '../components/table/TableInput'

export const tableCellTextSchema = defineField({
  name: 'cellString',
  description: `It's the content`,
  type: 'string',
  validation: (rule) =>
    rule.custom((value) => {
      return value === 'invalid' ? "Text cannot be 'invalid'" : true
    }),
})

export const tableCellNumberSchema = defineField({
  name: 'cellNumber',
  type: 'number',
  validation: (rule) => rule.min(0).max(100),
})

export const tableCellBooleanSchema = defineField({
  name: 'cellBoolean',
  type: 'boolean',
  validation: (rule) => rule.custom((value) => (value === true ? true : `Must be true`)),
})

export const tableCellReferenceSchema = defineField({
  name: 'cellReference',
  type: 'reference',
  to: [{type: 'report'}],
})

export const tableCellPortableTextSchema = defineField({
  name: 'cellArray',
  type: 'array',
  of: [{type: 'block'}],
})

export const tableCellSchema = defineArrayMember({
  name: 'cell',
  type: 'object',
  fields: [
    tableCellTextSchema,
    // tableCellNumberSchema,
    // tableCellReferenceSchema,
    // tableCellPortableTextSchema,
    // tableCellBooleanSchema,
    defineField({
      name: 'colSpan',
      type: 'number',
      placeholder: 'colSpan',
    }),
    // defineField({
    //   name: 'rowSpan',
    //   type: 'number',
    // }),
  ],
})

export const tableCellsSchema = defineField({
  name: 'cells',
  type: 'array',
  of: [tableCellSchema],
})

export const tableRowSchema = defineArrayMember({
  name: 'row',
  type: 'object',
  fields: [tableCellsSchema],
})

export const tableSchema = {
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      type: 'array',
      of: [tableRowSchema],
    }),
  ],
  components: {
    input: TableInput,
  },
  options: {
    debug: true,
    compact: true,
  },
}
