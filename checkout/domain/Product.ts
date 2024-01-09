import crypto from 'crypto';

export default class Product {
  constructor(readonly productName: string, readonly value: number) {}

  generateId() {
    return crypto.randomUUID();
  }

  static create(productName: string, value: number) {
    return new Product(productName, value);
  }
}