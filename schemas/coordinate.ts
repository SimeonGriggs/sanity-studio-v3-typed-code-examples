import {defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons'
// import ObjectField from '../components/ObjectField'
// import ObjectInput from '../components/ObjectInput'
// import ObjectItem from '../components/ObjectItem'
// import ObjectPreview from '../components/ObjectPreview'
// import ObjectPreviewRetyped from '../components/ObjectPreviewRetyped'

export default defineType({
  name: 'coordinate',
  title: 'Coordinate',
  type: 'object',
  icon: PinIcon,
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
  // and not customized where used as a schema type alias
  preview: {
    select: {
      x: 'x',
      y: 'y',
    },
    prepare({x, y}) {
      return {
        // The built-in preview will be looking for `title`, `subtitle` and `media`
        title: x && y ? `x: ${x}, y: ${y}` : 'Both coordinates not yet set',
        subtitle: 'A Coordinate',
        media: PinIcon,
        // ...but you can pass-in any arbitrary data as well 
        // and access it in your custom preview component
        // but TypeScript won't be expecting them in PreviewProps
        // see `ObjectPreviewRetyped.tsx` for a workaround
        x,
        y,
      }
    }
  },
  // 1. Components loaded here in an `object` type schema are strictly type checked
  // If loaded from an schema type alias – like {type: 'coordinate'} – they are typed `any`
  // ...unless we perform additional work with IntrinsicDefinitions
  // see `./schema/location.ts` for an example

  // 2. If a component is loaded from an alias schema type, 
  // it will override the component here
  // components: {
    // field: ObjectField,
    // input: ObjectInput,
    // item: ObjectItem,
    // preview: ObjectPreview,
    // preview: ObjectPreviewRetyped,
  // },
})
