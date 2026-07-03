import React, { useEffect, useRef } from 'react';
import { Viewer, Terrain, Ion, Cartesian3,  Math as CesiumMath } from 'cesium';

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NmE0NWJhNy02M2ZkLTQ4NDctOGZkYS04MWVlMDljMmRjZWYiLCJpZCI6Mzc4MDAyLCJpYXQiOjE3NjgzMTgwNTZ9.nAn44GDjr2MZWChbmCBeRy8Cr413EYkITnET6tbi984';

export default function Map3D({ mapTarget }) {
    const containerRef = useRef(null);
    const viewerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize Cesium Viewer
        viewerRef.current = new Viewer(containerRef.current, {
            terrain: Terrain.fromWorldTerrain(),
            timeline: false,  // hides the timeline bar
            animation: false, // hides the animation clock widget
            infoBox: false, // Disables the InfoBox widget
            selectionIndicator: false,
            geocoder: false,           // Search bar
            homeButton: false,         // Home view button
            fullscreenButton: false,   // Fullscreen toggle

         
        });

        return () => {
            viewerRef.current.destroy();
            viewerRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!viewerRef.current || !mapTarget) return;

        viewerRef.current.camera.flyTo({
            destination: Cartesian3.fromDegrees(mapTarget.GPSLongitude, mapTarget.GPSLatitude, 1000),
            orientation: {
                pitch: CesiumMath.toRadians(-35.0), // Look downward at an angle
            },
            duration: 3.0, // 3-second travel animation
        });


    }, [mapTarget])

    return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}
