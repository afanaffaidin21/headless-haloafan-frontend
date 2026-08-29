"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
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
  const openerRef = useRef<HTMLElement | null>(null);

  const openCv = useCallback(() => {
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      openerRef.current = document.activeElement;
    }
    setIsOpen(true);
  }, []);

  const closeCv = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      openerRef.current?.focus();
      openerRef.current = null;
    });
  }, []);

  return (
    <CvContext.Provider value={{ isOpen, openCv, closeCv }}>
      {children}
    </CvContext.Provider>
  );
}

export function useCv() {
  return useContext(CvContext);
}
