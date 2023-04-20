import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'report',
  title: 'Report',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'table',
      type: 'table',
    }),
  ],
})
