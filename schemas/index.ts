import coordinate from './coordinate'
import coupon from './coupon/coupon'
import store from './coupon/store'
import location from './location'
import report from './report'
import {tableSchema} from './table'

export const schemaTypes = [store, coupon, location, coordinate, report, tableSchema]
