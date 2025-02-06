"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addPolygon } from "@/redux/slices/ploygonSlice";
// Or individual functions
import { booleanIntersects, polygon as turfPolygon } from "@turf/turf";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { v4 as uuidv4 } from "uuid";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import AutoCenter from "./components/AutoCenter";

const DefaultIcon = L.icon({
  iconUrl: icon.src, // Use .src to get the string URL
  shadowUrl: iconShadow.src, // Use .src here as well
});

L.Marker.prototype.options.icon = DefaultIcon;
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

      // Ensure polygon is closed
      if (
        latlngs.length > 0 &&
        (latlngs[0][0] !== latlngs[latlngs.length - 1][0] ||
          latlngs[0][1] !== latlngs[latlngs.length - 1][1])
      ) {
        latlngs.push(latlngs[0]); // Close the ring
      }

      // Create a valid Turf polygon
      const newPoly = turfPolygon([latlngs]);

      // Check intersection properly
      const isOverlap = polygons.some((polygon) => {
        const existingPoly = turfPolygon([polygon.coordinates]);
        return booleanIntersects(newPoly, existingPoly);
      });

      console.log("Overlap detected:", isOverlap); // Debugging log

      if (isOverlap) {
        alert("Polygon overlaps with an existing one!");
        return;
      }

      dispatch(addPolygon({ id: uuidv4(), coordinates: latlngs }));
    }
  };

  if (!isClient) return <p>Loading Map...</p>;

  return (
    <MapContainer
      center={[23.68, 90.35]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <AutoCenter />
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
          positions={polygon.coordinates as [number, number][]}
          pathOptions={{
            color: polygon.borderColor,
            fillColor: polygon.fillColor,
            fillOpacity: 0.5,
          }}
        />
      ))}
      {polygons.map((polygon) => (
        <Marker key={polygon.id} position={polygon.center}>
          <Tooltip interactive>
            <div>
              <p>
                <strong>{polygon.label}</strong>
              </p>
              <p>Area: {polygon.area.toFixed(2)} sq. meters</p>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
