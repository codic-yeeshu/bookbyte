import React, { createContext, useContext, useEffect, useState } from 'react';

// Lets a page adjust the mobile chrome: the header's "back" mode (2c) and hiding the tab bar
// when the page brings its own bottom bar.
const MobileChromeContext = createContext({ chrome: {}, setChrome: () => {} });

export const MobileChromeProvider = ({ children }) => {
  const [chrome, setChrome] = useState({});
  return <MobileChromeContext.Provider value={{ chrome, setChrome }}>{children}</MobileChromeContext.Provider>;
};

export const useMobileChromeState = () => useContext(MobileChromeContext).chrome;

/** e.g. useMobileChrome({ back: true, title: 'Classics', hideTabbar: true }) */
export const useMobileChrome = ({ back = false, title = '', hideTabbar = false }) => {
  const { setChrome } = useContext(MobileChromeContext);
  useEffect(() => {
    setChrome({ back, title, hideTabbar });
    return () => setChrome({});
  }, [setChrome, back, title, hideTabbar]);
};
