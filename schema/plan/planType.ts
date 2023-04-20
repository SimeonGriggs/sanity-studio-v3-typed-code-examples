import {defineType} from 'sanity'
import {UserIcon, UsersIcon, EarthGlobeIcon} from '@sanity/icons'
import {PlanInput} from './PlanInput'

export const PLANS = [
  {title: 'Free', value: 'free', description: 'For personal use', icon: UserIcon},
  {title: 'Premium', value: 'premium', description: 'For small teams', icon: UsersIcon},
  {title: 'Enterprise', value: 'enterprise', description: 'For large teams', icon: EarthGlobeIcon},
]

export const planType = defineType({
  name: 'plan',
  title: 'Plan',
  type: 'string',
  options: {
    list: PLANS.map(({title, value}) => ({title, value})),
    layout: 'radio',
  },
  components: {input: PlanInput},
})
