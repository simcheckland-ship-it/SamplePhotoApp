import React, { createContext, useContext, useState, useEffect } from "react";
import { setupAxiosInterceptors } from "../api/client";

export const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [activeItem, setActiveItem] = useState(null);
  const [imgBaseUrl, setImgBaseUrl] = useState(null);
  const [apiBaseUrl, setApiBaseUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      const controller = new AbortController();
      // 1.5-second timeout so your app loads quickly even if local fails
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      try {
        // Try hitting a small asset or health endpoint on your local server
        await fetch(`/local-network/uploads/hello`, {
          method: "GET",
          signal: controller.signal,
        });

        console.log(
          "Local image server detected. Setting global path to Local.",
        );

        // 1. Set image base state
        setImgBaseUrl(`/local-network/uploads`);

        // 2. Set the state AND instantly bind it to Axios
        const localApi = `/local-network/api`;
        setApiBaseUrl(localApi);
        setupAxiosInterceptors(localApi);
      } catch (error) {
        console.warn(
          "Local image server unreachable. Setting global path to Public WAN.",
        );
        setImgBaseUrl(`${import.meta.env.VITE_BASE_URL_PUBLIC}/uploads`);

        // 3. Set the fallback string AND bind it to Axios
        const publicApi = `${import.meta.env.VITE_BASE_URL_PUBLIC}/api`;
        setApiBaseUrl(publicApi);
        setupAxiosInterceptors(publicApi);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <AppStateContext.Provider
      value={{ activeItem, setActiveItem, imgBaseUrl, apiBaseUrl, loading }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
