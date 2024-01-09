import 'dotenv/config';
import pgp from 'pg-promise';
import Product from "../../domain/Product";
import ProductRepository, { Output } from "../../repository/ProductRepository";

export default class ProductRepositoryDatabase implements ProductRepository {
  async save(product: Product): Promise<Output> {
      const connection = pgp()(process.env.PGSQL_URL!);
      const res = await connection.one(`insert into product (product_id, product_name, value) values ($1, $2, $3) returning *`,
       [product.generateId(), product.productName, product.value]
      );
      await connection.$pool.end();
      return {
        productId: res.product_id,
        productName: res.product_name,
        value: res.value
      }
  }

  async get(productId: string): Promise<Output> {
    const connection = pgp()(process.env.PGSQL_URL!);
    const [product] = await connection.query(`select * from product where product_id = $1`, [productId])
    await connection.$pool.end();
    return {
      productId: product.product_id,
      productName: product.product_name,
      value: product.value
    };
  }
}