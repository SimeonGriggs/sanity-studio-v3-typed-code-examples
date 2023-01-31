import {defineField, defineType} from 'sanity'
// import ObjectField from '../components/ObjectField'
// import ObjectInput from '../components/ObjectInput'
// import ObjectItem from '../components/ObjectItem'
import ObjectPreview from '../components/ObjectPreview'

export default defineType({
  name: 'coordinate',
  title: 'Coordinate',
  type: 'object',
  fieldsets: [
    {
      name: 'coordinates',
      options: {
        columns: 2,
        collapsible: false,
      },
    },
  ],
  fields: [
    defineField({
      name: 'x',
      type: 'number',
      fieldset: 'coordinates',
    }),
    defineField({
      name: 'y',
      type: 'number',
      fieldset: 'coordinates',
    }),
  ],
  // To pass values from the field into components.preview
  // We must setup the `preview` key on the schema
  // This can only be done here on the `object`,
  // and not customised where used as a schema type alias
  preview: {
    select: {
      x: 'x',
      y: 'y',
    },
    prepare({x, y}) {
      return {
        // The built-in preview will be looking for `title`, `subtitle` and `media`
        title: x && y ? `x: ${x}, y: ${y}` : 'Boot coordinates not yet set',
        subtitle: 'The Coordinate',
        // But you can pass-in any arbitrary data as well 
        // and access it in your custom preview component
        x,
        y,
      }
    }
  },
  // Components loaded here in an `object` type schema are strictly type checked
  // If loaded from an schema type alias – like {type: 'coordinate'} – they are typed `any`
  // ...unless we perform additional work with IntrinsicDefinitions
  // components: {
    // field: ObjectField,
    // input: ObjectInput,
    // item: ObjectItem,
    // preview: ObjectPreview,
  // },
})
