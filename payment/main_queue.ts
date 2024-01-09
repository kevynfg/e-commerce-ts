import RabbitMQ from "./queue/RabbitMqAdapter";
import ProcessPayment from "./usecase/ProcessPayment";

async function main() {
  const queue = new RabbitMQ();
  await queue.connect();
  const processPayment = new ProcessPayment(queue);
  queue.consume('orderPlaced', async(input: any) => {
    await processPayment.execute(input);
  })
}

main();