import {defineField, defineType} from 'sanity'

export const seminarType = defineType({
  name: 'seminar',
  title: 'Seminar',
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
