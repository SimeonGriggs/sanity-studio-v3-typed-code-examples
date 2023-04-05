import {FormNodeValidation} from 'sanity'
import {CardTone} from '@sanity/ui'

export function getErrorLevel(validation: FormNodeValidation[] = []): CardTone | null {
  if (!validation.length) {
    return null
  } else if (validation.find((v) => v.level === 'error')) {
    return 'critical'
  } else if (validation.find((v) => v.level === 'warning')) {
    return 'caution'
  } else if (validation.find((v) => v.level === 'info')) {
    return 'default'
  }

  return null
}
