/**
 * THIS FILE WAS COPIED FROM CORE
 * I wish these functions were **exported** from core!
 */

import {isArraySchemaType, isObjectSchemaType, isPrimitiveSchemaType} from '@sanity/types'
import {
  ArrayOfPrimitivesFormNode,
  FieldMember,
  ObjectFormNode,
  ArrayOfObjectsFormNode,
} from 'sanity'

export function isMemberObject(member: FieldMember): member is FieldMember<ObjectFormNode> {
  return isObjectSchemaType(member.field.schemaType)
}

export function isMemberArrayOfPrimitives(
  member: FieldMember
): member is FieldMember<ArrayOfPrimitivesFormNode> {
  return (
    isArraySchemaType(member.field.schemaType) &&
    member.field.schemaType.of.every((ofType) => isPrimitiveSchemaType(ofType))
  )
}

export function isMemberArrayOfObjects(
  member: FieldMember
): member is FieldMember<ArrayOfObjectsFormNode> {
  return (
    isArraySchemaType(member.field.schemaType) &&
    member.field.schemaType.of.every((ofType) => isObjectSchemaType(ofType))
  )
}
