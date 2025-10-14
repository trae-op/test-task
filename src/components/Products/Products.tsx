import { memo } from "react";
import Table from "react-bootstrap/Table";
import { TProductsProps } from "./types";
import { ProductRow } from "./Product";
import styles from "./Products.module.scss";

export const ProductsTable = memo((props: TProductsProps) => {
  const { items } = props;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={styles["table-scroll-wrapper"]}>
      <Table className={styles["product-table"]} borderless>
        <tbody>
          {items.map((item) => (
            <ProductRow key={item.id} data={item} />
          ))}
        </tbody>
      </Table>
    </div>
  );
});
