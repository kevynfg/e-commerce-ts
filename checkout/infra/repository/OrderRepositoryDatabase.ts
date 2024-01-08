import 'dotenv/config';
import Order from "../../domain/Order";
import OrderRepository from "../../repository/OrderRepository";
import pgp from 'pg-promise';

export default class OrderRepositoryDatabase implements OrderRepository {
  async save(order: Order): Promise<void> {
      const connection = pgp()(process.env.PGSQL_URL!);
      await connection.query(`insert into commerce.order (order_id, product_id, product_name, email, status)`,
       [order.generateId(), order.productId, order.productName, order.email, order.getStatus()]
      )
      await connection.$pool.end();
  }
}