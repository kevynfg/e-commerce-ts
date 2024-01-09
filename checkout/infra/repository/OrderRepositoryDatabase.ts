import 'dotenv/config';
import Order from "../../domain/Order";
import OrderRepository, { Output } from "../../repository/OrderRepository";
import pgp from 'pg-promise';

export default class OrderRepositoryDatabase implements OrderRepository {
  async save(order: Order): Promise<Output> {
      const connection = pgp()(process.env.PGSQL_URL!);
      const res = await connection.one(`insert into "order" (order_id, product_id, email, status) values ($1, $2, $3, $4) returning *`,
      [order.generateId(), order.productId, order.email, order.getStatus()]
      )
      await connection.$pool.end();
      return {
        orderId: res.order_id,
        productId: res.product_id,
        email: res.email,
        status: res.status
      }
  }
}