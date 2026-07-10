import React from "react";

export default function Image({ fileName, label }) {
  const imagePath = `${import.meta.env.VITE_IMAGE_BASE_URL}/${fileName.toLowerCase()}`;

  return (
    // <img
    //   src={iconPath}
    //   alt={label}
    //   // CRUCIAL: w-full and h-full tell the image to stretch to the 10x10 amber box
    //   // object-cover crops it cleanly so it doesn't look stretched or distorted
    //       className="max-w-full max-h-full w-auto h-auto object-contain rounded"
    // />

    <img
      src={imagePath}
      alt="{label}"
      className="absolute inset-0 min-h-full min-w-full h-full w-full object-cover object-center"
    />
  );
}
