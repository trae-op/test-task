import { ExclamationCircle } from "react-bootstrap-icons";
import styles from "./Avatar.module.scss";
import type { TAvatarErrorProps } from "./types";

const BLOCK = "avatar";

export const AvatarError = ({ size, hasError }: TAvatarErrorProps) => {
  if (!hasError) {
    return null;
  }

  return (
    <div className={styles[`${BLOCK}__error`]}>
      <ExclamationCircle
        size={size}
        className={styles[`${BLOCK}__error-icon`]}
      />
    </div>
  );
};
