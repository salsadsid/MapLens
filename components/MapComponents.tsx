"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addPolygon } from "@/redux/slices/ploygonSlice";

import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FeatureGroup, MapContainer, Polygon, TileLayer } from "react-leaflet";
import { v4 as uuidv4 } from "uuid";

// Dynamically import EditControl to fix "L is not defined" error
const EditControl = dynamic(
  () => import("react-leaflet-draw").then((mod) => mod.EditControl),
  { ssr: false }
);

const MapComponent = () => {
  const dispatch = useAppDispatch();
  const polygons = useAppSelector((state) => state.polygon.polygons);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onCreated = (e: any) => {
    const { layer } = e;
    if (layer && layer.getLatLngs) {
      const latlngs = layer
        .getLatLngs()[0]
        .map((latlng: any) => [latlng.lat, latlng.lng]);
      dispatch(addPolygon({ id: uuidv4(), coordinates: latlngs }));
    }
  };

  if (!isClient) return <p>Loading Map...</p>;

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
          }}
        />
      </FeatureGroup>
      {polygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          positions={polygon.coordinates}
          pathOptions={{
            color: polygon.borderColor,
            fillColor: polygon.fillColor,
            fillOpacity: 0.5,
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;
