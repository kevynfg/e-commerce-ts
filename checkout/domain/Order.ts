import crypto from 'crypto';

export default class Order {
  constructor(readonly productId: string, readonly productName: string, readonly email: string, private status: string) {}

  confirm() {
    this.status = 'confirmed'
  }

  getStatus() {
    return this.status;
  }

  generateId() {
    return crypto.randomUUID();
  }

  static create(productId: string, productName: string, email: string) {
    const status = 'pending_payment';
    return new Order(productId, productName, email, status)
  }
}