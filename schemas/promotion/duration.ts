import {defineField, defineType} from 'sanity'
import DurationInput from './DurationInput'

export default defineType({
  name: 'duration',
  description: 'A start and finish time for a promotion',
  type: 'object',
  fields: [
    defineField({
      name: 'start',
      type: 'timeIncrement',
    }),
    defineField({
      name: 'end',
      type: 'timeIncrement',
    }),
  ],
  options: {columns: 2},
  components: {input: DurationInput},
})
