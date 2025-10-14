import { ExclamationCircle } from "react-bootstrap-icons";
import styles from "./Picture.module.scss";

const BLOCK = "picture";

export const PictureError = ({
  size,
  hasError,
}: {
  size?: string | number;
  hasError: boolean;
}) => {
  if (!hasError) return null;
  return (
    <div className={styles[`${BLOCK}__error`]}>
      <ExclamationCircle
        size={size}
        className={styles[`${BLOCK}__error-icon`]}
      />
    </div>
  );
};
