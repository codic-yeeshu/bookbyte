// Dummy data for getNewAndNotable(). Featured book: #12. Bestsellers and coming soon: #21.
export const NEW_AND_NOTABLE = {
  featured: {
    book: { title: 'Anna Karenina', author: 'Leo Tolstoy', price: 449 },
    label: 'Out this week',
    subtitle: 'a new translation',
    blurb: "A quick-footed translation that makes Tolstoy's famous opening feel new. Clothbound.",
  },
  bestsellers: [
    { title: 'Anna Karenina', author: 'Leo Tolstoy', rank: 1, previousRank: null },
    { title: 'Middlemarch', author: 'George Eliot', rank: 2, previousRank: 4 },
    { title: 'Jane Eyre', author: 'Charlotte Brontë', rank: 3, previousRank: 3 },
    { title: 'Dracula', author: 'Bram Stoker', rank: 4, previousRank: 8 },
    { title: 'Little Women', author: 'Louisa May Alcott', rank: 5, previousRank: 4 },
    { title: 'Persuasion', author: 'Jane Austen', rank: 6, previousRank: 4 },
  ],
  comingSoon: [
    { releaseDate: '2026-10-30', title: 'Persuasion', author: 'Jane Austen', format: 'Clothbound', price: 399 },
    { releaseDate: '2026-11-06', title: 'The Moonstone', author: 'Wilkie Collins', format: 'Paperback', price: 279 },
    { releaseDate: '2026-11-13', title: 'North and South', author: 'Elizabeth Gaskell', format: 'Hardcover', price: 429 },
    { releaseDate: '2026-11-27', title: 'Bleak House', author: 'Charles Dickens', format: 'Paperback', price: 349 },
  ],
};
