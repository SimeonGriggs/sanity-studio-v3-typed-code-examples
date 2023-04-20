import {defineType} from 'sanity'

import RatingSelector from './RatingSelector'

export default defineType({
  name: 'rating',
  type: 'number',
  validation: (rule) => rule.min(1).max(10),
  components: {input: RatingSelector},
})
