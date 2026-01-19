import GlobalLoading from "@/components/loading/Loading";
import { createContext, type ReactNode, useContext, useState } from "react";

const LoadingContext = createContext({
  showLoading: () => {},
  hideLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {isLoading && <GlobalLoading />}
    </LoadingContext.Provider>
  );
}
