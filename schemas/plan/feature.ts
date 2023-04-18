import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'feature',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'plan',
      type: 'plan',
      description: 'Minimum plan required to access this feature',
    }),
  ],
})
