import { memo } from "react";
import { Trash, ListUl } from "react-bootstrap-icons";
import { Picture } from "@/components/ui/Picture";
import { TProductProps } from "./types";
import styles from "./Products.module.scss";

const BLOCK = "product-item";

export const ProductRow = memo((props: TProductProps) => {
  const { data } = props;
  const {
    name,
    sku,
    image,
    status,
    availabilityLabel,
    period,
    condition,
    inStock,
    priceUSD,
    priceUAH,
    groupName,
    ownerName,
    receiptName,
    receiptDate,
  } = data;

  return (
    <tr className={styles[BLOCK]}>
      <td className={styles[`${BLOCK}__content`]}>
        <div className={styles[`${BLOCK}__left`]}>
          <span
            className={styles[`${BLOCK}__status-dot`]}
            data-status={status}
            aria-label={availabilityLabel}
          />
          <Picture src={image || ""} alt={name} size="sm" />
        </div>
        <div className={styles[`${BLOCK}__name-group`]}>
          <a href="#" className={styles[`${BLOCK}__name`]} title={name}>
            {name}
          </a>
          <div className={styles[`${BLOCK}__sku`]}>SN-{sku}</div>
        </div>
        <div className={styles[`${BLOCK}__details`]}>
          <div className={styles[`${BLOCK}__detail-item`]}>
            {availabilityLabel}
          </div>
          <div className={styles[`${BLOCK}__detail-item`]}>
            c&nbsp;{period.from.day} / {period.from.month} / {period.from.year}
            &nbsp;по&nbsp;{period.to.day} / {period.to.month} / {period.to.year}
          </div>
          <div className={styles[`${BLOCK}__detail-item`]}>
            {condition === "new" ? "новый" : "Б / У"}
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
            <div>
              {priceUAH.toLocaleString("uk-UA", {
                style: "currency",
                currency: "UAH",
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className={styles[`${BLOCK}__detail-item`]}>
            {groupName ? (
              <a href="#" className={styles[`${BLOCK}__link`]}>
                {groupName}
              </a>
            ) : (
              "—"
            )}
          </div>
          <div className={styles[`${BLOCK}__detail-item`]}>
            {ownerName ? (
              <a href="#" className={styles[`${BLOCK}__link`]}>
                {ownerName}
              </a>
            ) : (
              "—"
            )}
          </div>
          <div className={styles[`${BLOCK}__detail-item`]}>
            <a href="#" className={styles[`${BLOCK}__link`]}>
              {receiptName}
            </a>
          </div>
          <div className={styles[`${BLOCK}__detail-item`]}>
            {receiptDate.day} / {receiptDate.month} / {receiptDate.year}
          </div>
          <div className={styles[`${BLOCK}__delete-btn`]}>
            <Trash size={18} />
          </div>
        </div>
      </td>
    </tr>
  );
});
