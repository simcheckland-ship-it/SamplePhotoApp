import React from "react";
import { useState, useEffect } from "react";
import ImageList from "../components/ImageList.jsx";
import Image from "../components/Image.jsx";
import { usePhotos } from "../hooks/usePhotos.js";
import { useAppState } from "../hooks/useAppState.js";

export default function ImagePage() {
  const { data: photos, isLoading, isError, error, isFetching } = usePhotos();
  const { activeItem, setActiveItem } = useAppState();
  const { loading } = useAppState();

  //const [ activeItem, setActiveItem ] = useState(() => getDefaultItem());

  // const handleItemChange  = (itemId) => {
  //   const itemData = findItem(itemId);
  //   if (!itemData) {
  //     console.warn(`Item with ID "${itemId}" was not found.`);
  //     setActiveItem(null);
  //     return;
  //   }
  //   setActiveItem(itemData);

  //   // You can also trigger side effects here
  //   console.log(`Navigation changed to: ${itemId}`);
  // };

  useEffect(() => {
    if (loading) return;

    if (photos && photos.length > 0 && !activeItem) {
      setActiveItem(photos[0]); // Pick the first user automatically
    }
  }, [photos, activeItem, loading]); // Triggers immediately when 'users' loads into memory

  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Panel: Fixed width, interior scrolling only */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
          <ImageList
            appData={photos}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            loading={loading}
          />
        </aside>

        {/* 3. The Blank Map Canvas Area */}
        {/* 'flex-1' allows it to stretch to the right browser wall dynamically */}
        <main className="flex-1 h-full overflow-hidden bg-slate-950 relative flex flex-col items-center justify-center p-8">
          {/* Decorative Technical Blueprint Background grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

          {activeItem ? (
            <Image fileName={activeItem.FileName} label={activeItem.FileName} />
          ) : (
            ""
          )}
        </main>
      </div>
    </>
  );
}
