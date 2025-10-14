import { memo, useMemo } from "react";
import Table from "react-bootstrap/Table";
import { TProductsProps } from "./types";
import { ProductRow } from "./Product";
import styles from "./Products.module.scss";

export const ProductTable = memo((props: TProductsProps) => {
  const { items } = props;

  const itemsToRender = useMemo(() => items, [items]);

  if (!itemsToRender || itemsToRender.length === 0) {
    return null;
  }

  return (
    <div className={styles["table-scroll-wrapper"]}>
      <Table className={styles["product-table"]} borderless>
        <tbody>
          {itemsToRender.map((item) => (
            <ProductRow key={item.id} data={item} />
          ))}
        </tbody>
      </Table>
    </div>
  );
});
