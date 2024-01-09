import crypto from 'crypto';

export default class Order {
  constructor(readonly orderId: string, readonly productId: string, readonly email: string, private status?: string) {}

  confirm() {
    this.status = 'confirmed'
  }

  getStatus() {
    return this.status;
  }

  static generateId() {
    return crypto.randomUUID();
  }

  static create(productId: string, email: string) {
    const status = 'pending_payment';
    const orderId = Order.generateId();
    return new Order(orderId, productId, email, status)
  }
}