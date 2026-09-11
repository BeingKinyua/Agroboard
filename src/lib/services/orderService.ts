import { Order, OrderStatus } from '../../types';
import { INITIAL_ORDERS } from '../../mock/initialData';

export interface OrderService {
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>): Promise<Order>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null>;
  updateItemPicked(orderId: string, productId: string, pickedQty: number): Promise<Order | null>;
}

class MockOrderService implements OrderService {
  private orders: Order[] = [...INITIAL_ORDERS];

  async getOrders(): Promise<Order[]> {
    return [...this.orders];
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.find(o => o.id === id) || null;
  }

  async createOrder(data: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>): Promise<Order> {
    const orderNumber = `AG-ORD-2026-${1040 + this.orders.length + 1}`;
    const newOrder: Order = {
      ...data,
      id: `ord-${Date.now()}`,
      orderNumber,
      orderDate: new Date().toISOString().substring(0, 10)
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;
    this.orders[idx] = { ...this.orders[idx], status };
    return this.orders[idx];
  }

  async updateItemPicked(orderId: string, productId: string, pickedQty: number): Promise<Order | null> {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;
    const order = this.orders[idx];
    const updatedItems = order.items.map(it => it.productId === productId ? { ...it, quantityPicked: pickedQty } : it);
    const allPicked = updatedItems.every(it => it.quantityPicked >= it.quantityOrdered);
    this.orders[idx] = {
      ...order,
      items: updatedItems,
      status: allPicked ? 'Packed' : 'Picking'
    };
    return this.orders[idx];
  }
}

export const orderService: OrderService = new MockOrderService();
