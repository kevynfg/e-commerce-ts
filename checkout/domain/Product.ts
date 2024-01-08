export default class Product {
  constructor(readonly productName: string, readonly value: number) {}

  static create(productName: string, value: number) {
    return new Product(productName, value);
  }
}