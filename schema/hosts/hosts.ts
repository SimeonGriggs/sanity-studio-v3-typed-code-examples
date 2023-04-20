import {defineField, defineType} from 'sanity'
import HostsSelector from './HostsSelector'

export default defineType({
  name: 'hosts',
  type: 'array',
  of: [
    defineField({
      name: 'host',
      type: 'reference',
      to: [{type: 'person'}],
    }),
  ],
  components: {input: HostsSelector},
})
