import React from "react";
import { useState, useEffect } from "react";
import ImageList from "../components/ImageList.jsx";
import MapImage from "../components/MapImage.jsx";
import Map3D from "../components/Map3D.jsx";
import MapLeaf from "../components/MapLeaf.jsx";
import { usePhotos } from "../hooks/usePhotos.js";
import { useAppState } from "../hooks/useAppState.js";
import { Panel, Group, Separator } from "react-resizable-panels";

export default function MapPage() {
  const { data: photos, isLoading, isError, error } = usePhotos();

  const { activeItem, setActiveItem } = useAppState();
  const [activeMap, setActiveMap] = useState("leaf");
  const [overviewMapScale, setOverviewMapScale] = useState(8);

  const [mapBounds, setMapBounds] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const { loading } = useAppState();

  const updateMapCenter = (latLng, source) => {
    setMapCenter({
      lat: latLng.lat,
      lng: latLng.lng,
      source: source, // 'external', 'overview', or 'detail'
    });
  };

  useEffect(() => {
    if (loading) return;

    // if no activeItem
    if (photos && photos.length > 0 && !activeItem) {
      setActiveItem(photos[0]); // Pick the first user automatically
    }
    // axriveItem changed
    if (
      activeItem &&
      typeof activeItem.GPSLatitude === "number" &&
      typeof activeItem.GPSLongitude === "number"
    ) {
      setMapCenter({
        lat: activeItem.GPSLatitude,
        lng: activeItem.GPSLongitude, // Map lon to standard Leaflet lng property
        source: "external", // Critical flag to command both maps to warp
      });
      console.log("PAGE - ACTIVE ITEM changed:");
    }
  }, [photos, activeItem, loading]);

  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Panel: Fixed width, interior scrolling only */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
          <ImageList
            appData={photos}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        </aside>

        {/* Left Sidebar Panel */}

        {/* 'flex-1' allows it to stretch to the right browser wall dynamically */}
        <main className="flex-1 h-full w-full overflow-hidden bg-slate-950 relative grid grid-cols-[1fr_minmax(0px,400px)] p-2 gap-2">
          {/* Left Column (Takes up 100% height of the left side) */}
          <div className=" rounded-lg  flex flex-col items-center justify-center ">
            {activeMap === "3D" ? (
              <Map3D mapTarget={activeItem} />
            ) : (
              <MapLeaf
                isOverview={false}
                activeItem={activeItem}
                setMapBounds={setMapBounds}
                setMapCenter={setMapCenter}
              />
            )}
          </div>

          {/* Right Column (Split into 2 equal rows) */}
          <div className="grid grid-rows-[auto_1fr] gap-2 h-full min-h-0 ">
            {/* Right Column - Top Row */}
            <div className="border border-emerald-500/50 rounded-xl flex flex-col items-center justify-center min-h-50 max-h-100 h-full overflow-hidden">
              {activeItem ? (
                <MapImage
                  fileName={activeItem.FileName}
                  label={activeItem.FileName}
                />
              ) : (
                ""
              )}
            </div>

            {/* Right Column - Bottom Row */}
            <div className=" flex flex-col items-center justify-center">
              <MapLeaf
                activeItem={activeItem}
                isOverview={true}
                mapBounds={mapBounds}
                mapCenter={mapCenter}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
