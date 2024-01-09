import RabbitMQ from "./infra/queue/RabbitMqAdapter";
import OrderRepositoryDatabase from "./infra/repository/OrderRepositoryDatabase";
import ConfirmOrder from "./usecase/ConfirmOrder";

async function main() {
  const queue = new RabbitMQ();
  await queue.connect();
  const orderRepository = new OrderRepositoryDatabase();
  const order = new ConfirmOrder(orderRepository);
  queue.consume('paymentApproved', async(input: any) => {
    await order.confirm(input);
  })
}

main();