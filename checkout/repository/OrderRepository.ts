import Order from "../domain/Order";

export default interface OrderRepository {
  save(order: Order): Promise<Output>
}

export type Output = {
  orderId: string;
  productId: string;
  email: string;
  status: string;
}