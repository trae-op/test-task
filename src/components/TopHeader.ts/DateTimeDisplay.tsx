import { memo } from "react";
import { Clock } from "react-bootstrap-icons";
import type { TDateTimeDisplayProps } from "./types";
import { formatDateTime } from "@/utils/dateTime";
import styles from "./styles/DateTimeDisplay.module.scss";

const BLOCK = "date-time";

const DateTimeDisplay = memo((props: TDateTimeDisplayProps) => {
  const { date } = props;
  const { formattedDate, formattedTime } = formatDateTime(date, "en-US");

  return (
    <div className={styles[BLOCK]}>
      <div className={styles[`${BLOCK}__label`]}>Today</div>
      <div className={styles[`${BLOCK}__wrapper`]}>
        <span className={styles[`${BLOCK}__date`]}>{formattedDate}</span>
        <div className={styles[`${BLOCK}__time-wrapper`]}>
          <div className={styles[`${BLOCK}__clock-container-icon`]}>
            <Clock className={styles[`${BLOCK}__clock-icon`]} size={13} />
          </div>
          <span className={styles[`${BLOCK}__time`]}>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
});

export { DateTimeDisplay };
