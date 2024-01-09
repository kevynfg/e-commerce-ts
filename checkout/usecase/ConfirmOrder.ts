import OrderRepository from "../repository/OrderRepository";

export default class ConfirmOrder {
  constructor(readonly orderRepository: OrderRepository) {}

  async confirm(input: Input) {
    console.log('order', input);
    const order = await this.orderRepository.get(input.orderId)
    if (!order)
      throw Error(`order don't exists or invalid orderId`)

    if (input.status === 'success') {
      order.confirm();
      await this.orderRepository.update(order);
      console.log('order updated')
    }
  }
}

export type Input = {
  orderId: string;
  email: number;
  status: string
}