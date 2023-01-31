import {defineField, defineType} from 'sanity'
// import ObjectField from '../components/ObjectField'
// import ObjectInput from '../components/ObjectInput'
// import ObjectItem from '../components/ObjectItem'
// import ObjectPreview from '../components/ObjectPreview'

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
  // Components loaded here in an `object` type schema are strictly type checked
  // If loaded from an alias – like {type: 'coordinate'} – they are typed `any`
  // ...unless we perform additional work with IntrinsicDefinitions
  // components: {
  //   field: ObjectField,
  //   input: ObjectInput,
  //   item: ObjectItem,
  //   preview: ObjectPreview,
  // },
})
