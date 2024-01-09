import RabbitMQ from "../infra/queue/RabbitMqAdapter";
import OrderRepositoryDatabase from "../infra/repository/OrderRepositoryDatabase";
import ProductRepositoryDatabase from "../infra/repository/ProductRepositoryDatabase"
import Checkout from "../usecase/Checkout"

test('should complete a checkout', async function() {
  const productRepository = new ProductRepositoryDatabase();
  const orderRepository = new OrderRepositoryDatabase();
  const queue = new RabbitMQ();
  queue.connect();
  const checkout = new Checkout(productRepository, orderRepository, queue);
  await checkout.create({
    productName: 'product name',
    value: 10,
    email: 'email'
  })
  console.log('checkout', checkout);
})