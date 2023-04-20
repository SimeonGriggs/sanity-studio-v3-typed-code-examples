import {defineField, defineType} from 'sanity'
import {DurationInput} from './DurationInput'

export const durationType = defineType({
  name: 'duration',
  title: 'Duration',
  description: 'A start and finish time for a promotion',
  type: 'object',
  fields: [
    defineField({
      name: 'start',
      type: 'timeValue',
    }),
    defineField({
      name: 'end',
      type: 'timeValue',
    }),
  ],
  options: {columns: 2},
  components: {input: DurationInput},
})
