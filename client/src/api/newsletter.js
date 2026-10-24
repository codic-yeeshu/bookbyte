// TODO(#9): replace with api.post('/newsletter/subscribe', { email }) once the endpoint exists.
export const subscribeToNewsletter = async (email) => {
  return { message: `Subscribed ${email} to the Bookbyte Letter.` };
};
