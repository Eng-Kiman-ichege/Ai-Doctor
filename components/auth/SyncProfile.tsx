"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function SyncProfile() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      // Trigger the profile sync API
      fetch("/api/profile/sync", {
        method: "POST",
      }).catch((err) => console.error("Auto-sync failed:", err));
    }
  }, [isSignedIn, user?.id]);

  return null; // This component runs in the background
}
