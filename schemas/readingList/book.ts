import {defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons'

export default defineType({
  name: 'book',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'author',
      description: 'This should be a reference, but is a string in this demo for brevity',
      type: 'string',
    }),
    defineField({
      name: 'year',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      year: 'year',
    },
    prepare: ({title, author, year}) => ({
      title,
      subtitle: `${author} (${year})`,
    }),
  },
})
