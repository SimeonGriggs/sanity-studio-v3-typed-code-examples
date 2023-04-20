import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'campaign',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'offers',
      type: 'array',
      of: [
        defineField({
          name: 'offer',
          type: 'offer',
        }),
      ],
    }),
  ],
})
