"use client";
import MapComponent from "@/components/MapComponents";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { deletePolygon } from "@/redux/slices/ploygonSlice";
import styles from "./MangePolygons.module.scss";

// Dynamically load Leaflet to avoid SSR issues
// const MapComponent = dynamic(() => import("@/components/MapComponents"), {
//   ssr: false,
// });

const ManagePolygons = () => {
  const polygons = useAppSelector((state) => state.polygon.polygons);

  const dispatch = useAppDispatch();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Manage Polygons</h2>
        {polygons.length === 0 ? (
          <p>No polygons added yet.</p>
        ) : (
          polygons.map((polygon) => (
            <div key={polygon.id} className={styles.polygonCard}>
              <p>{polygon.label}</p>
              <button onClick={() => dispatch(deletePolygon(polygon.id))}>
                ❌ Delete
              </button>
            </div>
          ))
        )}
      </aside>

      <main className={styles.mapContainer}>
        <MapComponent />
      </main>
    </div>
  );
};

export default ManagePolygons;
