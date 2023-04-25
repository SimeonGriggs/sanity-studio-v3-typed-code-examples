import {defineField, defineType} from 'sanity'
import {ListItemItem} from './ListItemItem'
import ListItemPreview from './ListItemPreview'

export const shoppingListItemType = defineType({
  name: 'shoppingListItem',
  type: 'object',
  fields: [
    defineField({
      name: 'description',
      type: 'string',
    }),
    defineField({
      name: 'procured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'description',
      subtitle: 'procured',
      _key: '_key',
    },
    // prepare({title, subtitle}) {
    //   return {
    //     title,
    //     subtitle: subtitle ? 'Procured' : 'Not procured',
    //   }
    // },
  },
  components: {
    item: ListItemItem,
    preview: ListItemPreview,
  },
})
