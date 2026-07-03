import React from 'react';

export default function MapImage({ fileName, label }) {
    const iconPath = `/images/${fileName}`;

  return (
    <img
      src={iconPath}
      alt={label}
      // CRUCIAL: w-full and h-full tell the image to stretch to the 10x10 amber box
      // object-cover crops it cleanly so it doesn't look stretched or distorted
       className="w-full h-40 object-cover rounded-lg shadow-sm"
    />
    
  );
}