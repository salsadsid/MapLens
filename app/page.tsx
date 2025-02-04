"use client";
import MapComponent from "@/components/MapComponents";
import { useAppDispatch } from "@/redux/hooks";

import "leaflet/dist/leaflet.css";
import Link from "next/link";

export default function Home() {
  const dispatch = useAppDispatch();
  return (
    <div>
      <h2 className="my-24 text-center text-4xl"> Hello MapLens</h2>
      <Link href="/manage-polygons">Manage Polygons</Link>
      <MapComponent />
    </div>
  );
}
