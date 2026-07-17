import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../hooks/useAppState.js";
import { useNavigate } from "react-router-dom";

export default function Image({ chunk, imageNumber, activeImage }) {
  const { imgBaseUrl, loading, setActiveItem } = useAppState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevImageSrc, setPrevImageSrc] = useState(null);
  const navigate = useNavigate();

  // Track previous activation state to detect the exact moment it *becomes* active
  const wasActiveRef = useRef(false);
  const isActive = imageNumber === activeImage;

  // 1. Reset everything ONLY if the underlying data chunk changes
  useEffect(() => {
    setIsLoaded(false);
    setCurrentIndex(0);
    setPrevImageSrc(null);
    wasActiveRef.current = false;
  }, [chunk]);

  // 2. Advance exactly ONE step when this specific component becomes active
  useEffect(() => {
    if (!chunk || !chunk.length) return;

    if (isActive && !wasActiveRef.current) {
      // Capture the current image as the background before we step forward
      const currentFileName =
        chunk[currentIndex]?.FileName?.toLowerCase() || "";
      if (currentFileName) {
        setPrevImageSrc(`${imgBaseUrl}/small/${currentFileName}`);
      }

      // Trigger the fade-out of the foreground
      setIsLoaded(false);

      // Increment index safely
      setCurrentIndex((prevIndex) => (prevIndex + 1) % chunk.length);
    }

    // Persist the active state to the ref
    wasActiveRef.current = isActive;
  }, [isActive, chunk, currentIndex, imgBaseUrl]);

  if (!chunk || !chunk.length) return <div>No image provided</div>;
  if (loading) return <div>Loading assets...</div>;

  const fileName = chunk[currentIndex]?.FileName?.toLowerCase() || "";
  const highResPath = `${imgBaseUrl}/small/${fileName}`;

  const handleClick = () => {
    setActiveItem(chunk[currentIndex]);
    navigate("/map");
  };

  return (
    <div className="absolute inset-0 min-h-full min-w-full h-full w-full overflow-hidden bg-black">
      {/* Background Layer: Holds the previous image firmly during crossfade */}
      {prevImageSrc && (
        <img
          src={prevImageSrc}
          alt=""
          className="absolute inset-0 min-h-full min-w-full h-full w-full object-cover object-center"
        />
      )}
      {/* Foreground Layer: Fades in smoothly once the new asset finishes loading */}
      <img
        key={highResPath}
        src={highResPath}
        alt=""
        onClick={handleClick}
        onLoad={() => setIsLoaded(true)}
        style={{ cursor: "pointer" }}
        className={`absolute inset-0 min-h-full min-w-full h-full w-full object-cover object-center transition-opacity duration-[2500ms] ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
