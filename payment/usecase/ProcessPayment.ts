import Queue from "../queue/queue";

export default class ProcessPayment {
  constructor(readonly queue: Queue) {}

  async execute(input: Input): Promise<void> {
    const paymentApproved = {
      orderId: input.orderId,
      status: 'success'
    }
    await this.queue.publish("paymentApproved", paymentApproved);
    console.log('processed', paymentApproved)
  }
}

export type Input = {
  orderId: string;
  status: string;
  email: string;
}