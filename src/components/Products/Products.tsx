import { memo } from "react";
import Table from "react-bootstrap/Table";
import { ProductRow } from "./Product";
import type { TProductsProps } from "./types";
import styles from "./Products.module.scss";

export const ProductsTable = memo(({ items }: TProductsProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={styles["table-scroll-wrapper"]}>
      <Table className={styles["product-table"]} borderless>
        <tbody>
          {items.map((product) => (
            <ProductRow key={product.id} {...product} />
          ))}
        </tbody>
      </Table>
    </div>
  );
});
