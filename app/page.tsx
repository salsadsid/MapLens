"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addPloygon } from "@/redux/slices/ploygonSlice";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Home() {
  const ploycarbon = useAppSelector((state) => state.polygon.hello);
  const dispatch = useAppDispatch();
  return (
    <div>
      <h2 className="my-24 text-center text-4xl"> Hello MapLens</h2>
      <p className="text-center my-20">Hello {ploycarbon}</p>
      <button onClick={() => dispatch(addPloygon("redux test"))}>
        Redux Test
      </button>
      <MapContainer
        style={{ height: "50vh", width: "80vh" }}
        className="mx-auto"
        center={[23.8, 90.41]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[23.8, 90.41]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
