"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addPolygon,
  deletePolygon,
  updatePolygon,
} from "@/redux/slices/ploygonSlice";

const PolygonList = () => {
  const dispatch = useAppDispatch();
  const polygons = useAppSelector((state) => state.polygon.polygons);
  const handleExport = () => {
    const dataStr = JSON.stringify(polygons, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "polygons.json";
    a.click();
  };
  const handleImport = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const importedData = JSON.parse(event.target?.result as string);
      importedData.forEach((polygon: any) => dispatch(addPolygon(polygon)));
    };
    reader.readAsText(file);
  };
  return (
    <div>
      <h2>Manage Polygons</h2>
      <button onClick={handleExport}>Export Polygons</button>
      <input type="file" accept="application/json" onChange={handleImport} />
      {polygons.map((polygon) => (
        <div key={polygon.id} className="polygon-item">
          <p>Polygon ID: {polygon.id}</p>
          <label>
            Fill Color:
            <input
              type="color"
              value={polygon.fillColor}
              onChange={(e) =>
                dispatch(
                  updatePolygon({ id: polygon.id, fillColor: e.target.value })
                )
              }
            />
          </label>
          <label>
            Border Color:
            <input
              type="color"
              value={polygon.borderColor}
              onChange={(e) =>
                dispatch(
                  updatePolygon({ id: polygon.id, borderColor: e.target.value })
                )
              }
            />
          </label>
          <button onClick={() => dispatch(deletePolygon(polygon.id))}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default PolygonList;
