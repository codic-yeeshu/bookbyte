// Dummy data for getLandingCuration() — shape matches the endpoint proposed in #12.
// These books aren't in the database (no _id), so they render with typographic covers.
export const LANDING_CURATION = {
  list: { title: 'Autumn list', number: 14 },
  editorsPick: {
    featured: { title: 'Middlemarch', author: 'George Eliot', price: 349 },
    flanking: [
      { title: 'Frankenstein', author: 'Mary Shelley', price: 249 },
      { title: 'Persuasion', author: 'Jane Austen', price: 279 },
    ],
  },
  staffPick: {
    book: { title: 'Wuthering Heights', author: 'Emily Brontë', price: 299 },
    staff: { name: 'Ananya', desk: 'Fiction desk' },
    quote: 'Wild, cruel and impossible to put down. I read it every winter and it finds a new way to unsettle me each time.',
    shortQuote: 'Wild, cruel and impossible to put down. I read it every winter.',
  },
};
