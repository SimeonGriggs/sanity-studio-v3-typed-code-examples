import {defineField, defineType} from 'sanity'
import {ArrayFunctionsItem} from './ArrayFunctionsItem'

export const arrayFunctionsType = defineType({
  name: 'arrayFunctions',
  title: 'Array Functions',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({
      name: 'primitives',
      type: 'array',
      of: [{type: 'string'}],
      components: {
        input: ArrayFunctionsItem,
      },
    }),
    defineField({
      name: 'objects',
      type: 'array',
      of: [
        defineField({
          name: 'person',
          type: 'object',
          fields: [defineField({name: 'name', type: 'string'})],
          preview: {
            select: {
              title: 'name',
            },
            prepare({title}) {
              return {title, subtitle: 'Person'}
            },
          },
        }),
        defineField({
          name: 'animal',
          type: 'object',
          fields: [defineField({name: 'name', type: 'string'})],
          preview: {
            select: {
              title: 'name',
            },
            prepare({title}) {
              return {title, subtitle: 'Animal'}
            },
          },
        }),
      ],
      components: {
        input: ArrayFunctionsItem,
      },
    }),
  ],
})
