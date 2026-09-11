import { PurchaseOrder, POStatus, GoodsReceivedNote } from '../../types';
import { INITIAL_PURCHASE_ORDERS, INITIAL_GOODS_RECEIPTS } from '../../mock/initialData';

export interface ProcurementService {
  getPurchaseOrders(): Promise<PurchaseOrder[]>;
  getGoodsReceipts(): Promise<GoodsReceivedNote[]>;
  createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdDate'>): Promise<PurchaseOrder>;
  updatePOStatus(id: string, status: POStatus): Promise<PurchaseOrder | null>;
  createGoodsReceipt(grn: Omit<GoodsReceivedNote, 'id' | 'grnNumber' | 'receivedDate'>): Promise<GoodsReceivedNote>;
}

class MockProcurementService implements ProcurementService {
  private pos: PurchaseOrder[] = [...INITIAL_PURCHASE_ORDERS];
  private grns: GoodsReceivedNote[] = [...INITIAL_GOODS_RECEIPTS];

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return [...this.pos];
  }

  async getGoodsReceipts(): Promise<GoodsReceivedNote[]> {
    return [...this.grns];
  }

  async createPurchaseOrder(data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdDate'>): Promise<PurchaseOrder> {
    const poNumber = `PO-2026-${108 + this.pos.length + 1}`;
    const newPO: PurchaseOrder = {
      ...data,
      id: `po-${Date.now()}`,
      poNumber,
      createdDate: new Date().toISOString().substring(0, 10)
    };
    this.pos.unshift(newPO);
    return newPO;
  }

  async updatePOStatus(id: string, status: POStatus): Promise<PurchaseOrder | null> {
    const idx = this.pos.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.pos[idx] = { ...this.pos[idx], status };
    return this.pos[idx];
  }

  async createGoodsReceipt(data: Omit<GoodsReceivedNote, 'id' | 'grnNumber' | 'receivedDate'>): Promise<GoodsReceivedNote> {
    const grnNumber = `GRN-2026-${108 + this.grns.length + 1}`;
    const newGRN: GoodsReceivedNote = {
      ...data,
      id: `grn-${Date.now()}`,
      grnNumber,
      receivedDate: new Date().toISOString().substring(0, 10)
    };
    this.grns.unshift(newGRN);
    return newGRN;
  }
}

export const procurementService: ProcurementService = new MockProcurementService();
