// TODO(#18): replace with api.post('/cart/promo', { code }) — the server should own discounts.
const PROMOS = {
  AUTUMN10: { type: 'percent', value: 10 },
};

export const applyPromo = async (code, subtotal) => {
  const normalised = code.trim().toUpperCase();
  const promo = PROMOS[normalised];
  if (!promo) throw new Error("That code isn't valid.");
  const discount = promo.type === 'percent' ? Math.round((subtotal * promo.value) / 100) : promo.value;
  return { code: normalised, discount };
};
