import {defineField, defineType} from 'sanity'

export const listType = defineType({
  name: 'list',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'shoppingList',
      type: 'shoppingList',
    }),
  ],
})
