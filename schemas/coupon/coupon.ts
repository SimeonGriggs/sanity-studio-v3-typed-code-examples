import {defineType} from 'sanity'
import CouponGeneratorDummy from './CouponGeneratorDummy'
import CouponGenerator from './CouponGenerator'

export default defineType({
  name: 'coupon',
  description: 'A unique, all uppercase, four-character alphanumeric code',
  type: 'string',
  validation: (rule) =>
    rule
      .min(4)
      .max(4)
      .regex(/^[A-Z0-9]+$/),
  //   components: {input: CouponGeneratorDummy},
  components: {input: CouponGenerator},
})
