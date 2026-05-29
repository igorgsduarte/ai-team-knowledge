"use client";

import { useMemo } from "react";

type RelativeTimeProps = {
  date: string;
};

export function RelativeTime({ date }: RelativeTimeProps) {
  const label = useMemo(() => {
    const then = new Date(date).getTime();
    const diffMs = Date.now() - then;
    const minutes = Math.max(1, Math.floor(diffMs / 60000));
    if (minutes < 60) {
      return `${minutes} min ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }, [date]);

  return <span className="relative-time">{label}</span>;
}
