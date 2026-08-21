"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface CvContextValue {
  isOpen: boolean;
  openCv: () => void;
  closeCv: () => void;
}

const CvContext = createContext<CvContextValue>({
  isOpen: false,
  openCv: () => {},
  closeCv: () => {},
});

export function CvProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCv = useCallback(() => setIsOpen(true), []);
  const closeCv = useCallback(() => setIsOpen(false), []);

  return (
    <CvContext.Provider value={{ isOpen, openCv, closeCv }}>
      {children}
    </CvContext.Provider>
  );
}

export function useCv() {
  return useContext(CvContext);
}