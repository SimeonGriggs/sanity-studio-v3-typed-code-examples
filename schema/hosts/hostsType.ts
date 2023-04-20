import {defineField, defineType} from 'sanity'
import {HostsInput} from './HostsInput'

export const hostsType = defineType({
  name: 'hosts',
  type: 'array',
  of: [
    defineField({
      name: 'host',
      type: 'reference',
      to: [{type: 'person'}],
    }),
  ],
  components: {input: HostsInput},
})
