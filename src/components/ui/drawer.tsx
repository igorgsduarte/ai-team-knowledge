"use client";

import { ReactNode, useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

type DrawerProps = {
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export function Drawer({ children, onOpenChange, open, title }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.activeElement as HTMLElement | null;
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes.length) {
        return;
      }

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="drawer-root" role="presentation">
      <button
        aria-label="Fechar"
        className="drawer-overlay"
        onClick={() => onOpenChange(false)}
        type="button"
      />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="drawer-panel"
        ref={panelRef}
        role="dialog"
      >
        <header className="drawer-header">
          <h2 id={titleId}>{title}</h2>
          <button
            aria-label="Fechar"
            className="drawer-close"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </header>
        <div className="drawer-body">{children}</div>
      </div>
    </div>
  );
}
