import { memo } from "react";
import { THeaderInfoProps } from "./types";
import { Logo } from "./Logo";
import styles from "./styles/HeaderInfo.module.scss";

const HeaderInfo = memo((props: THeaderInfoProps) => {
  const { title } = props;

  return (
    <div className={styles["header-info"]}>
      <Logo />
      <span className={styles["header-info__title"]}>{title}</span>
    </div>
  );
});

export { HeaderInfo };
