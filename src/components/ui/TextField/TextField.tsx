import Form from "react-bootstrap/Form";
import clsx from "clsx";
import { ITextFieldProps } from "./types";
import { ErrorMessage } from "./ErrorMessage";
import styles from "./TextField.module.scss";

const BLOCK = "text-field";

export const TextField = ({
  className,
  inputClassName = "",
  errorMessage,
  ...rest
}: ITextFieldProps) => {
  return (
    <div className={clsx(styles[BLOCK], className)}>
      <Form.Control
        className={clsx(styles[`${BLOCK}__input`], inputClassName)}
        {...rest}
      />
      <ErrorMessage text={errorMessage} />
    </div>
  );
};
