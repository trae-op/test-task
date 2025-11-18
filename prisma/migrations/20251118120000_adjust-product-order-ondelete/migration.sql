-- Adjust Product.order foreign key to avoid cascading deletes when an order is removed.
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_orderId_fkey";
ALTER TABLE "Product"
  ADD CONSTRAINT "Product_orderId_fkey"
  FOREIGN KEY ("orderId")
  REFERENCES "Order"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;
