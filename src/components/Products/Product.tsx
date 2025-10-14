import { memo, useCallback } from "react";
import clsx from "clsx";
import { Trash } from "react-bootstrap-icons";
import { formatDateTime } from "@/utils/dateTime";
import type { TProductProps } from "./types";
import styles from "./Products.module.scss";

const BLOCK = "product-item";

export const ProductRow = memo(
  ({ title, serialNumber, isNew, guarantee, price }: TProductProps) => {
    const dateTime = useCallback(
      (date: Date, formatString: string) =>
        formatDateTime({
          dateString: date,
          formatString,
        }),
      []
    );

    return (
      <tr className={styles[BLOCK]}>
        <td className={styles[`${BLOCK}__content`]}>
          <div>
            <div
              className={clsx(
                styles[`${BLOCK}__status-dot`],
                isNew === 1
                  ? styles[`${BLOCK}__status-dot-new`]
                  : styles[`${BLOCK}__status-dot-used`]
              )}
            ></div>
          </div>

          <div className={styles[`${BLOCK}__name`]} title={title}>
            <span>{title}</span>
            <span>{serialNumber}</span>
          </div>

          <div className={styles[`${BLOCK}__state`]}>
            {isNew === 1 ? (
              <span className={styles[`${BLOCK}__state-new`]}>Available</span>
            ) : (
              <span className={styles[`${BLOCK}__state-used`]}>In Repair</span>
            )}
          </div>

          <div className={styles[`${BLOCK}__guarantee`]}>
            <span>
              <span>from</span> {dateTime(guarantee.start, "dd / MM / yyyy")}
            </span>
            <span>
              <span>to</span> {dateTime(guarantee.end, "dd / MM / yyyy")}
            </span>
          </div>

          <div className={styles[`${BLOCK}__status`]}>
            {isNew === 1 ? "new" : "used"}
          </div>

          <div className={styles[`${BLOCK}__price`]}>
            {price.map(({ symbol, isDefault, value }) => {
              if (isDefault === 0) {
                return (
                  <span
                    className={styles[`${BLOCK}__price-not-default`]}
                    key={symbol}
                  >
                    {value} {symbol}
                  </span>
                );
              }

              return (
                <span key={symbol}>
                  {value} {symbol}
                </span>
              );
            })}
          </div>

          <div
            className={styles[`${BLOCK}__order`]}
            title="Длинное предлинное длиннющее название прихода"
          >
            Длинное предлинное длиннющее название прихода
          </div>

          <div className={styles[`${BLOCK}__delete-btn`]}>
            <Trash size={18} />
          </div>
        </td>
      </tr>
    );
  }
);
