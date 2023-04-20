import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const DEPARTMENTS = [
  {title: 'Engineering', value: 'engineering'},
  {title: 'Sales', value: 'sales'},
  {title: 'Marketing', value: 'marketing'},
]

export default defineType({
  name: 'person',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'department',
      type: 'string',
      options: {list: DEPARTMENTS},
    }),
  ],
  preview: {
    select: {
      name: 'name',
      department: 'department',
    },
    prepare(selection) {
      const {name, department} = selection
      return {
        title: name,
        subtitle: DEPARTMENTS.find((item) => item.value === department)?.title,
      }
    },
  },
})
