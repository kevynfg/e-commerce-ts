CREATE TABLE IF NOT EXISTS product (
  product_id uuid,
  product_name text,
  value float
);

CREATE TABLE IF NOT EXISTS order (
  order_id uuid,
  product_id uuid,
  email text,
  status text
);

