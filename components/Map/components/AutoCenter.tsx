"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
const AutoCenter = () => {
  const map = useMap();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      map.setView([position.coords.latitude, position.coords.longitude], 13);
    });
  }, [map]);
  return null;
};

export default AutoCenter;
