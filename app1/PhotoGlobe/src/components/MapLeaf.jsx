import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Rectangle,
} from "react-leaflet";
import MapImage from "./MapImage.jsx";
import "leaflet/dist/leaflet.css";

// FIX: Leaflet marker icons can sometimes fail to load in React builds.
// This block ensures the default marker icon asset points to the correct CDN.
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapBoundsTracker({ onBoundsChange }) {
  const map = useMapEvents({
    // Fires whenever the user stops dragging/panning the map
    moveend: () => {
      onBoundsChange(map.getBounds(), true);
    },
    // Fires whenever the user stops zooming the map
    zoomend: () => {
      onBoundsChange(map.getBounds(), false);
    },
  });

  return null; // This component does not render any visual UI
}

export default function LeafletMap({
  activeItem,
  isOverview,
  setMapBounds,
  mapBounds,
  setMapCenter,
  mapCenter,
}) {
  const initMinZoom = isOverview ? 8 : 12;
  const initMaxZoom = isOverview ? 12 : 18;
  const startZoom = isOverview ? 10 : 16;

  const [mapInstance, setMapInstance] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(startZoom);
  const doCenterMap = useRef(true);

  //NOTE react-leaflet, the <MapContainer> component handles the lifecycle of creating, rendering, and destroying the underlying Leaflet map instance automatically.

  // useEffect(() => {
  //   // if (!activeItem) {
  //   //     console.log("MapLeaf.ACTIVATED status: NULL");
  //   // }
  //   // else {
  //   //     console.log("MapLeaf.ACTIVATED status:", activeItem.FileName);
  //   // }

  //   flyTo();
  // }, []);

  useEffect(() => {
    // if (!activeItem) {
    //   console.log("MapLeaf.activeItem status: NULL");
    // } else {
    //   console.log("MapLeaf.activeItem status:", activeItem.FileName);
    // }

    flyTo();
  }, [activeItem, mapInstance]);

  // useEffect(() => {
  //   if (mapCenter) {
  //     console.log("Map Center:", {
  //       bottomLeft: [mapCenter.lat, mapCenter.lng],
  //     });
  //   }
  //   // if (mapBounds) {
  //   //   console.log("Map Bounds:", {
  //   //     bottomLeft: [],
  //   //   });
  //   // }
  // }, [mapCenter]);

  // React calls this function when the element mounts or unmounts
  const mapRefCallback = useCallback((map) => {
    if (map !== null) {
      setMapInstance(map);
    }
  }, []);

  const flyTo = () => {
    //console.log("Selected item:", activeItem?.FileName);
    //console.log("Is Overview:", isOverview);

    if (!activeItem) return;

    const coordinates = [activeItem.GPSLatitude, activeItem.GPSLongitude];
    setMarkerPosition(coordinates);
    setIsLoading(false);

    if (!mapInstance) return;

    //console.log("FlyTo", coordinates);
    mapInstance.setView(coordinates, zoomLevel);
    console.log("FlyTo - Zoom Level:", zoomLevel);
  };

  const handleBoundsChange = (bounds, moved) => {
    // console.log("Is Overview:", isOverview);
    // console.log("Selected item:", activeItem?.FileName);

    if (isOverview && !moved) {
      if (mapCenter && mapInstance && doCenterMap.current) {
        const currentCenter = mapInstance.getCenter();
        // 2. Only pan if the distance change is meaningful (e.g., > 0.0001 degrees)
        const distanceDiff = Math.sqrt(
          Math.pow(currentCenter.lat - mapCenter.lat, 2) +
            Math.pow(currentCenter.lng - mapCenter.lng, 2),
        );
        if (distanceDiff > 0.0001) {
          doCenterMap.current = false;
          mapInstance.panTo(mapCenter);
          console.log("MapCentre Updated", mapCenter);
          // 3. Wait for the pan animation to finish before unlocking
          mapInstance.once("moveend", () => {
            doCenterMap.current = true;
          });
        }
      }
    } else {
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const c = bounds.getCenter();
      const sqare = [
        [sw.lat, sw.lng],
        [ne.lat, ne.lng],
      ];
      if (setMapBounds) setMapBounds(sqare);
      if (setMapCenter) setMapCenter(c);
      //console.log("SetMapCentre", c);
    }
  };

  function ZoomLimiter({ min, max }) {
    const map = mapInstance;

    useEffect(() => {
      if (map) {
        map.setMinZoom(min);
        map.setMaxZoom(max);
      }
    }, [map, min, max]);

    return null;
  }

  function ZoomListener({ onZoomChange }) {
    const map = useMapEvents({
      zoomend: () => {
        // Get the precise zoom level when zooming stops
        const currentZoom = map.getZoom();

        onZoomChange(currentZoom);
        console.log("Zoom Level:", zoomLevel);
      },
    });

    return null; // This component doesn't render any visible UI
  }

  if (isLoading) {
    return (
      <div
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading map configurations...</p>
      </div>
    );
  }

  const crossIcon = new L.DivIcon({
    html: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="3" stroke-linecap="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,
    className: "custom-cross-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // const handleMapReady = (mapInstance) => {
  //     if (mapInstance) {
  //         setMap(mapInstance);

  //         console.log("Map Ready");

  //         // Forces Leaflet to recalculate layout dimensions and clear margins
  //         setTimeout(() => {
  //             mapInstance.invalidateSize();
  //         }, 100);

  //     }
  // };

  return (
    <MapContainer
      ref={mapRefCallback}
      center={markerPosition}
      zoom={zoomLevel}
      className="rounded-xl overflow-hidden isolate border border-slate-800"
      dragging={!isOverview}
      // scrollWheelZoom={!isOverview}
      // doubleClickZoom={!isOverview}
      // boxZoom={canInteract}
      // keyboard={canInteract}
      // touchZoom={canInteract}
      // zoomControl={canInteract}
      style={{ height: "100%", width: "100%" }}
    >
      <MapBoundsTracker onBoundsChange={handleBoundsChange} />
      <ZoomLimiter min={initMinZoom} max={initMaxZoom} />
      <ZoomListener onZoomChange={setZoomLevel} />
      {/* OpenStreetMap provides the actual map image tiles */}
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* <TileLayer
                url="https://arcgisonline.com{z}/{y}/{x}"
  attribution="&copy; Esri"
            />
             */}
      {/* Keeps limits synced */}
      {Array.isArray(mapBounds) && mapBounds.length > 0 && (
        <Rectangle
          bounds={mapBounds}
          pathOptions={{ color: "blue", fillOpacity: 0.1, weight: 1 }}
        />
      )}
      {/* A clickable map pin marker */}
      {markerPosition && (
        <Marker
          position={markerPosition}
          icon={isOverview ? crossIcon : L.Marker.prototype.options.icon}
        >
          <Popup minWidth={240} maxWidth={320} className="custom-image-popup">
            {/* 2. Style your popup container */}
            <div className="flex flex-col gap-2 p-1 font-sans">
              {activeItem ? (
                <MapImage
                  fileName={activeItem.FileName}
                  label={activeItem.FileName}
                />
              ) : (
                ""
              )}

              {/* Optional overlay text */}
              <div className="mt-1">
                <h3 className="font-bold text-base text-slate-900 m-0">
                  Copper Kettle
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Use Value Score 2/5
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Chadburn Value Score 2/5
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
