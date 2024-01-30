import Order from "../domain/Order";
import Product from "../domain/Product";
import Queue from "../infra/queue/queue";
import OrderRepository from "../repository/OrderRepository";
import ProductRepository from "../repository/ProductRepository";
export default class Checkout {
  constructor(readonly productRepository: ProductRepository, readonly orderRepository: OrderRepository, readonly queue: Queue) {}

  async create(input: Input) {
    const product = new Product(input.productName, input.value);
    const productRes = await this.productRepository.save(product);
    
    const createdProduct = await this.productRepository.get(productRes.productId);
    if (!createdProduct) throw new Error('Product not found');
    
    const order = Order.create(createdProduct.productId, input.email);
    if (!order) throw new Error('Order not created');
    
    try {
      const orderCreated = await this.orderRepository.save(order);
      await this.queue.publish('orderPlaced', {
        orderId: orderCreated.orderId,
        status: orderCreated.status,
        email: orderCreated.email
      });
    } catch (error) {
      console.log('error', error)      
    }
  }
}

export type Input = {
  productName: string;
  value: number;
  email: string
}