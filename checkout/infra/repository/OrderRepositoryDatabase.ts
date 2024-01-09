import 'dotenv/config';
import Order from "../../domain/Order";
import OrderRepository, { Output } from "../../repository/OrderRepository";
import pgp from 'pg-promise';

export default class OrderRepositoryDatabase implements OrderRepository {
  async save(order: Order): Promise<Output> {
      const connection = pgp()(process.env.PGSQL_URL!);
      const res = await connection.one(`insert into "order" (order_id, product_id, email, status) values ($1, $2, $3, $4) returning *`,
      [order.orderId, order.productId, order.email, order.getStatus()]
      )
      await connection.$pool.end();
      return {
        orderId: res.order_id,
        productId: res.product_id,
        email: res.email,
        status: res.status
      }
  }

  async get(orderId: string): Promise<Order> {
    const connection = pgp()(process.env.PGSQL_URL!);
    const res = await connection.one(`select order_id, status, email from "order" where order_id = $1`,
    [orderId]
    )
    await connection.$pool.end();
    return new Order(
      res.order_id,
      res.product_id,
      res.email,
      res.status
    )
  }

  async update(order: Order): Promise<void> {
    const connection = pgp()(process.env.PGSQL_URL!);
    await connection.query(`update "order" set status = $1 where order_id = $2`,
      [order.getStatus(), order.orderId]
    )
    await connection.$pool.end();
  }
}