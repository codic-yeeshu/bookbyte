// Dummy data for getCollections() — shape follows #22. Tones are --bb-cover-* indexes (1–6).
const HEIGHTS = [118, 138, 104, 128, 112];

const collection = ([slug, title, description, count, curator, tones], i) => ({
  slug,
  title,
  description,
  count,
  curator,
  spines: tones.map((tone, j) => ({ tone, height: HEIGHTS[(j + i) % HEIGHTS.length] })),
});

export const COLLECTIONS = {
  featured: {
    slug: 'the-gothic-winter',
    title: 'The Gothic',
    titleEmphasis: 'Winter',
    blurb: 'Twenty-four books for long nights — crumbling houses, unreliable narrators and candles that go out at exactly the wrong moment.',
    count: 24,
    curator: 'Ananya',
    covers: [
      { title: 'Dracula', author: 'Bram Stoker', tone: 5 },
      { title: 'Jane Eyre', author: 'Charlotte Brontë', tone: 2 },
      { title: 'Dorian Gray', author: 'Oscar Wilde', tone: 4 },
      { title: 'Frankenstein', author: 'Mary Shelley', tone: 6 },
    ],
  },
  data: [
    ['a-winter-of-russians', 'A Winter of Russians', 'Big novels for cold evenings', 18, 'Kabir', [1, 2, 4, 6, 5]],
    ['first-loves', 'First Loves', 'Romances that hold up on a re-read', 22, 'Meera', [3, 6, 1, 4, 2]],
    ['books-under-200-pages', 'Books Under 200 Pages', 'Finish one on a Sunday', 30, 'Ananya', [4, 5, 3, 2, 6]],
    ['sea-stories', 'Sea Stories', 'Whales, wrecks and long voyages', 14, 'Arjun', [2, 1, 5, 3, 4]],
    ['the-detective-shelf', 'The Detective Shelf', 'Where the mystery novel began', 20, 'Kabir', [5, 3, 2, 6, 1]],
    ['read-it-in-school', 'Read It in School?', 'Classics worth a second try', 26, 'Meera', [6, 4, 1, 5, 3]],
  ].map(collection),
};
