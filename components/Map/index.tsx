"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { booleanIntersects, polygon as turfPolygon } from "@turf/turf";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { v4 as uuidv4 } from "uuid";

import { addPolygon } from "@/redux/slices/ploygonSlice";

const DefaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
  const dispatch = useAppDispatch();
  const polygons = useAppSelector((state) => state.polygon.polygons);
  const [isClient, setIsClient] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([]);
  const [mousePosition, setMousePosition] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle Esc key to cancel drawing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawing) {
        setIsDrawing(false);
        setCurrentPoints([]);
        setMousePosition(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDrawing]);

  const handleComplete = () => {
    if (currentPoints.length < 3) {
      alert("Need at least 3 points to create a polygon");
      return;
    }

    const closedPoints = [...currentPoints];
    if (
      closedPoints[0][0] !== closedPoints[closedPoints.length - 1][0] ||
      closedPoints[0][1] !== closedPoints[closedPoints.length - 1][1]
    ) {
      closedPoints.push(closedPoints[0]);
    }

    const newPoly = turfPolygon([closedPoints]);
    const isOverlap = polygons.some((polygon) => {
      const existingPoly = turfPolygon([polygon.coordinates]);
      return booleanIntersects(newPoly, existingPoly);
    });

    if (isOverlap) {
      alert("Polygon overlaps with an existing one!");
      return;
    }

    dispatch(addPolygon({ id: uuidv4(), coordinates: closedPoints }));
    setCurrentPoints([]);
    setMousePosition(null);
    setIsDrawing(false);
  };

  if (!isClient) return <p>Loading Map...</p>;

  return (
    <div style={{ position: "relative" }}>
      <div className="controls px-4 bg-blue-100 flex items-center justify-between">
        <div>
          <p>Current Points: {currentPoints.length}</p>
          <span className="text-sm">
            Drawing{" "}
            {isDrawing ? <span className="text-green-500">On</span> : "Off"}
          </span>
        </div>
        <span className="text-sm ">
          Start → Click map → Double-click/Complete to finish | Esc/Cancel to
          abort
        </span>
        <div className="flex">
          <button
            onClick={() => setIsDrawing(true)}
            disabled={isDrawing}
            style={{ margin: "5px" }}
            className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 transition-all duration-200 text-white font-bold py-2 px-4 rounded"
          >
            Start Drawing
          </button>
          {isDrawing && (
            <>
              <button
                className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 transition-all duration-200 text-white font-bold py-2 px-4 rounded"
                onClick={handleComplete}
                style={{ margin: "5px" }}
              >
                Complete Polygon
              </button>
              <button
                onClick={() => {
                  setIsDrawing(false);
                  setCurrentPoints([]);
                  setMousePosition(null);
                }}
                className="bg-[#d32f2f] hover:bg-[#d32f2f]/90 transition-all duration-200 text-white font-bold py-2 px-4 rounded"
                style={{ margin: "5px" }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <MapContainer
        center={[23.68, 90.35]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <AutoCenter />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {isDrawing && (
          <DrawingHandler
            addPoint={(point) => setCurrentPoints((prev) => [...prev, point])}
            onComplete={handleComplete}
            setMousePosition={setMousePosition}
          />
        )}

        {/* Existing polygons */}
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

        {/* Current drawing polygon */}
        {isDrawing && currentPoints.length > 0 && (
          <>
            <Polyline
              positions={currentPoints}
              pathOptions={{ color: "blue", weight: 2 }}
            />
            {mousePosition && (
              <Polyline
                positions={[
                  currentPoints[currentPoints.length - 1],
                  mousePosition,
                ]}
                pathOptions={{ color: "blue", weight: 2, dashArray: "5,5" }}
              />
            )}
          </>
        )}

        {/* Markers with tooltips */}
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
    </div>
  );
};

interface DrawingHandlerProps {
  addPoint: (point: [number, number]) => void;
  onComplete: () => void;
  setMousePosition: (position: [number, number] | null) => void;
}

const DrawingHandler = ({
  addPoint,
  onComplete,
  setMousePosition,
}: DrawingHandlerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      addPoint([e.latlng.lat, e.latlng.lng]);
    };

    const handleDoubleClick = () => {
      onComplete();
    };

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      setMousePosition([e.latlng.lat, e.latlng.lng]);
    };

    map.doubleClickZoom.disable();
    map.on("click", handleClick);
    map.on("dblclick", handleDoubleClick);
    map.on("mousemove", handleMouseMove);

    return () => {
      map.doubleClickZoom.enable();
      map.off("click", handleClick);
      map.off("dblclick", handleDoubleClick);
      map.off("mousemove", handleMouseMove);
    };
  }, [map, addPoint, onComplete, setMousePosition]);

  return null;
};

const AutoCenter = () => {
  const map = useMap();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      map.setView([position.coords.latitude, position.coords.longitude], 13);
    });
  }, [map]);
  return null;
};

export default MapComponent;
