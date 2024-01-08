import 'dotenv/config';
import pgp from 'pg-promise';
import Product from "../../domain/Product";
import ProductRepository, { Output } from "../../repository/ProductRepository";

export default class ProductRepositoryDatabase implements ProductRepository {
  async save(product: Product): Promise<Output> {
      const connection = pgp()(process.env.PGSQL_URL!);
      const res = await connection.query(`insert into commerce.product (product_name, value) values ($1, $2)`,
       [product.productName, product.value]
      )
      console.log('res', res)
      await connection.$pool.end();
      return {
        productId: res.product_id,
        productName: res.productName,
        value: res.value
      }
  }
}