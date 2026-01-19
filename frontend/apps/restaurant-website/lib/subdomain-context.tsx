"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { SubdomainContext } from "./subdomain";

interface SubdomainContextType extends SubdomainContext {
  loading: boolean;
  error: string | null;
}

const SubdomainContext = createContext<SubdomainContextType | undefined>(undefined);

/**
 * Provider component to make subdomain context available to child components
 * Reads subdomain info from headers (server-side) and cookies (client-side)
 */
export function SubdomainProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<SubdomainContextType>({
    subdomain: null,
    isRestaurantSite: false,
    isMainSite: true,
    slug: null,
    host: "",
    loading: true,
    error: null,
  });

  useEffect(() => {
    try {
      // Get subdomain info from cookies set by middleware
      const restaurantSlug = getCookie("restaurant-slug");
      const isRestaurantSite = getCookie("is-restaurant-site") === "true";

      // Get host from window.location
      const host = typeof window !== "undefined" ? window.location.host : "";

      setContext({
        subdomain: restaurantSlug || null,
        isRestaurantSite,
        isMainSite: !isRestaurantSite,
        slug: restaurantSlug || null,
        host,
        loading: false,
        error: null,
      });
    } catch (error) {
      setContext((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to parse subdomain",
      }));
    }
  }, []);

  return (
    <SubdomainContext.Provider value={context}>
      {children}
    </SubdomainContext.Provider>
  );
}

/**
 * Hook to access subdomain context in components
 */
export function useSubdomain(): SubdomainContextType {
  const context = useContext(SubdomainContext);
  if (context === undefined) {
    throw new Error("useSubdomain must be used within SubdomainProvider");
  }
  return context;
}

/**
 * Helper to get cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}
