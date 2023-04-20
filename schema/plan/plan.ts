import {defineType} from 'sanity'
import PlanSelector from './PlanSelector'

export default defineType({
  name: 'plan',
  type: 'string',
  options: {
    list: [
      {title: 'Free', value: 'free'},
      {title: 'Premium', value: 'premium'},
      {title: 'Enterprise', value: 'enterprise'},
    ],
    layout: 'radio',
  },
  components: {input: PlanSelector},
})
