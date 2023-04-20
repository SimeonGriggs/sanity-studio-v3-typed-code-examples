import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'survey',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'wouldRecommend',
      description: 'How likely are you to recommend this product to a friend?',
      type: 'rating',
    }),
    defineField({
      name: 'wouldBuyAgain',
      description: 'How likely are you to buy this product again?',
      type: 'rating',
    }),
  ],
})
