"use client";

import { useState, useEffect } from "react";
import { ANNOUNCEMENT_MESSAGES } from "@/lib/utils/constants";

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary text-white py-2 px-4 text-center overflow-hidden">
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] transition-all duration-500">
        {ANNOUNCEMENT_MESSAGES[current]}
      </p>
    </div>
  );
}
