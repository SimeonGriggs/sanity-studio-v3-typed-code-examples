import coordinate from './coordinate'
import coupon from './coupon/coupon'
import store from './coupon/store'
import location from './location'
import rating from './rating/rating'
import survey from './rating/survey'
import report from './report'
import {tableSchema} from './table'

export const schemaTypes = [
  // Custom string example
  store,
  coupon,
  // Custom number example
  survey,
  rating,
  // Custom object example
  location,
  coordinate,
  // Custom array of objects example
  report,
  tableSchema,
]
