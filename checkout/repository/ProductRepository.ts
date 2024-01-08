import Product from "../domain/Product";

export default interface ProductRepository {
  save(product: Product): Promise<Output>
}

export type Output = {
  productId: string;
  productName: string;
  value: number;
}