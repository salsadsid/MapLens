"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { deletePolygon } from "@/redux/slices/ploygonSlice";
import styles from "@/styles/MangePolygons.module.scss";
import stylesPolygonList from "@/styles/PolygonList.module.scss";
import dynamic from "next/dynamic";
import Loading from "../loading";

import { AnimatePresence, motion } from "framer-motion";
// Dynamically import MapComponent with SSR disabled
// const MapComponent = dynamic(() => import("@/components/Map"), { ssr: false });
const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <Loading />,
});
const ManagePolygons = () => {
  const polygons = useAppSelector((state) => state.polygon.polygons);
  const dispatch = useAppDispatch();
  return (
    <div className={styles.container}>
      <AnimatePresence>
        {polygons.length > 0 && (
          <motion.aside
            className={styles.sidebar}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Quick view</h2>
            {polygons.map((polygon) => (
              <motion.div
                key={polygon.id}
                className={styles.polygonCard}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <p>{polygon.label}</p>
                <button
                  className={stylesPolygonList.deleteButton}
                  onClick={() => dispatch(deletePolygon(polygon.id))}
                  aria-label={`Delete ${polygon.label}`}
                >
                  &times;
                </button>
              </motion.div>
            ))}
          </motion.aside>
        )}
      </AnimatePresence>

      <main className={styles.mapContainer}>
        <MapComponent />
      </main>
    </div>
  );
};

export default ManagePolygons;
