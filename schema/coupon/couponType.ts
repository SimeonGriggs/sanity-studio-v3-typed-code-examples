import {defineType} from 'sanity'
// import {CouponInput} from './CouponInputDummy'
import {CouponInput} from './CouponInput'

export const couponType = defineType({
  name: 'coupon',
  title: 'Coupon',
  description: 'A unique, all uppercase, four-character alphanumeric code',
  type: 'string',
  validation: (rule) =>
    rule
      .min(4)
      .max(4)
      .regex(/^[A-Z0-9]+$/),
  components: {input: CouponInput},
})
