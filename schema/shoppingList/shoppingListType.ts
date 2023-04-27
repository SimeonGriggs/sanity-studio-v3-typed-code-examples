import {defineField, defineType} from 'sanity'
import {ShoppingListField} from './ShoppingListField'

export const shoppingListType = defineType({
  name: 'shoppingList',
  type: 'array',
  of: [
    defineField({
      name: 'shoppingListItem',
      type: 'shoppingListItem',
    }),
  ],
  components: {
    field: ShoppingListField,
  },
})
