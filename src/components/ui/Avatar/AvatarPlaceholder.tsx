import { Placeholder } from "react-bootstrap";
import styles from "./Avatar.module.scss";
import type { TAvatarPlaceholderProps } from "./types";

const BLOCK = "avatar";

export const AvatarPlaceholder = ({ isLoading }: TAvatarPlaceholderProps) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className={styles[`${BLOCK}__placeholder`]}>
      <Placeholder
        animation="glow"
        className={styles[`${BLOCK}__placeholder-content`]}
      />
    </div>
  );
};
