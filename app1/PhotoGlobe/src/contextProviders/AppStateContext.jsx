import React, { createContext, useContext, useState, useEffect } from "react";

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    //console.log("Effect checked. sampleData status:", !!sampleData);
    // if (!activeItem) {
    //     console.log("Effect checked. activeItem status: NULL");
    // }
    // else {
    //     console.log("Effect checked. activeItem status:", activeItem.FileName);
    // }
    // if (!activeItem) {
    //   const def = getDefaultItem();
    //   if (def) {
    //     setActiveItem(def);
    //   }
    // }
  }, [activeItem]);

  return (
    <AppStateContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("contect not found.");
  }
  return context;
}
