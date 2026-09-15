"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

export interface MapLocation {
  lat: number;
  lng: number;
  label: string;
  details?: string;
  type?: "farmer" | "consumer" | "delivery";
}

export interface MapViewProps {
  origin?: MapLocation;
  destination?: MapLocation;
  driver?: MapLocation;
  radiusKm?: number;
  heightClass?: string;
  className?: string;
  interactive?: boolean;
}

const DynamicLeafletMap = dynamic(
  () => import("./map-view-inner").then((mod) => mod.MapViewInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center rounded-2xl bg-muted/60 text-sm text-muted-foreground animate-pulse">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-primary animate-ping" />
          <span>Loading Hyperlocal PostGIS Map…</span>
        </div>
      </div>
    ),
  }
);

export function MapView(props: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`flex w-full items-center justify-center rounded-2xl bg-muted/60 text-sm text-muted-foreground ${
          props.heightClass ?? "h-64"
        }`}
      >
        <span>Loading map…</span>
      </div>
    );
  }

  return <DynamicLeafletMap {...props} />;
}
