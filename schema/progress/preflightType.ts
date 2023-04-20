import {defineType, defineField} from 'sanity'

export const preflightType = defineType({
  name: 'preflight',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({name: 'copyApproved', type: 'boolean'}),
    defineField({name: 'lighthouse', type: 'boolean'}),
    defineField({name: 'accessibility', type: 'boolean'}),
    defineField({name: 'seo', title: 'SEO', type: 'boolean'}),
    defineField({name: 'bestPractices', type: 'boolean'}),
  ],
})
