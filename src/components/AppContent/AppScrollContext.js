import React, { useState, createContext } from "react";

const ScrollContext = createContext();

const ScrollContextProvider = (props) => {
  const [scrollInfo, setScrollInfo] = useState({});

  const initial = {
    scrollInfo: scrollInfo,
    setScrollInfo: (val) => {
      setScrollInfo(val);
    },
  };

  return (
    <ScrollContext.Provider value={initial}>
      {props.children}
    </ScrollContext.Provider>
  );
};

export { ScrollContext, ScrollContextProvider };
export default ScrollContext;
