import {defineField, defineType} from 'sanity'

export const promotionType = defineType({
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
