"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type AudiencePath = "neutral" | "freelance" | "fulltime";

interface AudienceContextValue {
  path: AudiencePath;
  setPath: (path: AudiencePath) => void;
}

const AudienceContext = createContext<AudienceContextValue>({
  path: "neutral",
  setPath: () => {},
});

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<AudiencePath>("neutral");

  return (
    <AudienceContext.Provider value={{ path, setPath }}>
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  return useContext(AudienceContext);
}