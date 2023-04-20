import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {OfferPreview} from './OfferPreview'

export const offerType = defineType({
  name: 'offer',
  title: 'Offer',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: 'discount',
      description: 'Discount percentage',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: 'validUntil',
      type: 'date',
    }),
  ],
  components: {preview: OfferPreview},
  preview: {
    select: {
      title: 'title',
      discount: 'discount',
      validUntil: 'validUntil',
    },
    // prepare({title, discount, validUntil}) {
    //   return {
    //     title: title,
    //     subtitle: !discount
    //       ? 'No discount'
    //       : validUntil
    //       ? `${discount}% discount until ${validUntil}`
    //       : `${discount}% discount`,
    //   }
    // },
  },
})
