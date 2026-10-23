// "Keep me signed in" → localStorage; otherwise the token only lives for this tab (sessionStorage).
// TODO(#24): move to refresh-token cookies.
export const getStoredToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
