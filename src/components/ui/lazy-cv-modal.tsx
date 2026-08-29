"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useCv } from "@/components/providers/cv-provider";

type CvModalComponent = ComponentType;

/** Load the print-ready CV UI only after a visitor asks to open it. */
export function LazyCvModal() {
  const { isOpen } = useCv();
  const [Modal, setModal] = useState<CvModalComponent | null>(null);

  useEffect(() => {
    if (!isOpen || Modal) return;

    let active = true;
    import("@/components/ui/cv-modal")
      .then((module) => {
        if (active) setModal(() => module.CvModal);
      })
      .catch(() => {
        // A local chunk failure leaves the opener usable without a broken UI.
      });

    return () => {
      active = false;
    };
  }, [Modal, isOpen]);

  return isOpen && Modal ? <Modal /> : null;
}
