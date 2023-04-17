import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'store',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'coupon',
      type: 'coupon',
    }),
  ],
})
