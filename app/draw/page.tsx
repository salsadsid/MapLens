"use client";

import { useAppSelector } from "@/redux/hooks";
import { deletePolygon } from "@/redux/slices/ploygonSlice";
import styles from "@/styles/MangePolygons.module.scss";
import stylesPolygonList from "@/styles/PolygonList.module.scss";
import dynamic from "next/dynamic";

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import("@/components/Map"), { ssr: false });

const ManagePolygons = () => {
  const polygons = useAppSelector((state) => state.polygon.polygons);

  return (
    <div className={styles.container}>
      {polygons.length > 0 && (
        <aside className={styles.sidebar}>
          <h2>Quick view</h2>
          {polygons.map((polygon) => (
            <div key={polygon.id} className={styles.polygonCard}>
              <p>{polygon.label}</p>
              <button
                className={stylesPolygonList.deleteButton}
                onClick={() => deletePolygon(polygon.id)}
                aria-label={`Delete ${polygon.label}`}
              >
                &times;
              </button>
            </div>
          ))}
        </aside>
      )}

      <main className={styles.mapContainer}>
        <MapComponent />
      </main>
    </div>
  );
};

export default ManagePolygons;
