import {defineField, defineType, ObjectDefinition} from 'sanity'
import ObjectField from '../components/ObjectField'
import ObjectInput from '../components/ObjectInput'
import ObjectItem from '../components/ObjectItem'
import ObjectPreview from '../components/ObjectPreview'

/**
 * Components for "Alias" types are not type checked as strictly as those loaded
 * directly on built-in schema types like `object` and `array`
 * 
 * In this example we have registered an `object` field type as an alias called `coordinate`
 * 
 * For strict type checking in these aliases we need to add this IntrinsicDefinitions
 * using the same name as the type alias
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
      name: 'coordinates',
      type: 'coordinate',
      description: 'Default input',
    }),
    defineField(
      {
        name: 'coordinatesField',
        type: 'coordinate',
        description: 'Custom "field" component',
        components: {
          field: ObjectField,
        },
      },
    ),
    defineField({
      name: 'coordinatesInput',
      type: 'coordinate',
      description: 'Custom "input" component',
      components: {
        input: ObjectInput,
      },
    }),
    defineField({
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
  ],
})
