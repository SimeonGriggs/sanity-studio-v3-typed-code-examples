import {defineField, defineType} from 'sanity'

export const storeType = defineType({
  name: 'store',
  title: 'Store',
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
