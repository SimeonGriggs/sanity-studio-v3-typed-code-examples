import coordinate from './coordinate'
import {couponType} from './coupon/couponType'
import {storeType} from './coupon/storeType'
import {featureType} from './plan/featureType'
import {planType} from './plan/planType'
import location from './location'
import {promotionType} from './duration/promotionType'
import {durationType} from './duration/durationType'
import {timeValueType} from './duration/timeValueType'
import {surveyType} from './rating/surveyType'
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
import preflight from './progress/preflight'
import {ratingType} from './rating/ratingType'

export const schemaTypes = [
  // Custom string generator example
  storeType,
  couponType,
  // Custom string selector example
  featureType,
  planType,
  // Custom number example
  surveyType,
  ratingType,
  // Custom object example
  promotionType,
  durationType,
  timeValueType,
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
  // Root level
  preflight,
]
