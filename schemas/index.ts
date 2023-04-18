import coordinate from './coordinate'
import coupon from './coupon/coupon'
import feature from './plan/feature'
import plan from './plan/plan'
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
import readingList from './readingList/readingList'
import recommendation from './readingList/recommendation'
import book from './readingList/book'
import campaign from './offer/campaign'
import offer from './offer/offer'

export const schemaTypes = [
  // Custom string generator example
  store,
  coupon,
  // Custom string selector example
  feature,
  plan,
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
  // Interactive array item example
  readingList,
  recommendation,
  book,
  // Rich array item preview example
  campaign,
  offer,
  // Complex examples:
  // Custom object example
  location,
  coordinate,
  // Custom array of objects example
  report,
  tableSchema,
]
