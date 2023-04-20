import {couponType} from './coupon/couponType'
import {storeType} from './coupon/storeType'
import {featureType} from './plan/featureType'
import {planType} from './plan/planType'
import {promotionType} from './duration/promotionType'
import {durationType} from './duration/durationType'
import {timeValueType} from './duration/timeValueType'
import {surveyType} from './rating/surveyType'
import {tableSchema} from './table'
import {preflightType} from './progress/preflightType'
import {ratingType} from './rating/ratingType'
import {seminarType} from './hosts/seminarType'
import {hostsType} from './hosts/hostsType'
import {personType} from './hosts/personType'
import {readingListType} from './readingList/readingListType'
import {recommendationType} from './readingList/recommendationType'
import {bookType} from './readingList/bookType'
import {campaignType} from './offer/campaignType'
import {offerType} from './offer/offerType'
import report from './report'
import coordinate from './coordinate'
import location from './location'

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
  seminarType,
  hostsType,
  personType,
  // Interactive array item example
  readingListType,
  recommendationType,
  bookType,
  // Rich array item preview example
  campaignType,
  offerType,
  // Complex examples:
  // Custom object example
  location,
  coordinate,
  // Custom array of objects example
  report,
  tableSchema,
  // Root level
  preflightType,
]
