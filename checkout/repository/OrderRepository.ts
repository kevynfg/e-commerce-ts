import Order from "../domain/Order";

export default interface OrderRepository {
  save(order: Order): Promise<Output>
  get(orderId: string): Promise<Order>
  update(order: Order): Promise<void>
}

export type Output = {
  orderId: string;
  productId: string;
  email: string;
  status: string;
}