import {defineField, defineType} from 'sanity'

export const surveyType = defineType({
  name: 'survey',
  title: 'Survey',
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
      validation: (rule) => rule.min(1).max(10),
    }),
    defineField({
      name: 'wouldBuyAgain',
      description: 'How likely are you to buy this product again?',
      type: 'rating',
      validation: (rule) => rule.min(1).max(5),
    }),
  ],
})
