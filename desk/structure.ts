import {StructureResolver} from 'sanity/desk'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Showcases a custom string
      S.documentTypeListItem('store').title('Store (String)'),
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
      // More complex examples
      S.divider(),
      // Showcases a custom object
      S.documentTypeListItem('location').title('Locations'),
      // Showcases a custom table input
      S.documentTypeListItem('report').title('Reports'),
    ])
