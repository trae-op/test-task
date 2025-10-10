import { Form } from "react-bootstrap";
import clsx from "clsx";
import type { SelectProps } from "./types";
import styles from "./SelectField.module.scss";

export const SelectField = ({
  options,
  value,
  onChange,
  placeholder,
  className,
}: SelectProps) => {
  return (
    <Form.Select
      value={value}
      onChange={onChange}
      className={clsx(styles["select-field"], className)}
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
};
