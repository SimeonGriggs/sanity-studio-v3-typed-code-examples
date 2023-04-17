import {StructureResolver} from 'sanity/desk'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Showcases a custom string
      S.documentTypeListItem('store').title('Store'),
      // Showcases a custom number
      S.documentTypeListItem('survey').title('Survey'),
      // Showcases a custom object
      S.documentTypeListItem('promotion').title('Promotion'),
      // Showcases a custom object
      S.documentTypeListItem('location').title('Locations'),
      // Showcases a custom table input
      S.documentTypeListItem('report').title('Reports'),
    ])
