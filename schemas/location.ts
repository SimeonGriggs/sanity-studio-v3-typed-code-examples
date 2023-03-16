import {defineField, defineType, ObjectDefinition} from 'sanity'
// import ArrayOfObjectsField from '../components/ArrayOfObjectsField'
import ArrayOfObjectsInput from '../components/ArrayOfObjectsInput'
import ObjectField from '../components/ObjectField'
import ObjectInput from '../components/ObjectInput'
import ObjectItem from '../components/ObjectItem'
import ObjectPreview from '../components/ObjectPreview'

/**
 * Components for "Alias" schema types are not type checked as strictly as those loaded
 * directly on built-in schema types like `object` and `array`
 *
 * In this example we have registered an `object` field type
 * as an alias schema type called `coordinate`
 *
 * For strict TypeScript checking in these schema type aliases we need to add this
 * IntrinsicDefinitions below using the same name as the schema type alias
 *
 * BEWARE: It's possible that re-declaring this module could cause issues
 */
declare module 'sanity' {
  export interface IntrinsicDefinitions {
    coordinate: Omit<ObjectDefinition, 'type' | 'fields' | 'options'> & {
      type: 'coordinate'
    }
  }
}

export default defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      description: 'This document type tests different object inputs',
      type: 'string',
    }),
    defineField({
      hidden: true,
      name: 'coordinates',
      type: 'coordinate',
      description: 'Default input',
    }),
    defineField({
      hidden: true,
      name: 'coordinatesField',
      type: 'coordinate',
      description: 'Custom "field" component',
      components: {
        field: ObjectField,
      },
    }),
    defineField({
      hidden: true,
      name: 'coordinatesInput',
      type: 'coordinate',
      description: 'Custom "input" component',
      components: {
        input: ObjectInput,
      },
    }),
    defineField({
      hidden: true,
      name: 'coordinatesItemArray',
      description: 'Array of custom "item" components',
      type: 'array',
      of: [
        defineField({
          name: 'coordinatesItem',
          type: 'coordinate',
          description: 'Custom "item" component',
          components: {
            item: ObjectItem,
          },
        }),
      ],
    }),
    defineField({
      hidden: true,
      name: 'coordinatesPreviewArray',
      description: 'Array of custom "preview" components',
      type: 'array',
      of: [
        defineField({
          name: 'coordinatesPreview',
          type: 'coordinate',
          description: 'Custom "preview" component',
          components: {
            preview: ObjectPreview,
          },
        }),
      ],
    }),
    defineField({
      // hidden: true,
      name: 'array',
      type: 'array',
      of: [
        {name: 'image', type: 'image'},
        {name: 'geopoint', type: 'geopoint'},
      ],
      components: {
        // field: ArrayOfObjectsField,
        input: ArrayOfObjectsInput,
      },
    }),
  ],
})
