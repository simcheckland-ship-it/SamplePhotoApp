import React from "react";

export default function IconImage({ fileName, label }) {
  const iconPath = `${import.meta.env.VITE_IMAGE_BASE_URL}/thumbs/${fileName.toLowerCase()}`;

  return (
    <img
      src={iconPath}
      alt={label}
      // CRUCIAL: w-full and h-full tell the image to stretch to the 10x10 amber box
      // object-cover crops it cleanly so it doesn't look stretched or distorted
      className="w-full h-full object-cover block"
    />
  );
}
