import Order from "../domain/Order";

export default interface OrderRepository {
  save(order: Order): Promise<void>
}