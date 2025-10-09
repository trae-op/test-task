import { FormControlProps } from "react-bootstrap";

export interface ITextFieldProps extends Omit<FormControlProps, "ref"> {
  className?: string;
  inputClassName?: string;
}
