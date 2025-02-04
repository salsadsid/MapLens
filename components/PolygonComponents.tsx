"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { deletePolygon, updatePolygon } from "@/redux/slices/ploygonSlice";

const PolygonList = () => {
  const dispatch = useAppDispatch();
  const polygons = useAppSelector((state) => state.polygon.polygons);

  return (
    <div>
      <h2>Manage Polygons</h2>
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
