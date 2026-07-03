import React from "react";

export default function Image({ fileName, label }) {
  const imagePath = `http://192.168.0.202/uploads/${fileName.toLowerCase()}`;

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
      alt="Grid constrained layout"
      className="max-w-full max-h-full w-auto h-auto object-contain rounded"
    />
  );
}
