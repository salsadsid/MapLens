"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addPolygon,
  deletePolygon,
  updatePolygon,
} from "@/redux/slices/ploygonSlice";
import styles from "@/styles/PolygonList.module.scss";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChangeEvent, FC, useCallback, useState } from "react";
import { BiSolidFileImport } from "react-icons/bi";
import { PiExportBold } from "react-icons/pi";
import ColorInput from "./components/ColorInput";
// Define the Polygon type
interface Polygon {
  id: string;
  coordinates: number[][];
  fillColor: string;
  borderColor: string;
  label: string;
  center: [number, number];
  area: number;
}

const PolygonList: FC = () => {
  const dispatch = useAppDispatch();
  const polygons = useAppSelector(
    (state) => state.polygon.polygons
  ) as Polygon[];
  const [search, setSearch] = useState("");

  const filteredPolygons = polygons.filter((polygon) =>
    polygon.label.toLowerCase().includes(search.toLowerCase())
  );
  // Export polygons to a JSON file
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(polygons, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "polygons.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [polygons]);

  // Import polygons from a JSON file
  const handleImport = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData: Polygon[] = JSON.parse(
            e.target?.result as string
          );
          importedData.forEach((polygon) => dispatch(addPolygon(polygon)));
        } catch (error) {
          console.error("Error importing polygons:", error);
        }
      };
      reader.readAsText(file);
    },
    [dispatch]
  );

  // Delete a polygon by its ID
  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deletePolygon(id));
    },
    [dispatch]
  );

  // Update either the fill or border color
  const handleUpdate = useCallback(
    (id: string, field: "fillColor" | "borderColor", color: string) => {
      dispatch(updatePolygon({ id, [field]: color }));
    },
    [dispatch]
  );

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Polygon Manager</h2>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {filteredPolygons.length > 0 && (
            <button
              className={styles.controlButton}
              onClick={handleExport}
              aria-label="Export polygons"
            >
              <PiExportBold className="h-5 w-5" />
              Export
            </button>
          )}
          <label className={styles.controlButton}>
            <BiSolidFileImport className="h-5 w-5" />
            Import
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className={styles.fileInput}
              aria-label="Import polygons"
            />
          </label>
        </div>
      </header>

      {
        // If there are no polygons, show a message
        filteredPolygons.length === 0 && (
          <p className={styles.noPolygons}>
            No polygons found. <Link href="/draw">Draw a polygon</Link>.
          </p>
        )
      }

      <ul className={styles.polygonList}>
        {filteredPolygons.map((polygon, index) => (
          <motion.li
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            key={polygon.id}
            className={styles.polygonItem}
          >
            <div className={styles.polygonHeader}>
              <h3>{polygon.label}</h3>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(polygon.id)}
                aria-label={`Delete ${polygon.label}`}
              >
                &times;
              </button>
            </div>
            <div className={styles.details}>
              <p>
                <strong>Area:</strong> {polygon.area.toFixed(2)} m²
              </p>
              <p>
                <strong>Center:</strong> {polygon.center.join(", ")}
              </p>
            </div>
            <div className={styles.colorControls}>
              <ColorInput
                label="Fill Color"
                value={polygon.fillColor}
                onChange={(color) =>
                  handleUpdate(polygon.id, "fillColor", color)
                }
              />
              <ColorInput
                label="Border Color"
                value={polygon.borderColor}
                onChange={(color) =>
                  handleUpdate(polygon.id, "borderColor", color)
                }
              />
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default PolygonList;
