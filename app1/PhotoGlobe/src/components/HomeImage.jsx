import React, { useState, useEffect } from "react";
import { useAppState } from "../hooks/useAppState.js";

export default function Image({ chunk, imageNumber }) {
  const { imgBaseUrl, loading } = useAppState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track the previous image to hold it in the background during the crossfade
  const [prevImageSrc, setPrevImageSrc] = useState(null);

  useEffect(() => {
    setIsLoaded(false);
    setCurrentIndex(0);
    setPrevImageSrc(null); // Clear background on chunk change

    let intervalId;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % chunk.length;

          // Before changing the index, save the current image path as the background
          const currentFileName =
            chunk[prevIndex]?.FileName?.toLowerCase() || "";
          if (currentFileName) {
            setPrevImageSrc(`${imgBaseUrl}/${currentFileName}`);
          }

          // Trigger the opacity reset for the incoming image
          setIsLoaded(false);
          return nextIndex;
        });
      }, 10000);
    }, 1666 * imageNumber);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [chunk, imgBaseUrl]);

  if (!chunk || !chunk.length) return <div>No image provided</div>;
  if (loading) return <div>Loading assets...</div>;

  console.log(">>>", chunk[0]);

  const fileName = chunk[currentIndex]?.FileName?.toLowerCase() || "";
  const highResPath = `${imgBaseUrl}/${fileName}`;

  return (
    <div className="absolute inset-0 min-h-full min-w-full h-full w-full overflow-hidden bg-black">
      {/* 1. Background Image: Holds the old image static while the new one merges over it */}
      {prevImageSrc && (
        <img
          src={prevImageSrc}
          alt=""
          className="absolute inset-0 min-h-full min-w-full h-full w-full object-cover object-center"
        />
      )}

      {/* 2. Foreground Image: Fades in seamlessly from opacity-0 to opacity-100 */}
      <img
        key={highResPath} // Re-mounts the element to properly re-trigger onLoad every swap
        src={highResPath}
        alt={highResPath}
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 min-h-full min-w-full h-full w-full object-cover object-center transition-opacity duration-1500 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
