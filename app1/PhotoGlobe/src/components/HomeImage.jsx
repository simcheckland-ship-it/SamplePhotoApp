import React, { useState, useEffect } from "react";
import { useAppState } from "../hooks/useAppState.js";
import { useNavigate } from "react-router-dom";

export default function Image({ chunk, imageNumber, activeImage }) {
  const { imgBaseUrl, loading, setActiveItem } = useAppState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevImageSrc, setPrevImageSrc] = useState(null);
  const navigate = useNavigate();
  // Reset states immediately when chunk changes
  useEffect(() => {
    setIsLoaded(false);
    setCurrentIndex(0);
    setPrevImageSrc(null);
  }, [chunk]);

  /*   useEffect(() => {
    if (!chunk || !chunk.length) return;

    // Stop the timer loop entirely if the page is not active
    if (!isPageActive) return;

    if (imageNumber === activeImage) {
      const currentFileName =
        chunk[currentIndex]?.FileName?.toLowerCase() || "";
      if (currentFileName) {
        setPrevImageSrc(`${imgBaseUrl}/${currentFileName}`);
      }

      setIsLoaded(false);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % chunk.length);
    }

    console.log(">>>", activeImage, imageNumber);
  }, [chunk, currentIndex, imgBaseUrl, imageNumber, activeImage, isPageActive]); */

  useEffect(() => {
    if (!chunk || !chunk.length) return;

    if (imageNumber === activeImage) {
      const currentFileName =
        chunk[currentIndex]?.FileName?.toLowerCase() || "";
      if (currentFileName) {
        setPrevImageSrc(`${imgBaseUrl}/${currentFileName}`);
      }

      setIsLoaded(false);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % chunk.length);
    }
  }, [activeImage]);

  if (!chunk || !chunk.length) return <div>No image provided</div>;
  if (loading) return <div>Loading assets...</div>;

  const fileName = chunk[currentIndex]?.FileName?.toLowerCase() || "";
  const highResPath = `${imgBaseUrl}/${fileName}`;

  const handleClick = () => {
    // Run any logic here

    setActiveItem(chunk[currentIndex]);
    navigate("/map");
  };

  return (
    <div className="absolute inset-0 min-h-full min-w-full h-full w-full overflow-hidden bg-black">
      {prevImageSrc && (
        <img
          src={prevImageSrc}
          alt=""
          className="absolute inset-0 min-h-full min-w-full h-full w-full object-cover object-center"
        />
      )}

      <img
        key={highResPath}
        src={highResPath}
        alt=""
        onClick={handleClick}
        onLoad={() => setIsLoaded(true)}
        style={{ cursor: "pointer" }}
        className={`absolute inset-0 min-h-full min-w-full h-full w-full object-cover object-center transition-opacity duration-1500 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
