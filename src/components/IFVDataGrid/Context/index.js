import React from "react";

const GlobalGridContext = React.createContext();

const GridContext = ({ children }) => {
  const gridState = React.useState({});

  return (
    <React.Fragment>
      <GlobalGridContext.Provider value={gridState}>
        {/**/}
        {children}
        {/**/}
      </GlobalGridContext.Provider>
    </React.Fragment>
  );
};

export default GridContext;
