import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'promotion',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      type: 'duration',
    }),
  ],
})
