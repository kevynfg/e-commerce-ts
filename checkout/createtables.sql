CREATE TABLE IF NOT EXISTS commerce.product (
  product_id uuid,
  product_name text,
  value float
)

CREATE TABLE IF NOT EXISTS commerce.order (
  order_id uuid,
  product_id uui,
  email text,
  status text
)

