import {defineField, defineType} from 'sanity'
import {ShoppingListInput} from './ShoppingListInput'

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
    input: ShoppingListInput,
  },
})
