import {defineType} from 'sanity'

// A function that generates an array of times from 00:00 to 23:30
export const ALLOWED_TIMES = () => {
  const times = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
    }
  }
  return times
}

export default defineType({
  name: 'timeIncrement',
  type: 'string',
  options: {
    list: ALLOWED_TIMES(),
  },
})
