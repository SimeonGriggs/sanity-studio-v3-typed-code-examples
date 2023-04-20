import {defineField, defineType} from 'sanity'

export const campaignType = defineType({
  name: 'campaign',
  title: 'Campaign',
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
