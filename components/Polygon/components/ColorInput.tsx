import styles from "@/styles/ColorInput.module.scss";
import { FC } from "react";
interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorInput: FC<ColorInputProps> = ({ label, value, onChange }) => {
  return (
    <label className={styles.colorInput}>
      <span>{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
    </label>
  );
};

export default ColorInput;
