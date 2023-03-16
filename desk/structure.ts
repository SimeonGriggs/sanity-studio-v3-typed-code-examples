import {StructureResolver} from 'sanity/desk'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('location').title('Locations'),
      S.divider(),
      S.documentTypeListItem('report').title('Reports'),
    ])
