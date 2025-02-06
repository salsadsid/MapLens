"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addPolygon,
  deletePolygon,
  updatePolygon,
} from "@/redux/slices/ploygonSlice";
import styles from "@/styles/PolygonList.module.scss";
import { ChangeEvent, FC, useCallback } from "react";
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
          <button
            className={styles.controlButton}
            onClick={handleExport}
            aria-label="Export polygons"
          >
            Export
          </button>
          <label className={styles.controlButton}>
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

      <ul className={styles.polygonList}>
        {polygons.map((polygon) => (
          <li key={polygon.id} className={styles.polygonItem}>
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
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PolygonList;
