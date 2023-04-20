import {defineType} from 'sanity'
import {PlanInput} from './PlanInput'

export const planType = defineType({
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
  components: {input: PlanInput},
})
