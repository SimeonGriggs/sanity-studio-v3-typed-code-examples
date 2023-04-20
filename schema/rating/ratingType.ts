import {defineType} from 'sanity'

import {RatingInput} from './RatingInput'

export const ratingType = defineType({
  name: 'rating',
  type: 'number',
  validation: (rule) => rule.min(1).max(10),
  components: {input: RatingInput},
})
