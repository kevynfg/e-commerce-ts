import Order from "../domain/Order";
import Product from "../domain/Product";
import OrderRepository from "../repository/OrderRepository";
import ProductRepository from "../repository/ProductRepository";
import crypto from 'crypto';

export default class Checkout {
  constructor(readonly productRepository: ProductRepository, readonly orderRepository: OrderRepository) {}

  async create(input: Input) {
    const product = new Product(input.productName, input.value);
    console.log('product repo', product)
    const productRes = await this.productRepository.save(product);
    if (productRes) {
      const orderId = new Order(productRes.product_id)
      const orderRes = new Order(input.email, product);
    }
    return product
  }
}

export type Input = {
  productName: string;
  value: number;
  email: string
}