import {StructureResolver} from 'sanity/desk'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Showcases a custom string
      S.documentTypeListItem('store').title('Store'),
      // Showcases a custom object
      S.documentTypeListItem('location').title('Locations'),
      // Showcases a custom table input
      S.documentTypeListItem('report').title('Reports'),
    ])
