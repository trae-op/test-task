import { memo } from "react";
import { Trash, ListUl } from "react-bootstrap-icons";
import { TOrderProps } from "./types";
import styles from "./Orders.module.scss";

const BLOCK = "order-item";

export const OrderRow = memo((props: TOrderProps) => {
  const { data } = props;
  const { name, productCount, date, priceUSD, priceUAH } = data;

  return (
    <tr className={styles[BLOCK]}>
      <td className={styles[`${BLOCK}__content`]}>
        <div className={styles[`${BLOCK}__name`]} title={name}>
          {name}
        </div>
        <div className={styles[`${BLOCK}__details`]}>
          <div className={styles[`${BLOCK}__detail-item`]}>
            <div className={styles[`${BLOCK}__container-icon`]}>
              <ListUl className={styles[`${BLOCK}__icon`]} size={15} />
            </div>
            <div>
              <div className={styles[`${BLOCK}__count`]}>{productCount}</div>
              <div className={styles[`${BLOCK}__secondary-text`]}>Продукта</div>
            </div>
          </div>

          <div className={styles[`${BLOCK}__detail-item`]}>
            <div>
              <div className={styles[`${BLOCK}__primary-text`]}>
                {date.day} / {date.month}
              </div>
              <div className={styles[`${BLOCK}__secondary-text`]}>
                {date.year}
              </div>
            </div>
          </div>

          <div className={styles[`${BLOCK}__price-group`]}>
            {priceUSD && (
              <div className={styles[`${BLOCK}__price-group--usd`]}>
                {priceUSD.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
            )}
            <div className={styles[`${BLOCK}__secondary-text`]}>
              {priceUAH.toLocaleString("uk-UA", {
                style: "currency",
                currency: "UAH",
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
        <div className={styles[`${BLOCK}__delete-btn`]}>
          <Trash size={18} />
        </div>
      </td>
    </tr>
  );
});
