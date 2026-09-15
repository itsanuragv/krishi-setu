"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { MapViewProps } from "./map-view";

function createHtmlIcon(color: string, label: string, iconText: string) {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background:${color}; color:white; padding:4px 8px; border-radius:9999px; font-weight:700; font-size:11px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); border:2px solid white; white-space:nowrap; display:flex; align-items:center; gap:4px;">
          <span>${iconText}</span>
          <span>${label}</span>
        </div>
        <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:8px solid ${color};"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function MapAutoBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }
    const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }, [map, points]);

  return null;
}

export function MapViewInner({
  origin = { lat: 19.9975, lng: 73.7898, label: "Farm (Niphad)", type: "farmer" },
  destination = { lat: 18.5204, lng: 73.8567, label: "Consumer (Pune)", type: "consumer" },
  driver,
  radiusKm = 25,
  heightClass = "h-72",
  className = "",
  interactive = true,
}: MapViewProps) {
  const farmIcon = useMemo(() => createHtmlIcon("#166534", origin.label, "🌾"), [origin.label]);
  const consumerIcon = useMemo(
    () => createHtmlIcon("#1e40af", destination?.label ?? "Drop-off", "🛒"),
    [destination?.label]
  );
  const driverIcon = useMemo(
    () => createHtmlIcon("#d97706", driver?.label ?? "Delivery Partner", "🚚"),
    [driver?.label]
  );

  const center: [number, number] = [origin.lat, origin.lng];

  const polylineCoords: [number, number][] = useMemo(() => {
    const pts: [number, number][] = [[origin.lat, origin.lng]];
    if (driver) pts.push([driver.lat, driver.lng]);
    if (destination) pts.push([destination.lat, destination.lng]);
    return pts;
  }, [origin, driver, destination]);

  const allPoints: [number, number][] = useMemo(() => {
    const pts: [number, number][] = [[origin.lat, origin.lng]];
    if (destination) pts.push([destination.lat, destination.lng]);
    if (driver) pts.push([driver.lat, driver.lng]);
    return pts;
  }, [origin, destination, driver]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${heightClass} ${className}`}>
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapAutoBounds points={allPoints} />

        {/* Hyperlocal <25km PostGIS Proximity Radius */}
        {radiusKm > 0 && (
          <Circle
            center={[origin.lat, origin.lng]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: "#166534",
              fillColor: "#22c55e",
              fillOpacity: 0.12,
              weight: 2,
              dashArray: "6, 8",
            }}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-bold text-primary">Hyperlocal Radius</p>
                <p>Matches prioritized within {radiusKm} km (PostGIS ST_DWithin)</p>
              </div>
            </Popup>
          </Circle>
        )}

        {/* Route Polyline */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: "#d97706",
              weight: 4,
              opacity: 0.8,
              dashArray: "8, 8",
            }}
          />
        )}

        {/* Origin (Farmer) */}
        <Marker position={[origin.lat, origin.lng]} icon={farmIcon}>
          <Popup>
            <div className="text-xs space-y-1">
              <p className="font-bold text-primary">🌾 Farm Origin</p>
              <p>{origin.label}</p>
              {origin.details && <p className="text-muted-foreground">{origin.details}</p>}
            </div>
          </Popup>
        </Marker>

        {/* Destination (Consumer/Buyer) */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={consumerIcon}>
            <Popup>
              <div className="text-xs space-y-1">
                <p className="font-bold text-blue-700">🛒 Delivery Destination</p>
                <p>{destination.label}</p>
                {destination.details && <p className="text-muted-foreground">{destination.details}</p>}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Driver live location */}
        {driver && (
          <Marker position={[driver.lat, driver.lng]} icon={driverIcon}>
            <Popup>
              <div className="text-xs space-y-1">
                <p className="font-bold text-amber-700">🚚 Transit Partner</p>
                <p>{driver.label}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Floating Proximity Badge */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[400] flex items-center gap-2 rounded-xl bg-card/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur border border-border">
        <span className="size-2.5 rounded-full bg-emerald-600 animate-pulse" />
        <span>Hyperlocal PostGIS Matching: &lt;{radiusKm}km radius</span>
      </div>
    </div>
  );
}
