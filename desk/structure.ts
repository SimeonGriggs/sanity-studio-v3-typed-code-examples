import {StructureResolver} from 'sanity/desk'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Showcases a custom string generator
      S.documentTypeListItem('store').title('Store (String Generator)'),
      // Showcases a custom string selector
      S.documentTypeListItem('feature').title('Feature (String Selector)'),
      // Showcases a custom number
      S.documentTypeListItem('survey').title('Survey (Number)'),
      // Showcases a custom object
      S.documentTypeListItem('promotion').title('Promotion (Object)'),
      S.divider(),
      // Showcases a decorated array
      S.documentTypeListItem('seminar').title('Seminar (Decorated Array)'),
      S.documentTypeListItem('person').title('Person'),
      S.divider(),
      // Showcases an array with extra interactive items
      S.documentTypeListItem('readingList').title('Reading List (Interactive Array Items)'),
      S.documentTypeListItem('book').title('Book'),
      S.divider(),
      // Showcases an array with rich item previews
      S.documentTypeListItem('campaign').title('Campaign (Rich Array Item Previews)'),
      S.documentTypeListItem('offer').title('Offer'),
      S.divider(),
      // A root-level component
      S.documentTypeListItem('preflight').title('Preflight (Root level)'),
      S.divider(),
      // More complex examples
      // Showcases a custom object
      S.documentTypeListItem('location').title('Locations'),
      // Showcases a custom table input
      S.documentTypeListItem('report').title('Reports'),
    ])
