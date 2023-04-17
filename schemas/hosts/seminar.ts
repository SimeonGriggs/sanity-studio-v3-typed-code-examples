import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seminar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'hosts',
      type: 'hosts',
    }),
  ],
})
