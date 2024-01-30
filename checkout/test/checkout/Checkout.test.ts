import Order from "../../domain/Order";
import OrderRepository, { Output } from "../../repository/OrderRepository";
import ProductRepository from "../../repository/ProductRepository";
import Checkout from '../../usecase/Checkout';

jest.mock('crypto', () => ({
  randomUUID: () => 'any_order_id',
}));

class OrderRepositoryMock implements OrderRepository {
  async get(orderId: string): Promise<Order> {
    const order = Order.create('any_product_id', 'any_email');
    return Promise.resolve({
      ...order,
      orderId: 'any_order_id',
    } as Order);
  }

  save(order: Order): Promise<Output> {
    return Promise.resolve({
      orderId: 'any_order_id',
      productId: 'any_product_id',
      email: 'any_email',
      status: 'any_status',
    });
  }

  update(order: Order): Promise<void> {
    return Promise.resolve();
  }
}

class ProductRepositoryMock implements ProductRepository {
  async get(productId: string) {
    return Promise.resolve({
      productId: 'any_product_id',
      productName: 'product name',
      value: 10,
    });
  }

  async save(product: any) {
    return Promise.resolve({
      productId: 'any_product_id',
      productName: 'product name',
      value: 10,
    });
  }
}

const mockRabbitMq = () => {
  return {
    connect: jest.fn(),
    consume: jest.fn(),
    publish: jest.fn(),
  }
};

type SutTypes = {
  sut: Checkout;
  orderRepository: OrderRepository;
  productRepository: ProductRepository;
}

const makeSut = (): SutTypes => {
  const orderRepository = new OrderRepositoryMock();
  const productRepository = new ProductRepositoryMock();
  const checkout = new Checkout(productRepository, orderRepository, mockRabbitMq());
  return {
    sut: checkout,
    orderRepository,
    productRepository,
  }
}

describe('Checkout', () => {
  it('should publish a order', async () => {
    const { sut, productRepository, orderRepository } = makeSut();
    const order = {
      productName: 'product name',
      value: 10,
      email: 'email'
    };

    const product = {
      productName: 'product name',
      value: 10,
    };
    const orderSpy = jest.spyOn(sut, 'create');

    const productSaveSpy = jest.spyOn(productRepository, 'save')
    const productGetSpy = jest.spyOn(productRepository, 'get')

    const orderCreateSpy = jest.spyOn(orderRepository, 'save')

    const expected = {
      productId: 'any_product_id',
      email: 'email',
      status: 'pending_payment',
      orderId: 'any_order_id',
    };

    const createdOrder = {
      orderId: 'any_order_id',
      status: 'any_status',
      email: 'any_email',
    };

    const queueSpy = jest.spyOn(sut.queue, 'publish');

    await sut.create(order);

    expect(orderSpy).toHaveBeenCalledWith(order);

    expect(productSaveSpy).toHaveBeenCalledWith(product);
    expect(productGetSpy).toHaveBeenCalledWith('any_product_id');

    expect(orderCreateSpy).toHaveBeenCalledWith(expected);

    expect(queueSpy).toHaveBeenCalledWith('orderPlaced', createdOrder);
  })
  it('should throw if product not found', async () => {
    const { sut, productRepository } = makeSut();
    const order = {
      productName: 'product name',
      value: 10,
      email: 'email'
    };

    jest.spyOn(productRepository, 'get').mockRejectedValueOnce(new Error('Product not found'));

    await expect(sut.create(order)).rejects.toThrow('Product not found');
  })
  it('should throw if order not created', async () => {
    const { sut } = makeSut();
    const order = {
      productName: 'product name',
      value: 10,
      email: 'email'
    };

    jest.spyOn(Order, 'create').mockReturnValueOnce(undefined as any);
    await expect(sut.create(order)).rejects.toThrow('Order not created');
  })
});