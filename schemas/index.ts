import coordinate from './coordinate'
import coupon from './coupon/coupon'
import store from './coupon/store'
import location from './location'
import duration from './duration/promotion'
import promotion from './duration/duration'
import timeIncrement from './duration/timeIncrement'
import rating from './rating/rating'
import survey from './rating/survey'
import report from './report'
import {tableSchema} from './table'
import seminar from './hosts/seminar'
import hosts from './hosts/hosts'
import person from './hosts/person'

export const schemaTypes = [
  // Custom string example
  store,
  coupon,
  // Custom number example
  survey,
  rating,
  // Custom object example
  promotion,
  duration,
  timeIncrement,
  // Decorated array example
  seminar,
  hosts,
  person,
  // Complex examples:
  // Custom object example
  location,
  coordinate,
  // Custom array of objects example
  report,
  tableSchema,
]
