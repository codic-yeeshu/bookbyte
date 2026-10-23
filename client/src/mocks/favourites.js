// TODO(#17): favourites are a plain list of ids, so "saved when", the want-to-read
// list and on-sale / back-in-stock flags are derived here until the API returns them.

const SAVED = ['2 days ago', 'last week', '12 Sep', '30 Aug', '3 Aug', '21 Jul'];

export const withFavouriteExtras = (book, index) => ({
  ...book,
  savedLabel: SAVED[index % SAVED.length],
  list: index % 3 === 1 ? 'want-to-read' : 'saved',
  onSale: index % 4 === 0,
  backInStock: index === 1 || index === 4,
});
