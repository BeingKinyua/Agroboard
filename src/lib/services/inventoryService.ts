import { InventoryItem, StockAdjustment } from '../../types';
import { INITIAL_INVENTORY_ITEMS, INITIAL_STOCK_ADJUSTMENTS } from '../../mock/initialData';

export interface InventoryService {
  getInventoryItems(): Promise<InventoryItem[]>;
  getStockAdjustments(): Promise<StockAdjustment[]>;
  addStockAdjustment(adjustment: Omit<StockAdjustment, 'id' | 'date'>): Promise<StockAdjustment>;
}

class MockInventoryService implements InventoryService {
  private items: InventoryItem[] = [...INITIAL_INVENTORY_ITEMS];
  private adjustments: StockAdjustment[] = [...INITIAL_STOCK_ADJUSTMENTS];

  async getInventoryItems(): Promise<InventoryItem[]> {
    return [...this.items];
  }

  async getStockAdjustments(): Promise<StockAdjustment[]> {
    return [...this.adjustments];
  }

  async addStockAdjustment(data: Omit<StockAdjustment, 'id' | 'date'>): Promise<StockAdjustment> {
    const newAdj: StockAdjustment = {
      ...data,
      id: `adj-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.adjustments.unshift(newAdj);
    return newAdj;
  }
}

export const inventoryService: InventoryService = new MockInventoryService();
