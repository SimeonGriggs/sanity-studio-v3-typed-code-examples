import {defineField, defineType} from 'sanity'
import ObjectField from '../components/ObjectField'
import ObjectInput from '../components/ObjectInput'
import ObjectItem from '../components/ObjectItem'
import ObjectPreview from '../components/ObjectPreview'

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
    defineField({
      name: 'coordinatesField',
      type: 'coordinate',
      description: 'Custom "field" component',
      components: {
        field: ObjectField,
      },
    }),
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
